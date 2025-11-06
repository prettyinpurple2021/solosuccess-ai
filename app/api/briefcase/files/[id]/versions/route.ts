import { logError } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { 
  withDocumentAuth, 
  getSql, 
  createErrorResponse 
} from '@/lib/api-utils'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'

export const GET = withDocumentAuth(
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const sql = getSql()

      // Get document versions
      const versions = await sql(`
        SELECT 
          dv.id,
          dv.version_number,
          dv.file_name,
          dv.file_size,
          dv.mime_type,
          dv.created_at,
          dv.created_by,
          dv.changelog,
          dv.is_current,
          u.name as created_by_name,
          u.avatar_url
        FROM document_versions dv
        LEFT JOIN users u ON dv.created_by = u.id
        WHERE dv.document_id = $1
        ORDER BY dv.version_number DESC
      `, [documentId])

      return NextResponse.json(versions.map(v => ({
        id: v.id,
        versionNumber: v.version_number,
        fileName: v.file_name,
        fileSize: v.file_size,
        mimeType: v.mime_type,
        createdAt: v.created_at,
        createdBy: v.created_by,
        createdByName: v.created_by_name || 'Unknown',
        createdByAvatar: v.avatar_url,
        changelog: v.changelog,
        isCurrent: v.is_current
      })))

    } catch (error) {
      logError('Get versions error:', error)
      return createErrorResponse('Failed to get versions', 500)
    }
  }
)

export const POST = withDocumentAuth(
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const { changelog } = await request.json()
      const sql = getSql()

      // Get document details
      const document = await sql(`
        SELECT id, name, file_data, file_size, mime_type FROM documents 
        WHERE id = $1 AND user_id = $2
      `, [documentId, user.id])

      if (!document || document.length === 0) {
        return createErrorResponse('Document not found', 404)
      }

      const doc = document[0]

      // Get next version number
      const lastVersion = await sql(`
        SELECT version_number FROM document_versions 
        WHERE document_id = $1 
        ORDER BY version_number DESC 
        LIMIT 1
      `, [documentId])

      const nextVersionNumber = lastVersion.length > 0 ? lastVersion[0].version_number + 1 : 1

      // Create new version
      const newVersion = await sql(`
        INSERT INTO document_versions (
          document_id, version_number, file_name, file_data, file_size, 
          mime_type, created_by, changelog, is_current, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING *
      `, [
        documentId,
        nextVersionNumber,
        doc.name,
        doc.file_data,
        doc.file_size,
        doc.mime_type,
        user.id,
        changelog || `Version ${nextVersionNumber}`,
        true
      ])

      // Mark all other versions as not current
      await sql(`
        UPDATE document_versions 
        SET is_current = false 
        WHERE document_id = $1 AND id != $2
      `, [documentId, newVersion[0].id])

      // Log activity
      await sql(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'version_created', $3, NOW())
      `, [
        documentId,
        user.id,
        JSON.stringify({
          versionNumber: nextVersionNumber,
          changelog: changelog || `Version ${nextVersionNumber}`
        })
      ])

      return NextResponse.json({
        id: newVersion[0].id,
        versionNumber: newVersion[0].version_number,
        fileName: newVersion[0].file_name,
        fileSize: newVersion[0].file_size,
        mimeType: newVersion[0].mime_type,
        createdAt: newVersion[0].created_at,
        createdBy: newVersion[0].created_by,
        changelog: newVersion[0].changelog,
        isCurrent: newVersion[0].is_current
      })

    } catch (error) {
      logError('Create version error:', error)
      return createErrorResponse('Failed to create version', 500)
    }
  }
)
