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
  async (request: NextRequest, user: any, documentId: string) => {
    try {
      const sql = getSql()

      // Get share links
      const shareLinks = await sql(`
        SELECT 
          id, url, permissions, expires_at, max_access_count, 
          access_count, download_enabled, require_auth, is_active, created_at,
          password_hash
        FROM document_share_links 
        WHERE document_id = $1 AND is_active = true
        ORDER BY created_at DESC
      `, [documentId])

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
      const newLink = await sql(`
        INSERT INTO document_share_links (
          id, document_id, created_by, url, password_hash, permissions, 
          expires_at, max_access_count, download_enabled, require_auth, 
          is_active, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING *
      `, [
        shareId,
        documentId,
        user.id,
        shareUrl,
        passwordHash,
        permissions,
        expiresAt,
        maxAccess,
        downloadEnabled,
        requireAuth,
        true
      ])

      // Log activity
      await sql(`
        INSERT INTO document_activity (document_id, user_id, action, details, created_at)
        VALUES ($1, $2, 'share_link_created', $3, NOW())
      `, [
        documentId,
        user.id,
        JSON.stringify({
          shareId,
          permissions,
          expiresAt,
          hasPassword: !!passwordHash
        })
      ])

      return NextResponse.json({
        id: newLink[0].id,
        url: newLink[0].url,
        permissions: newLink[0].permissions,
        expiresAt: newLink[0].expires_at,
        maxAccess: newLink[0].max_access_count,
        accessCount: 0,
        downloadEnabled: newLink[0].download_enabled,
        requireAuth: newLink[0].require_auth,
        isActive: newLink[0].is_active,
        createdAt: newLink[0].created_at
      })

    } catch (error) {
      logError('Create share link error:', error)
      return createErrorResponse('Failed to create share link', 500)
    }
  }
)
