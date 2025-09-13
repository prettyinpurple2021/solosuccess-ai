import { NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET() {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const client = await createClient()
    // Return the most recent 50 conversations
    const { rows } = await client.query(
      `SELECT id, user_id, agent_id, message, response, created_at
       FROM conversations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    )
    return NextResponse.json({ conversations: rows })
  } catch (error) {
    console.error('Fetch conversations error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}


