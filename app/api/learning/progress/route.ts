
import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import * as jose from 'jose'

export const dynamic = 'force-dynamic'

async function getUser(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    const token = authHeader.substring(7)
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jose.jwtVerify(token, secret)
        return payload
    } catch (error) {
        return null
    }
}

export async function GET(request: NextRequest) {
    try {
        const user = await getUser(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const sql = getSql()

        // Fetch user's progress for all modules
        const progress = await sql`
      SELECT * FROM user_progress 
      WHERE user_id = ${user.userId as string}
    `

        return NextResponse.json(progress)
    } catch (error) {
        console.error('Error fetching user progress:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { moduleId, completionPercentage, status, data, timeSpent } = body

        if (!moduleId) {
            return NextResponse.json({ error: 'Module ID is required' }, { status: 400 })
        }

        const sql = getSql()

        // Check if progress exists
        const existing = await sql`
      SELECT * FROM user_progress 
      WHERE user_id = ${user.userId as string} AND module_id = ${moduleId}
    `

        let result
        if (existing.length > 0) {
            // Update existing progress
            result = await sql`
        UPDATE user_progress 
        SET 
          completion_percentage = ${completionPercentage ?? existing[0].completion_percentage},
          status = ${status ?? existing[0].status},
          data = ${data ? JSON.stringify(data) : existing[0].data},
          time_spent = ${timeSpent ? existing[0].time_spent + timeSpent : existing[0].time_spent},
          last_accessed = NOW(),
          completed_at = ${status === 'completed' ? 'NOW()' : existing[0].completed_at}
        WHERE id = ${existing[0].id}
        RETURNING *
      `
        } else {
            // Create new progress
            result = await sql`
        INSERT INTO user_progress (user_id, module_id, completion_percentage, status, data, time_spent, last_accessed, started_at)
        VALUES (
          ${user.userId as string}, 
          ${moduleId}, 
          ${completionPercentage || 0}, 
          ${status || 'in_progress'}, 
          ${JSON.stringify(data || {})}, 
          ${timeSpent || 0}, 
          NOW(), 
          NOW()
        )
        RETURNING *
      `
        }

        return NextResponse.json(result[0])
    } catch (error) {
        console.error('Error saving user progress:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
