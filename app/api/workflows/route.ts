import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { logError, logInfo } from '@/lib/logger'
import { rateLimitByIp } from '@/lib/rate-limit'
import { neon } from '@neondatabase/serverless'
import { getNeonConnection } from '@/lib/database-utils'

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'

function getSql() {
  return getNeonConnection()
}

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

    const offset = (page - 1) * limit

    // Get workflows with execution stats
    const sql = getSql()
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
      WHERE w.user_id = ${user.id}
        ${status ? sql`AND w.status = ${status}` : sql``}
        ${category ? sql`AND w.category = ${category}` : sql``}
        ${search ? sql`AND (w.name ILIKE ${`%${search}%`} OR w.description ILIKE ${`%${search}%`})` : sql``}
      ORDER BY w.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM workflows w
      WHERE w.user_id = ${user.id}
        ${status ? sql`AND w.status = ${status}` : sql``}
        ${category ? sql`AND w.category = ${category}` : sql``}
        ${search ? sql`AND (w.name ILIKE ${`%${search}%`} OR w.description ILIKE ${`%${search}%`})` : sql``}
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
    logError('Error in GET /api/workflows:', error instanceof Error ? error : new Error(String(error)))
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
    const sql = getSql()
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
    logError('Error in POST /api/workflows:', error instanceof Error ? error : new Error(String(error)))
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
    const sql = getSql()
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

    // Check if any valid updates provided
    const hasUpdates = Object.keys(updates).some(key => 
      ['name', 'description', 'status', 'triggerType', 'triggerConfig', 'nodes', 'edges', 'variables', 'settings', 'category', 'tags'].includes(key)
    )

    if (!hasUpdates) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 }
      )
    }

    // Update workflow with conditional fields
    const updatedWorkflow = await sql`
      UPDATE workflows 
      SET 
        ${updates.name !== undefined ? sql`name = ${updates.name}` : sql``}
        ${updates.description !== undefined ? sql`, description = ${updates.description}` : sql``}
        ${updates.status !== undefined ? sql`, status = ${updates.status}` : sql``}
        ${updates.triggerType !== undefined ? sql`, trigger_type = ${updates.triggerType}` : sql``}
        ${updates.triggerConfig !== undefined ? sql`, trigger_config = ${JSON.stringify(updates.triggerConfig)}` : sql``}
        ${updates.nodes !== undefined ? sql`, nodes = ${JSON.stringify(updates.nodes)}` : sql``}
        ${updates.edges !== undefined ? sql`, edges = ${JSON.stringify(updates.edges)}` : sql``}
        ${updates.variables !== undefined ? sql`, variables = ${JSON.stringify(updates.variables)}` : sql``}
        ${updates.settings !== undefined ? sql`, settings = ${JSON.stringify(updates.settings)}` : sql``}
        ${updates.category !== undefined ? sql`, category = ${updates.category}` : sql``}
        ${updates.tags !== undefined ? sql`, tags = ${JSON.stringify(updates.tags)}` : sql``}
        , updated_at = NOW()
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
    logError('Error in PUT /api/workflows:', error instanceof Error ? error : new Error(String(error)))
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
    const sql = getSql()
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
    logError('Error in DELETE /api/workflows:', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}