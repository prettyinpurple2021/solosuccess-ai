import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/database-client'
import { getSql } from '@/lib/api-utils'
import { authenticateRequest } from '@/lib/auth-server'
import { z } from 'zod'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const BodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.string().optional(),
      priority: z.string().optional(),
      due_date: z.union([z.string(), z.date()]).optional(),
      category: z.string().optional(),
      goal_id: z.string().optional(),
      estimated_minutes: z.number().optional(),
      actual_minutes: z.number().optional(),
    })

    const parsed = BodySchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    const { title, description, status, priority, due_date, category } = parsed.data

    const db = getDb()

    // First verify the task belongs to the user
    const params = await context.params
    const sql = getSql()
    const rows = await sql(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [params.id, user.id]
    )
    const existingTask = rows[0]

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Update task
    const updateResult = await sql(
      `UPDATE tasks 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           priority = COALESCE($3, priority), 
           due_date = COALESCE($4, due_date), 
           category = COALESCE($5, category), 
           status = COALESCE($6, status), 
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        title,
        description,
        priority,
        due_date,
        category,
        status,
        params.id,
        user.id
      ]
    )
    const updatedTask = updateResult[0]

    return NextResponse.json({ task: updatedTask })
  } catch (error) {
    logError('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()

    // Verify the task belongs to the user and delete it in one step
    const params = await context.params
    const sql = getSql()
    const result = await sql(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
      [params.id, user.id]
    )

    if (result.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logError('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}