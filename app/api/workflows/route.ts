import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { logger, logError, logInfo } from '@/lib/logger'
import { WorkflowEngine } from '@/lib/workflow-engine'
import { rateLimiter } from '@/lib/rate-limiter'

// Initialize workflow engine
const workflowEngine = new WorkflowEngine()

// GET /api/workflows - List user's workflows
export async function GET(request: NextRequest) {
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

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'workflows-list', 100, 3600) // 100 requests per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build query
    let query = supabase
      .from('workflows')
      .select(`
        *,
        workflow_executions!inner(count)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: workflows, error: workflowsError } = await query

    if (workflowsError) {
      logError('Failed to fetch workflows:', workflowsError)
      return NextResponse.json(
        { error: 'Failed to fetch workflows' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('workflows')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)

    if (status) {
      countQuery = countQuery.eq('status', status)
    }

    if (category) {
      countQuery = countQuery.eq('category', category)
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      logError('Failed to count workflows:', countError)
    }

    // Enhance workflows with execution stats
    const enhancedWorkflows = await Promise.all(
      workflows.map(async (workflow) => {
        const { data: executions, error: execError } = await supabase
          .from('workflow_executions')
          .select('status, started_at, completed_at, duration')
          .eq('workflow_id', workflow.id)
          .limit(100)

        if (execError) {
          logError('Failed to fetch execution stats:', execError)
          return workflow
        }

        const successfulExecutions = executions.filter(e => e.status === 'completed').length
        const failedExecutions = executions.filter(e => e.status === 'failed').length
        const totalExecutions = executions.length
        const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
        const averageDuration = executions
          .filter(e => e.duration)
          .reduce((acc, e) => acc + e.duration, 0) / executions.filter(e => e.duration).length || 0

        return {
          ...workflow,
          stats: {
            totalExecutions,
            successfulExecutions,
            failedExecutions,
            successRate,
            averageDuration,
            lastExecution: executions.length > 0 ? executions[0].started_at : null
          }
        }
      })
    )

    logInfo('Workflows fetched successfully', {
      userId: user.id,
      count: enhancedWorkflows.length,
      page,
      limit
    })

    return NextResponse.json({
      workflows: enhancedWorkflows,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    logError('Error in GET /api/workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create new workflow
export async function POST(request: NextRequest) {
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

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'workflows-create', 10, 3600) // 10 workflows per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      triggerType,
      triggerConfig,
      nodes,
      edges,
      variables,
      settings,
      category,
      tags,
      templateId
    } = body

    // Validate required fields
    if (!name || !triggerType) {
      return NextResponse.json(
        { error: 'Name and trigger type are required' },
        { status: 400 }
      )
    }

    // Validate workflow structure
    const validationResult = workflowEngine.validateWorkflow({
      id: '', // Will be set by database
      name,
      description: description || '',
      version: '1.0.0',
      status: 'draft',
      triggerType,
      triggerConfig: triggerConfig || {},
      nodes: nodes || [],
      edges: edges || [],
      variables: variables || {},
      settings: {
        timeout: 300000,
        retryAttempts: 3,
        retryDelay: 5000,
        parallelExecution: true,
        errorHandling: 'stop',
        ...settings
      },
      metadata: {
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        executionCount: 0,
        successRate: 0,
        averageExecutionTime: 0
      }
    })

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: 'Invalid workflow structure', details: validationResult.errors },
        { status: 400 }
      )
    }

    // Create workflow in database
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .insert({
        user_id: user.id,
        name,
        description: description || '',
        version: '1.0.0',
        status: 'draft',
        trigger_type: triggerType,
        trigger_config: triggerConfig || {},
        nodes: nodes || [],
        edges: edges || [],
        variables: variables || {},
        settings: {
          timeout: 300000,
          retryAttempts: 3,
          retryDelay: 5000,
          parallelExecution: true,
          errorHandling: 'stop',
          ...settings
        },
        category: category || 'general',
        tags: tags || [],
        template_id: templateId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (workflowError) {
      logError('Failed to create workflow:', workflowError)
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      )
    }

    // If created from template, increment template usage
    if (templateId) {
      await supabase
        .from('workflow_templates')
        .update({ usage_count: supabase.raw('usage_count + 1') })
        .eq('id', templateId)
    }

    logInfo('Workflow created successfully', {
      workflowId: workflow.id,
      userId: user.id,
      name,
      templateId
    })

    return NextResponse.json({
      workflow: {
        ...workflow,
        stats: {
          totalExecutions: 0,
          successfulExecutions: 0,
          failedExecutions: 0,
          successRate: 0,
          averageDuration: 0,
          lastExecution: null
        }
      }
    }, { status: 201 })

  } catch (error) {
    logError('Error in POST /api/workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows - Update workflow
export async function PUT(request: NextRequest) {
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

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'workflows-update', 50, 3600) // 50 updates per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Check if workflow exists and user owns it
    const { data: existingWorkflow, error: fetchError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingWorkflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Validate workflow if structure is being updated
    if (updates.nodes || updates.edges || updates.triggerType) {
      const validationResult = workflowEngine.validateWorkflow({
        ...existingWorkflow,
        ...updates,
        updatedAt: new Date()
      })

      if (!validationResult.isValid) {
        return NextResponse.json(
          { error: 'Invalid workflow structure', details: validationResult.errors },
          { status: 400 }
        )
      }
    }

    // Update workflow
    const { data: updatedWorkflow, error: updateError } = await supabase
      .from('workflows')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      logError('Failed to update workflow:', updateError)
      return NextResponse.json(
        { error: 'Failed to update workflow' },
        { status: 500 }
      )
    }

    logInfo('Workflow updated successfully', {
      workflowId: id,
      userId: user.id,
      updates: Object.keys(updates)
    })

    return NextResponse.json({ workflow: updatedWorkflow })

  } catch (error) {
    logError('Error in PUT /api/workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows - Delete workflow
export async function DELETE(request: NextRequest) {
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

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'workflows-delete', 10, 3600) // 10 deletes per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Check if workflow exists and user owns it
    const { data: workflow, error: fetchError } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check if workflow is currently running
    const { data: runningExecutions, error: execError } = await supabase
      .from('workflow_executions')
      .select('id')
      .eq('workflow_id', id)
      .eq('status', 'running')

    if (execError) {
      logError('Failed to check running executions:', execError)
    } else if (runningExecutions && runningExecutions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete workflow with running executions' },
        { status: 400 }
      )
    }

    // Delete workflow (cascade will handle related executions and logs)
    const { error: deleteError } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      logError('Failed to delete workflow:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete workflow' },
        { status: 500 }
      )
    }

    logInfo('Workflow deleted successfully', {
      workflowId: id,
      userId: user.id,
      name: workflow.name
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    logError('Error in DELETE /api/workflows:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
