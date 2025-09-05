import { NextRequest, NextResponse } from 'next/server'
import { Connection, Client } from '@temporalio/client'
import { competitiveIntelligenceProcessingWorkflow } from '@/src/workflows'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'

const IntelligenceRequestSchema = z.object({
  userId: z.string(),
  competitorData: z.array(z.object({
    name: z.string(),
    industry: z.string(),
    threatLevel: z.enum(['low', 'medium', 'high']),
    website: z.string().optional(),
    description: z.string().optional(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('temporal:intelligence', ip, 60_000, 20)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const parsed = IntelligenceRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { userId, competitorData } = parsed.data

    // Connect to Temporal
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
      // Add TLS and API key configuration for Temporal Cloud
      ...(process.env.TEMPORAL_ADDRESS?.includes('temporal.io') && {
        tls: true,
        apiKey: process.env.TEMPORAL_API_KEY,
      }),
    })

    const client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    })

    // Start the competitive intelligence processing workflow
    const handle = await client.workflow.start(competitiveIntelligenceProcessingWorkflow, {
      args: [userId, competitorData],
      taskQueue: 'soloboss-tasks',
      workflowId: `intelligence-${userId}-${Date.now()}`,
    })

    console.log(`Started intelligence workflow ${handle.workflowId} for user ${userId}`)

    // Return immediately with workflow ID
    return NextResponse.json({
      success: true,
      workflowId: handle.workflowId,
      message: 'Competitive intelligence processing workflow started',
      userId,
      competitorsCount: competitorData.length,
    })

  } catch (error) {
    console.error('Error starting intelligence workflow:', error)
    return NextResponse.json(
      { error: 'Failed to start intelligence workflow' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('workflowId')

    if (!workflowId) {
      return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 })
    }

    // Connect to Temporal
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
      // Add TLS and API key configuration for Temporal Cloud
      ...(process.env.TEMPORAL_ADDRESS?.includes('temporal.io') && {
        tls: true,
        apiKey: process.env.TEMPORAL_API_KEY,
      }),
    })

    const client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    })

    // Get workflow status and result
    const handle = client.workflow.getHandle(workflowId)
    const status = await handle.describe()

    let result = null
    if (status.status.name === 'COMPLETED') {
      try {
        result = await handle.result()
      } catch (error) {
        // Workflow might have failed
        console.error('Error getting workflow result:', error)
      }
    }

    return NextResponse.json({
      workflowId,
      status: status.status.name,
      startTime: status.startTime,
      executionTime: status.executionTime,
      result,
    })

  } catch (error) {
    console.error('Error getting intelligence workflow status:', error)
    return NextResponse.json(
      { error: 'Failed to get workflow status' },
      { status: 500 }
    )
  }
}
