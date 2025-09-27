import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { logError, logInfo } from '@/lib/logger'
import { rateLimitByIp } from '@/lib/rate-limit'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// GET /api/workflows - List user's workflows
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 100, window: 3600 }) // 100 requests per hour
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

    // Build query conditions
    let conditions = [`user_id = $1`]
    let params: any[] = [user.id]
    let paramIndex = 2

    if (status) {
      conditions.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (category) {
      conditions.push(`category = $${paramIndex}`)
      params.push(category)
      paramIndex++
    }

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.join(' AND ')
    const offset = (page - 1) * limit

    // Get workflows with execution stats
    const workflows = await sql`
      SELECT 
        w.*,
        COALESCE(stats.total_executions, 0) as total_executions,
        COALESCE(stats.successful_executions, 0) as successful_executions,
        COALESCE(stats.failed_executions, 0) as failed_executions,
        COALESCE(stats.success_rate, 0) as success_rate,
        COALESCE(stats.average_duration, 0) as average_duration,
        stats.last_execution
      FROM workflows w
      LEFT JOIN (
        SELECT 
          workflow_id,
          COUNT(*) as total_executions,
          COUNT(*) FILTER (WHERE status = 'completed') as successful_executions,
          COUNT(*) FILTER (WHERE status = 'failed') as failed_executions,
          CASE 
            WHEN COUNT(*) > 0 THEN 
              ROUND((COUNT(*) FILTER (WHERE status = 'completed')::FLOAT / COUNT(*)) * 100, 2)
            ELSE 0 
          END as success_rate,
          AVG(duration) as average_duration,
          MAX(started_at) as last_execution
        FROM workflow_executions 
        GROUP BY workflow_id
      ) stats ON w.id = stats.workflow_id
      WHERE ${sql.unsafe(whereClause, ...params)}
      ORDER BY w.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM workflows w
      WHERE ${sql.unsafe(whereClause, ...params)}
    `
    const total = parseInt(countResult[0]?.total || '0')

    logInfo('Workflows fetched successfully', {
      userId: user.id,
      count: workflows.length,
      page,
      limit,
      total
    })

    return NextResponse.json({
      workflows: workflows.map(w => ({
        ...w,
        stats: {
          totalExecutions: parseInt(w.total_executions || '0'),
          successfulExecutions: parseInt(w.successful_executions || '0'),
          failedExecutions: parseInt(w.failed_executions || '0'),
          successRate: parseFloat(w.success_rate || '0'),
          averageDuration: parseFloat(w.average_duration || '0'),
          lastExecution: w.last_execution
        }
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 10, window: 3600 }) // 10 workflows per hour
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

    // Create workflow in database
    const workflow = await sql`
      INSERT INTO workflows (
        user_id, name, description, version, status, trigger_type, trigger_config,
        nodes, edges, variables, settings, category, tags, template_id,
        created_at, updated_at
      ) VALUES (
        ${user.id}, ${name}, ${description || ''}, '1.0.0', 'draft', ${triggerType},
        ${JSON.stringify(triggerConfig || {})}, ${JSON.stringify(nodes || [])},
        ${JSON.stringify(edges || [])}, ${JSON.stringify(variables || {})},
        ${JSON.stringify({
          timeout: 300000,
          retryAttempts: 3,
          retryDelay: 5000,
          parallelExecution: true,
          errorHandling: 'stop',
          ...settings
        })}, ${category || 'general'}, ${JSON.stringify(tags || [])},
        ${templateId || null}, NOW(), NOW()
      ) RETURNING *
    `

    // If created from template, increment template usage
    if (templateId) {
      await sql`
        UPDATE workflow_templates 
        SET usage_count = usage_count + 1 
        WHERE id = ${templateId}
      `
    }

    logInfo('Workflow created successfully', {
      workflowId: workflow[0].id,
      userId: user.id,
      name,
      templateId
    })

    return NextResponse.json({
      workflow: {
        ...workflow[0],
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
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 50, window: 3600 }) // 50 updates per hour
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
    const existingWorkflow = await sql`
      SELECT * FROM workflows 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    if (existingWorkflow.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Build update query
    const updateFields: string[] = []
    const updateParams: any[] = []
    let paramIndex = 1

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'triggerConfig' || key === 'nodes' || key === 'edges' || key === 'variables' || key === 'settings' || key === 'tags') {
        updateFields.push(`${key} = $${paramIndex}`)
        updateParams.push(JSON.stringify(value))
      } else {
        updateFields.push(`${key} = $${paramIndex}`)
        updateParams.push(value)
      }
      paramIndex++
    })

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    // Update workflow
    const updatedWorkflow = await sql`
      UPDATE workflows 
      SET ${sql.unsafe(updateFields.join(', '), ...updateParams)}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `

    if (updatedWorkflow.length === 0) {
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

    return NextResponse.json({ workflow: updatedWorkflow[0] })

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
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 10, window: 3600 }) // 10 deletes per hour
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
    const workflow = await sql`
      SELECT * FROM workflows 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    if (workflow.length === 0) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      )
    }

    // Check if workflow is currently running
    const runningExecutions = await sql`
      SELECT id FROM workflow_executions 
      WHERE workflow_id = ${id} AND status = 'running'
    `

    if (runningExecutions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete workflow with running executions' },
        { status: 400 }
      )
    }

    // Delete workflow (cascade will handle related executions and logs)
    await sql`
      DELETE FROM workflows 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    logInfo('Workflow deleted successfully', {
      workflowId: id,
      userId: user.id,
      name: workflow[0].name
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