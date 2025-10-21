import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { getDb } from '@/lib/database-client'
import { rateLimitByIp} from '@/lib/rate-limit'
import { CompetitiveIntelligenceContextService} from '@/lib/competitive-intelligence-context'
import { z} from 'zod'
import { gateConversation, gateAgentAccess } from '@/lib/feature-gate-middleware'
import { incrementConversationCount, trackAgentAccess } from '@/lib/usage-tracking'

// Using Node.js runtime for database and complex operations
export const runtime = 'nodejs'

// Type for Cloudflare service bindings
interface Env {
  OPENAI_WORKER: {
    fetch: (request: Request) => Promise<Response>
  }
}



// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Basic rate limiting per IP for chat
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('chat', ip, 10_000, 10)
    if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const BodySchema = z.object({
      message: z.string().min(1),
      agentId: z.string().optional(),
    })
    const parsed = BodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    const { message, agentId } = parsed.data

    // Check conversation limit (feature gating)
    const conversationGate = await gateConversation(user.id)
    if (!conversationGate.allowed) {
      return NextResponse.json(
        {
          error: conversationGate.error,
          upgradeRequired: conversationGate.upgradeRequired,
          limit: conversationGate.limit
        },
        { status: 403 }
      )
    }

    // Check agent access if specific agent requested
    if (agentId) {
      const agentGate = await gateAgentAccess(user.id, agentId)
      if (!agentGate.allowed) {
        return NextResponse.json(
          {
            error: agentGate.error,
            upgradeRequired: agentGate.upgradeRequired,
            limit: agentGate.limit
          },
          { status: 403 }
        )
      }
      
      // Track agent access
      await trackAgentAccess(user.id, agentId)
    }

    // Increment conversation count
    await incrementConversationCount(user.id)

    // Get competitive intelligence context
    const competitiveContext = await CompetitiveIntelligenceContextService.getCompetitiveContext(user.id, agentId)
    
    // Get agent-specific prompts with competitive intelligence integration
    const agentPrompts = CompetitiveIntelligenceContextService.getAgentCompetitivePrompts()
    const _agentId_typed = agentId as keyof typeof agentPrompts
    
    // Get agent personality based on agentId
    const agentPersonalities = {
      'roxy': agentPrompts.roxy?.system_prompt || 'You are Roxy, a strategic business advisor. Use the SPADE framework for decision-making.',
      'blaze': agentPrompts.blaze?.system_prompt || 'You are Blaze, a growth and marketing expert. Use cost-benefit analysis for recommendations.',
      'glitch': agentPrompts.glitch?.system_prompt || 'You are Glitch, a problem-solving specialist. Use the Five Whys framework.',
      'lumi': agentPrompts.lumi?.system_prompt || 'You are Lumi, a compliance and legal expert. Focus on GDPR, CCPA, and business compliance.',
      'nova': agentPrompts.nova?.system_prompt || 'You are Nova, a productivity and time management coach.',
      'echo': agentPrompts.echo?.system_prompt || 'You are Echo, a communication and networking specialist.',
      'vex': agentPrompts.vex?.system_prompt || 'You are Vex, a technical and systems optimization expert.',
      'lexi': agentPrompts.lexi?.system_prompt || 'You are Lexi, a creative and branding strategist.'
    }

    const agentPersonality = agentPersonalities[agentId as keyof typeof agentPersonalities] || 
      'You are a helpful AI assistant for SoloSuccess AI platform.'
    
    // Format competitive intelligence context for the agent
    const competitiveContextString = CompetitiveIntelligenceContextService.formatContextForAgent(
      competitiveContext, 
      agentId || 'general', 
      message
    )

    // Ensure user exists in database
    const db = getDb()
    let { rows: userData } = await client.query(
      'SELECT id FROM users WHERE id = $1',
      [user.id]
    )

    if (userData.length === 0) {
      // Create user if they don't exist
      await client.query(
        `INSERT INTO users (id, email, full_name, avatar_url, subscription_tier, level, total_points, current_streak, wellness_score, focus_minutes, onboarding_completed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          user.id,
          user.email,
          user.full_name,
          user.avatar_url,
          'free',
          1,
          0,
          0,
          50,
          0,
          false
        ]
      )
    }

    // Save conversation to database
    const { rows: [conversation] } = await client.query(
      `INSERT INTO conversations (user_id, agent_id, message, response, created_at)
       VALUES ($1, $2, $3, '', NOW())
       RETURNING *`,
      [user.id, agentId || 'general', message]
    )

    // Call OpenAI Worker via service binding
    const systemPrompt = `${agentPersonality} You are helping a SoloSuccess AI user. Be helpful, professional, and use frameworks when appropriate.${competitiveContextString}`
    
    // Get the service binding from the environment
    const env = process.env as unknown as Env
    const openaiWorker = env.OPENAI_WORKER

    if (!openaiWorker) {
      logError('OpenAI Worker service binding not found')
      return NextResponse.json({ error: 'AI service temporarily unavailable' }, { status: 503 })
    }

    // Create request to OpenAI worker
    const workerRequest = new Request('https://worker/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        agentId,
        systemPrompt,
        user: {
          id: user.id,
          email: user.email
        }
      })
    })

    // Call the worker
    const workerResponse = await openaiWorker.fetch(workerRequest)

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text()
      logError('OpenAI Worker error:', errorText)
      return NextResponse.json({ error: 'AI processing failed' }, { status: 500 })
    }

    // The worker returns a streaming response, pass it through
    return new Response(workerResponse.body, {
      headers: workerResponse.headers
    })
  } catch (error) {
    logError('Error in chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}