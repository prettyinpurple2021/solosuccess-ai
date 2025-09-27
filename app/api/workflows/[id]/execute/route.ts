import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { logger, logError, logInfo } from '@/lib/logger'
import { WorkflowEngine } from '@/lib/workflow-engine'
import { rateLimiter } from '@/lib/rate-limiter'

// Initialize workflow engine
const workflowEngine = new WorkflowEngine()

// POST /api/workflows/[id]/execute - Execute workflow
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'workflow-execute', 20, 3600) // 20 executions per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const workflowId = params.id
    const body = await request.json()
    const { variables, triggerData, options = {} } = body

    // Get workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .eq('user_id', user.id)
      .single()

    if (workflowError || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check if workflow is active
    if (workflow.status !== 'active' && workflow.status !== 'draft') {
      return NextResponse.json(
        { error: 'Workflow is not active' },
        { status: 400 }
      )
    }

    // Check for running executions (if not allowing concurrent executions)
    if (!options.allowConcurrent) {
      const { data: runningExecutions, error: execError } = await supabase
        .from('workflow_executions')
        .select('id')
        .eq('workflow_id', workflowId)
        .eq('status', 'running')

      if (execError) {
        logError('Failed to check running executions:', execError)
      } else if (runningExecutions && runningExecutions.length > 0) {
        return NextResponse.json(
          { error: 'Workflow is already running' },
          { status: 409 }
        )
      }
    }

    // Create execution record
    const { data: execution, error: executionError } = await supabase
      .from('workflow_executions')
      .insert({
        workflow_id: workflowId,
        user_id: user.id,
        status: 'pending',
        started_at: new Date().toISOString(),
        variables: variables || {},
        trigger_data: triggerData || {},
        options: options,
        metadata: {
          executedBy: user.id,
          environment: process.env.NODE_ENV || 'development',
          version: workflow.version,
          retryCount: 0,
          maxRetries: workflow.settings?.retryAttempts || 3
        }
      })
      .select()
      .single()

    if (executionError) {
      logError('Failed to create execution record:', executionError)
      return NextResponse.json(
        { error: 'Failed to start workflow execution' },
        { status: 500 }
      )
    }

    // Start workflow execution asynchronously
    executeWorkflowAsync(workflow, execution, variables, triggerData, options)

    logInfo('Workflow execution started', {
      executionId: execution.id,
      workflowId,
      userId: user.id,
      workflowName: workflow.name
    })

    return NextResponse.json({
      execution: {
        id: execution.id,
        workflowId,
        status: 'pending',
        startedAt: execution.started_at
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

// Async workflow execution function
async function executeWorkflowAsync(
  workflow: any,
  execution: any,
  variables: any,
  triggerData: any,
  options: any
) {
  const supabase = createClient()
  
  try {
    // Update execution status to running
    await supabase
      .from('workflow_executions')
      .update({ 
        status: 'running',
        updated_at: new Date().toISOString()
      })
      .eq('id', execution.id)

    // Create execution steps
    const steps = workflow.nodes.map((node: any) => ({
      execution_id: execution.id,
      node_id: node.id,
      name: node.name,
      status: 'pending',
      created_at: new Date().toISOString()
    }))

    const { error: stepsError } = await supabase
      .from('workflow_execution_steps')
      .insert(steps)

    if (stepsError) {
      logError('Failed to create execution steps:', stepsError)
    }

    // Add initial log entry
    await supabase
      .from('workflow_execution_logs')
      .insert({
        execution_id: execution.id,
        level: 'info',
        message: 'Workflow execution started',
        timestamp: new Date().toISOString()
      })

    // Execute workflow using workflow engine
    const executionResult = await workflowEngine.executeWorkflow(
      workflow,
      {
        variables: variables || {},
        triggerData: triggerData || {},
        executionId: execution.id,
        options: options || {}
      }
    )

    // Update execution with results
    const completedAt = new Date().toISOString()
    const duration = new Date(completedAt).getTime() - new Date(execution.started_at).getTime()

    await supabase
      .from('workflow_executions')
      .update({
        status: executionResult.success ? 'completed' : 'failed',
        completed_at: completedAt,
        duration: duration,
        progress: 100,
        result: executionResult.result,
        error: executionResult.error ? {
          message: executionResult.error.message,
          stack: executionResult.error.stack,
          step: executionResult.error.step
        } : null,
        updated_at: completedAt
      })
      .eq('id', execution.id)

    // Add completion log entry
    await supabase
      .from('workflow_execution_logs')
      .insert({
        execution_id: execution.id,
        level: executionResult.success ? 'success' : 'error',
        message: executionResult.success 
          ? 'Workflow execution completed successfully'
          : `Workflow execution failed: ${executionResult.error?.message}`,
        timestamp: completedAt
      })

    // Update workflow statistics
    await updateWorkflowStats(workflow.id)

    logInfo('Workflow execution completed', {
      executionId: execution.id,
      workflowId: workflow.id,
      success: executionResult.success,
      duration
    })

  } catch (error) {
    logError('Error in workflow execution:', error)

    // Update execution with error
    const completedAt = new Date().toISOString()
    const duration = new Date(completedAt).getTime() - new Date(execution.started_at).getTime()

    await supabase
      .from('workflow_executions')
      .update({
        status: 'failed',
        completed_at: completedAt,
        duration: duration,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          step: 'execution'
        },
        updated_at: completedAt
      })
      .eq('id', execution.id)

    // Add error log entry
    await supabase
      .from('workflow_execution_logs')
      .insert({
        execution_id: execution.id,
        level: 'error',
        message: `Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: completedAt
      })
  }
}

// Update workflow statistics
async function updateWorkflowStats(workflowId: string) {
  const supabase = createClient()

  try {
    // Get execution statistics
    const { data: executions, error: execError } = await supabase
      .from('workflow_executions')
      .select('status, duration, started_at, completed_at')
      .eq('workflow_id', workflowId)

    if (execError) {
      logError('Failed to fetch execution stats:', execError)
      return
    }

    const totalExecutions = executions.length
    const successfulExecutions = executions.filter(e => e.status === 'completed').length
    const failedExecutions = executions.filter(e => e.status === 'failed').length
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
    
    const completedExecutions = executions.filter(e => e.duration)
    const averageExecutionTime = completedExecutions.length > 0
      ? completedExecutions.reduce((acc, e) => acc + e.duration, 0) / completedExecutions.length
      : 0

    // Update workflow with statistics
    await supabase
      .from('workflows')
      .update({
        execution_count: totalExecutions,
        success_rate: successRate,
        average_execution_time: averageExecutionTime,
        last_execution_at: executions.length > 0 ? executions[0].started_at : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', workflowId)

  } catch (error) {
    logError('Failed to update workflow stats:', error)
  }
}

// GET /api/workflows/[id]/execute - Get workflow execution status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflowId = params.id
    const { searchParams } = new URL(request.url)
    const executionId = searchParams.get('executionId')

    if (executionId) {
      // Get specific execution
      const { data: execution, error: execError } = await supabase
        .from('workflow_executions')
        .select(`
          *,
          workflow_execution_steps(*),
          workflow_execution_logs(*)
        `)
        .eq('id', executionId)
        .eq('workflow_id', workflowId)
        .eq('user_id', user.id)
        .single()

      if (execError || !execution) {
        return NextResponse.json(
          { error: 'Execution not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ execution })

    } else {
      // Get recent executions for workflow
      const { data: executions, error: execError } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('workflow_id', workflowId)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(10)

      if (execError) {
        logError('Failed to fetch executions:', execError)
        return NextResponse.json(
          { error: 'Failed to fetch executions' },
          { status: 500 }
        )
      }

      return NextResponse.json({ executions })
    }

  } catch (error) {
    logError('Error in GET /api/workflows/[id]/execute:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows/[id]/execute - Update workflow execution (stop, pause, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workflowId = params.id
    const body = await request.json()
    const { executionId, action, reason } = body

    if (!executionId || !action) {
      return NextResponse.json(
        { error: 'Execution ID and action are required' },
        { status: 400 }
      )
    }

    // Get execution
    const { data: execution, error: execError } = await supabase
      .from('workflow_executions')
      .select('*')
      .eq('id', executionId)
      .eq('workflow_id', workflowId)
      .eq('user_id', user.id)
      .single()

    if (execError || !execution) {
      return NextResponse.json(
        { error: 'Execution not found' },
        { status: 404 }
      )
    }

    if (execution.status !== 'running') {
      return NextResponse.json(
        { error: 'Execution is not running' },
        { status: 400 }
      )
    }

    let newStatus = execution.status
    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    switch (action) {
      case 'stop':
        newStatus = 'cancelled'
        updateData.status = newStatus
        updateData.completed_at = new Date().toISOString()
        updateData.duration = new Date().getTime() - new Date(execution.started_at).getTime()
        updateData.error = reason ? { message: reason, step: 'user_cancelled' } : { message: 'Cancelled by user', step: 'user_cancelled' }
        break

      case 'pause':
        newStatus = 'paused'
        updateData.status = newStatus
        updateData.paused_at = new Date().toISOString()
        break

      case 'resume':
        newStatus = 'running'
        updateData.status = newStatus
        updateData.resumed_at = new Date().toISOString()
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update execution
    const { data: updatedExecution, error: updateError } = await supabase
      .from('workflow_executions')
      .update(updateData)
      .eq('id', executionId)
      .select()
      .single()

    if (updateError) {
      logError('Failed to update execution:', updateError)
      return NextResponse.json(
        { error: 'Failed to update execution' },
        { status: 500 }
      )
    }

    // Add log entry
    await supabase
      .from('workflow_execution_logs')
      .insert({
        execution_id: executionId,
        level: 'info',
        message: `Execution ${action}${reason ? `: ${reason}` : ''}`,
        timestamp: new Date().toISOString()
      })

    logInfo('Workflow execution updated', {
      executionId,
      workflowId,
      action,
      newStatus,
      userId: user.id
    })

    return NextResponse.json({ execution: updatedExecution })

  } catch (error) {
    logError('Error in PUT /api/workflows/[id]/execute:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
