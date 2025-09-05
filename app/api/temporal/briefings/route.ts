import { NextRequest, NextResponse } from 'next/server'
import { Connection, Client } from '@temporalio/client'
import { aiAgentBriefingWorkflow } from '@/src/workflows'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'

const BriefingRequestSchema = z.object({
  userId: z.string(),
  agentIds: z.array(z.enum(['Roxy', 'Blaze', 'Echo', 'Lumi', 'Vex', 'Lexi', 'Nova', 'Glitch'])),
  briefingType: z.enum(['daily', 'weekly', 'monthly']),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('temporal:briefings', ip, 60_000, 15)
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
    const parsed = BriefingRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { userId, agentIds, briefingType } = parsed.data

    // Connect to Temporal
    const connection = await Connection.connect({
      address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    })

    const client = new Client({
      connection,
      namespace: process.env.TEMPORAL_NAMESPACE || 'default',
    })

    // Start the AI agent briefing workflow
    const handle = await client.workflow.start(aiAgentBriefingWorkflow, {
      args: [userId, agentIds, briefingType],
      taskQueue: 'soloboss-tasks',
      workflowId: `briefing-${userId}-${briefingType}-${Date.now()}`,
    })

    console.log(`Started briefing workflow ${handle.workflowId} for user ${userId}`)

    // Return immediately with workflow ID
    return NextResponse.json({
      success: true,
      workflowId: handle.workflowId,
      message: `${briefingType} AI agent briefing workflow started`,
      userId,
      agentIds,
      briefingType,
    })

  } catch (error) {
    console.error('Error starting briefing workflow:', error)
    return NextResponse.json(
      { error: 'Failed to start briefing workflow' },
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
    console.error('Error getting briefing workflow status:', error)
    return NextResponse.json(
      { error: 'Failed to get workflow status' },
      { status: 500 }
    )
  }
}
