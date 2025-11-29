import { logger, logError } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const incineratorSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(1000),
    targetAudience: z.string().min(1).max(200),
    problemSolved: z.string().min(1).max(500)
})

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown'
        const { allowed } = rateLimitByIp('api', ip, 60000, 10) // Strict rate limit
        if (!allowed) {
            return NextResponse.json(
                { error: 'Too many incineration attempts. Cool down.' },
                { status: 429 }
            )
        }

        // Authentication
        const { user, error } = await authenticateRequest()
        if (error || !user) {
            return NextResponse.json(
                { error: 'Unauthorized access to the Incinerator' },
                { status: 401 }
            )
        }

        // Parse and validate request body
        const body = await request.json()
        const validatedData = incineratorSchema.parse(body)

        // TODO: Integrate with AgentCollaborationSystem for real AI analysis
        // For now, we'll simulate a "brutal" response based on the input length and keywords

        // Simulation Logic
        const score = Math.floor(Math.random() * 60) + 10 // Generally low scores for "brutal" feel
        const isViable = score > 50

        const feedback = [
            "Your target audience is too broad. 'Everyone' is not a customer.",
            "The problem description lacks specific pain points.",
            "Revenue model is unclear. How does this actually make money?",
            "Competitors like X and Y already dominate this space with better funding."
        ]

        const pivots = [
            "Niche down to a specific industry (e.g., instead of 'CRM for everyone', 'CRM for plumbers').",
            "Switch from B2C to B2B enterprise sales.",
            "Focus on the data component rather than the service itself."
        ]

        const marketContext = "The market for this solution is saturated. CAC (Customer Acquisition Cost) will be extremely high without a strong viral loop."

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        return NextResponse.json({
            score,
            feedback: feedback.slice(0, 3), // Return top 3 feedback items
            pivots: pivots.slice(0, 2),     // Return top 2 pivots
            marketContext,
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        logError('Incinerator error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid idea data', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'The Incinerator malfunctioned. Try again.' },
            { status: 500 }
        )
    }
}
