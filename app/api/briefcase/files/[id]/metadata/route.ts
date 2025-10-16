import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'



// Edge Runtime disabled due to Node.js dependency incompatibility

// Consolidated PATCH handler for updating document metadata
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const documentId = id
    const { description, tags, category, isFavorite, metadata } = await request.json()

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`)
      values.push(description)
      paramCount++
    }

    if (tags !== undefined) {
      updates.push(`tags = $${paramCount}`)
      values.push(JSON.stringify(Array.isArray(tags) ? tags : []))
      paramCount++
    }
    if (metadata !== undefined) {
      updates.push(`metadata = $${paramCount}`)
      values.push(metadata)
      paramCount++
    }

    if (category !== undefined) {
      updates.push(`category = $${paramCount}`)
      values.push(category)
      paramCount++
    }

    if (isFavorite !== undefined) {
      updates.push(`is_favorite = $${paramCount}`)
      values.push(isFavorite)
      paramCount++
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`)
    values.push(documentId)

    // Update document
    const { rows: [updatedDocument] } = await client.query(`
      UPDATE documents 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values)

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'metadata_updated', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        updatedFields: {
          description: description !== undefined,
          tags: tags !== undefined,
          category: category !== undefined,
          isFavorite: isFavorite !== undefined
        }
      })
    ])

    return NextResponse.json({
      success: true,
      document: {
        id: updatedDocument.id,
        description: updatedDocument.description,
        tags: updatedDocument.tags ? JSON.parse(updatedDocument.tags) : [],
        category: updatedDocument.category,
        isFavorite: updatedDocument.is_favorite,
        metadata: updatedDocument.metadata,
        updatedAt: updatedDocument.updated_at
      }
    })

  } catch (error) {
    logError('Update metadata error:', error)
    return NextResponse.json({ 
      error: 'Failed to update metadata' 
    }, { status: 500 })
  }
}
