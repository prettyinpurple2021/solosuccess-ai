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
      const { category } = await request.json()

      if (!category || typeof category !== 'string') {
        return createErrorResponse('Category is required', 400)
      }

      const sql = getSql()

      // Get document details for tracking previous category
      const { document, error } = await verifyDocumentOwnership(
        documentId,
        user.id,
        'id, category'
      )

      if (error || !document) {
        return createErrorResponse(error || 'Document not found', 404)
      }

      // Update category
      await sql(`
        UPDATE documents 
        SET category = $1, updated_at = NOW()
        WHERE id = $2
      `, [category, documentId])

      // Log activity
      await sql(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'category_updated', $3, NOW())
      `, [
        documentId,
        user.id,
        JSON.stringify({
          newCategory: category,
          previousCategory: document.category
        })
      ])

      return NextResponse.json({
        success: true,
        category,
        message: 'Category updated successfully'
      })

    } catch (error) {
      logError('Update category error:', error)
      return createErrorResponse('Failed to update category', 500)
    }
  }
)

export const GET = withDocumentAuth(
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const { document, error } = await verifyDocumentOwnership(
        documentId,
        user.id,
        'id, category'
      )

      if (error || !document) {
        return createErrorResponse(error || 'Document not found', 404)
      }

      return NextResponse.json({
        category: document.category
      })

    } catch (error) {
      logError('Get category error:', error)
      return createErrorResponse('Failed to get category', 500)
    }
  }
)
