import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

export async function GET(
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
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get share links
    const { rows: shareLinks } = await client.query(`
      SELECT 
        id, url, permissions, expires_at, max_access_count, 
        access_count, download_enabled, require_auth, is_active, created_at
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
    console.error('Get share links error:', error)
    return NextResponse.json({ 
      error: 'Failed to get share links' 
    }, { status: 500 })
  }
}

export async function POST(
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
    const { 
      permissions, 
      password, 
      expiresAt, 
      downloadEnabled, 
      maxAccess, 
      requireAuth, 
      _trackAccess 
    } = await request.json()

    if (!permissions) {
      return NextResponse.json({ error: 'Permissions are required' }, { status: 400 })
    }

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Generate unique share link
    const shareId = uuidv4()
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareId}`

    // Hash password if provided
    let passwordHash = null
    if (password && password.trim()) {
      passwordHash = await bcrypt.hash(password, 10)
    }

    // Create share link
    const { rows: [newLink] } = await client.query(`
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
    await client.query(`
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
    console.error('Create share link error:', error)
    return NextResponse.json({ 
      error: 'Failed to create share link' 
    }, { status: 500 })
  }
}
