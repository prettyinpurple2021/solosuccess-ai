import { logError } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import {
  withDocumentAuth,
  getSql,
  createErrorResponse,
  generateUUID
} from '@/lib/api-utils'
import bcrypt from 'bcryptjs'

// Node.js runtime required for bcryptjs password hashing
export const runtime = 'nodejs'

export const GET = withDocumentAuth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const sql = getSql()

      // Get share links
      const shareLinks = await sql`
        SELECT 
          id, url, permissions, expires_at, max_access_count, 
          access_count, download_enabled, require_auth, is_active, created_at,
          password_hash
        FROM document_share_links 
        WHERE document_id = ${documentId} AND is_active = true
        ORDER BY created_at DESC
      ` as any[] // eslint-disable-line @typescript-eslint/no-explicit-any

      return NextResponse.json(shareLinks.map(link => ({
        id: link.id,
        url: link.url,
        permissions: link.permissions,
        expiresAt: link.expires_at,
        maxAccess: link.max_access_count,
        accessCount: link.access_count,
        downloadEnabled: link.download_enabled,
        requireAuth: link.require_auth,
        isActive: link.is_active,
        createdAt: link.created_at,
        password: link.password_hash ? true : false // Don't expose actual password
      })))

    } catch (error) {
      logError('Get share links error:', error)
      return createErrorResponse('Failed to get share links', 500)
    }
  }
)

export const POST = withDocumentAuth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const {
        permissions,
        password,
        expiresAt,
        downloadEnabled,
        maxAccess,
        requireAuth
      } = await request.json()

      if (!permissions) {
        return createErrorResponse('Permissions are required', 400)
      }

      const sql = getSql()

      // Generate unique share link
      const shareId = generateUUID()
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareId}`

      // Hash password if provided
      let passwordHash = null
      if (password && password.trim()) {
        passwordHash = await bcrypt.hash(password, 10)
      }

      // Create share link
      const permissionsJson = typeof permissions === 'string' ? permissions : JSON.stringify(permissions)
      const newLinkRows = await sql`
        INSERT INTO document_share_links (
          id, document_id, created_by, url, password_hash, permissions, 
          expires_at, max_access_count, download_enabled, require_auth, 
          is_active, created_at
        ) VALUES (${shareId}, ${documentId}, ${user.id}, ${shareUrl}, ${passwordHash}, ${permissionsJson}::jsonb, 
        ${expiresAt || null}, ${maxAccess || null}, ${downloadEnabled || false}, ${requireAuth || false}, 
        ${true}, NOW())
        RETURNING *
      ` as any[] // eslint-disable-line @typescript-eslint/no-explicit-any
      const newLink = newLinkRows[0]

      // Log activity
      const detailsJson = JSON.stringify({
        shareId,
        permissions,
        expiresAt,
        hasPassword: !!passwordHash
      })
      await sql`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES (${documentId}, ${user.id}, ${'share_link_created'}, ${detailsJson}::jsonb, NOW())
      `

      return NextResponse.json({
        id: newLink.id,
        url: newLink.url,
        permissions: newLink.permissions,
        expiresAt: newLink.expires_at,
        maxAccess: newLink.max_access_count,
        accessCount: 0,
        downloadEnabled: newLink.download_enabled,
        requireAuth: newLink.require_auth,
        isActive: newLink.is_active,
        createdAt: newLink.created_at
      })

    } catch (error) {
      logError('Create share link error:', error)
      return createErrorResponse('Failed to create share link', 500)
    }
  }
)

export const DELETE = withDocumentAuth(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const { searchParams } = new URL(request.url)
      const linkId = searchParams.get('linkId')

      if (!linkId) {
        return createErrorResponse('Link ID is required', 400)
      }

      const sql = getSql()

      // Verify the share link belongs to this document and was created by this user
      const existingLink = await sql`
        SELECT id FROM document_share_links 
        WHERE id = ${linkId} AND document_id = ${documentId} AND created_by = ${user.id}
      ` as any[] // eslint-disable-line @typescript-eslint/no-explicit-any

      if (!existingLink || existingLink.length === 0) {
        return createErrorResponse('Share link not found', 404)
      }

      // Soft delete by setting is_active to false
      await sql`
        UPDATE document_share_links 
        SET is_active = false 
        WHERE id = ${linkId} AND document_id = ${documentId} AND created_by = ${user.id}
      `

      // Log activity
      const detailsJson = JSON.stringify({
        shareId: linkId,
        action: 'deleted'
      })
      await sql`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES (${documentId}, ${user.id}, ${'share_link_deleted'}, ${detailsJson}::jsonb, NOW())
      `

      return NextResponse.json({ success: true, message: 'Share link deleted successfully' })

    } catch (error) {
      logError('Delete share link error:', error)
      return createErrorResponse('Failed to delete share link', 500)
    }
  }
)
