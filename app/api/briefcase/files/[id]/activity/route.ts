import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = id
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get activity
    const { rows: activity } = await client.query(`
      SELECT 
        da.id,
        da.user_id,
        da.action,
        da.details,
        da.created_at,
        u.name as user_name,
        u.avatar_url
      FROM document_activity da
      LEFT JOIN users u ON da.user_id = u.id
      WHERE da.document_id = $1
      ORDER BY da.created_at DESC
      LIMIT 50
    `, [documentId])

    return NextResponse.json(activity.map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name || 'Unknown User',
      userAvatar: item.avatar_url,
      action: item.action,
      timestamp: item.created_at,
      details: item.details ? JSON.parse(item.details) : null
    })))

  } catch (error) {
    console.error('Get activity error:', error)
    return NextResponse.json({ 
      error: 'Failed to get activity' 
    }, { status: 500 })
  }
}
