import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = id
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, is_favorite FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Toggle favorite status
    const newFavoriteStatus = !document.is_favorite

    // Update document
    const { rows: [updatedDocument] } = await client.query(`
      UPDATE documents 
      SET is_favorite = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [newFavoriteStatus, documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `, [
      documentId,
      user.id,
      newFavoriteStatus ? 'favorited' : 'unfavorited',
      JSON.stringify({
        isFavorite: newFavoriteStatus
      })
    ])

    return NextResponse.json({
      success: true,
      isFavorite: newFavoriteStatus
    })

  } catch (error) {
    console.error('Toggle favorite error:', error)
    return NextResponse.json({ 
      error: 'Failed to toggle favorite' 
    }, { status: 500 })
  }
}
