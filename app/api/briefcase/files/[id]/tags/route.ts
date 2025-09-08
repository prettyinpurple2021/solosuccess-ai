import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tags } = await request.json()
    const documentId = params.id

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: 'Tags must be an array' }, { status: 400 })
    }

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, tags FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update tags
    await client.query(`
      UPDATE documents 
      SET tags = $1, updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(tags), documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'tags_updated', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        newTags: tags,
        previousTags: document.tags || []
      })
    ])

    return NextResponse.json({
      success: true,
      tags,
      message: 'Tags updated successfully'
    })

  } catch (error) {
    console.error('Update tags error:', error)
    return NextResponse.json({ 
      error: 'Failed to update tags' 
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = params.id
    const client = await createClient()

    // Get document tags
    const { rows: [document] } = await client.query(`
      SELECT id, tags FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({
      tags: document.tags || []
    })

  } catch (error) {
    console.error('Get tags error:', error)
    return NextResponse.json({ 
      error: 'Failed to get tags' 
    }, { status: 500 })
  }
}
