import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { logError, logInfo } from '@/lib/logger'
import { rateLimitByIp } from '@/lib/rate-limit'
import { neon } from '@neondatabase/serverless'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

// POST /api/workflows/[id]/execute - Execute workflow
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 20, window: 3600 }) // 20 executions per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const resolvedParams = await params
    const workflowId = resolvedParams.id

    // Get workflow
    const sql = getSql()
    const workflows = await sql`
      SELECT * FROM workflows 
      WHERE id = ${workflowId} AND user_id = ${user.id}
    `

    if (workflows.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    const workflow = workflows[0]

    // Check if workflow is active
    if (workflow.status !== 'active') {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      )
    }

    // Check if there are running executions
    const runningExecutions = await sql`
      SELECT COUNT(*) as count FROM workflow_executions 
      WHERE workflow_id = ${workflowId} AND status = 'running'
    `

    if (parseInt(runningExecutions[0]?.count || '0') > 0) {
      return NextResponse.json(
        { error: 'Workflow is already running' },
        { status: 400 }
      )
    }

    // Get execution parameters from request body
    const body = await request.json()
    const { input, variables, options } = body || {}

    // Create execution record
    const execution = await sql`
      INSERT INTO workflow_executions (
        workflow_id, user_id, status, started_at, input, variables, options
      ) VALUES (
        ${workflowId}, ${user.id}, 'running', NOW(), 
        ${JSON.stringify(input || {})}, 
        ${JSON.stringify(variables || {})}, 
        ${JSON.stringify(options || {})}
      ) RETURNING *
    `

    const executionId = execution[0].id

    logInfo('Workflow execution started', {
      executionId,
      workflowId,
      userId: user.id,
      workflowName: workflow.name
    })

    // Execute workflow asynchronously
    executeWorkflowAsync(executionId, workflow, input, variables, options)

    return NextResponse.json({
      execution: {
        id: executionId,
        workflowId,
        status: 'running',
        startedAt: execution[0].started_at
      }
    }, { status: 202 })

  } catch (error) {
    logError('Error in POST /api/workflows/[id]/execute:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/workflows/[id]/execute - Get execution status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const workflowId = resolvedParams.id
    const { searchParams } = new URL(request.url)
    const executionId = searchParams.get('executionId')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)

    let executions

    if (executionId) {
      // Get specific execution
      const sql = getSql()
      executions = await sql`
        SELECT * FROM workflow_executions 
        WHERE id = ${executionId} AND workflow_id = ${workflowId} AND user_id = ${user.id}
      `
    } else {
      // Get recent executions for workflow
      const sql = getSql()
      executions = await sql`
        SELECT * FROM workflow_executions 
        WHERE workflow_id = ${workflowId} AND user_id = ${user.id}
        ORDER BY started_at DESC
        LIMIT ${limit}
      `
    }

    return NextResponse.json({
      executions: executions.map(exec => ({
        id: exec.id,
        workflowId: exec.workflow_id,
        status: exec.status,
        startedAt: exec.started_at,
        completedAt: exec.completed_at,
        duration: exec.duration,
        input: exec.input,
        output: exec.output,
        error: exec.error,
        logs: exec.logs
      }))
    })

  } catch (error) {
    logError('Error in GET /api/workflows/[id]/execute:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Async workflow execution function
async function executeWorkflowAsync(
  executionId: string,
  workflow: any,
  input: any,
  variables: any,
  options: any
) {
  try {
    logInfo('Starting workflow execution', { executionId, workflowId: workflow.id })

    // Simulate workflow execution
    // In a real implementation, this would use the WorkflowEngine
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Update execution status to completed
    const sql = getSql()
    await sql`
      UPDATE workflow_executions 
      SET 
        status = 'completed',
        completed_at = NOW(),
        duration = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000,
        output = ${JSON.stringify({ result: 'Workflow executed successfully', input, variables })}
      WHERE id = ${executionId}
    `

    logInfo('Workflow execution completed', { executionId })

  } catch (error) {
    logError('Workflow execution failed', { executionId, error })

    // Update execution status to failed
    const sql = getSql()
    await sql`
      UPDATE workflow_executions 
      SET 
        status = 'failed',
        completed_at = NOW(),
        duration = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000,
        error = ${JSON.stringify({ message: error instanceof Error ? error.message : 'Unknown error' })}
      WHERE id = ${executionId}
    `
  }
}