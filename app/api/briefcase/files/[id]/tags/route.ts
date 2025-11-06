import { logError } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { 
  withDocumentAuth, 
  getSql, 
  createErrorResponse,
  verifyDocumentOwnership,
  parseDocumentTags
} from '@/lib/api-utils'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'

export const POST = withDocumentAuth(
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const { tag } = await request.json()

      if (!tag || typeof tag !== 'string' || !tag.trim()) {
        return createErrorResponse('Tag is required', 400)
      }

      const sql = getSql()

      // Get document with tags
      const { document, error } = await verifyDocumentOwnership(
        documentId,
        user.id,
        'id, tags'
      )

      if (error || !document) {
        return createErrorResponse(error || 'Document not found', 404)
      }

      // Parse existing tags using centralized helper
      const existingTags = parseDocumentTags(document.tags)
      const newTag = tag.trim().toLowerCase()

      // Check if tag already exists
      if (existingTags.includes(newTag)) {
        return createErrorResponse('Tag already exists', 400)
      }

      // Add new tag
      const updatedTags = [...existingTags, newTag]

      // Update document
      await sql(`
        UPDATE documents 
        SET tags = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [JSON.stringify(updatedTags), documentId])

      // Log activity
      await sql(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'tag_added', $3, NOW())
      `, [
        documentId,
        user.id,
        JSON.stringify({
          tag: newTag,
          totalTags: updatedTags.length
        })
      ])

      return NextResponse.json({
        success: true,
        tags: updatedTags
      })

    } catch (error) {
      logError('Add tag error:', error)
      return createErrorResponse('Failed to add tag', 500)
    }
  }
)

export const DELETE = withDocumentAuth(
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const { searchParams } = new URL(request.url)
      const tag = searchParams.get('tag')

      if (!tag) {
        return createErrorResponse('Tag is required', 400)
      }

      const sql = getSql()

      // Get document with tags
      const { document, error } = await verifyDocumentOwnership(
        documentId,
        user.id,
        'id, tags'
      )

      if (error || !document) {
        return createErrorResponse(error || 'Document not found', 404)
      }

      // Parse existing tags using centralized helper
      const existingTags = parseDocumentTags(document.tags)
      const tagToRemove = tag.trim().toLowerCase()

      // Check if tag exists
      if (!existingTags.includes(tagToRemove)) {
        return createErrorResponse('Tag not found', 404)
      }

      // Remove tag
      const updatedTags = existingTags.filter((t: string) => t !== tagToRemove)

      // Update document
      await sql(`
        UPDATE documents 
        SET tags = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [JSON.stringify(updatedTags), documentId])

      // Log activity
      await sql(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'tag_removed', $3, NOW())
      `, [
        documentId,
        user.id,
        JSON.stringify({
          tag: tagToRemove,
          totalTags: updatedTags.length
        })
      ])

      return NextResponse.json({
        success: true,
        tags: updatedTags
      })

    } catch (error) {
      logError('Remove tag error:', error)
      return createErrorResponse('Failed to remove tag', 500)
    }
  }
)
