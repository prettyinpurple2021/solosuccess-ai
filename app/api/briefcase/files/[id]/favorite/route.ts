import { logError } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { 
  withDocumentAuth, 
  getSql, 
  createErrorResponse,
  verifyDocumentOwnership
} from '@/lib/api-utils'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'

export const POST = withDocumentAuth(
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const sql = getSql()

      // Get document details to check current favorite status
      const { document, error } = await verifyDocumentOwnership(
        documentId,
        user.id,
        'id, is_favorite'
      )

      if (error || !document) {
        return createErrorResponse(error || 'Document not found', 404)
      }

      // Toggle favorite status
      const newFavoriteStatus = !document.is_favorite

      // Update document
      await sql(`
        UPDATE documents 
        SET is_favorite = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [newFavoriteStatus, documentId])

      // Log activity
      await sql(`
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
      logError('Toggle favorite error:', error)
      return createErrorResponse('Failed to toggle favorite', 500)
    }
  }
)
