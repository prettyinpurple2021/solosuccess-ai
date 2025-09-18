import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'


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

    // Get permissions
    const { rows: permissions } = await client.query(`
      SELECT 
        dp.id,
        dp.user_id,
        dp.email,
        dp.role,
        dp.granted_at,
        dp.expires_at,
        dp.is_active,
        u.name as user_name,
        u.avatar_url,
        dp.granted_by,
        gb.name as granted_by_name
      FROM document_permissions dp
      LEFT JOIN users u ON dp.user_id = u.id
      LEFT JOIN users gb ON dp.granted_by = gb.id
      WHERE dp.document_id = $1 AND dp.is_active = true
      ORDER BY dp.granted_at DESC
    `, [documentId])

    return NextResponse.json(permissions.map(p => ({
      id: p.id,
      userId: p.user_id,
      email: p.email,
      name: p.user_name || p.email.split('@')[0],
      avatar: p.avatar_url,
      role: p.role,
      granted: p.granted_at,
      expiresAt: p.expires_at,
      status: p.is_active ? 'accepted' : 'pending',
      accessCount: 0, // TODO: Implement access tracking
      invitedBy: p.granted_by_name || 'Unknown'
    })))

  } catch (error) {
    logError('Get permissions error:', error)
    return NextResponse.json({ 
      error: 'Failed to get permissions' 
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
    const { email, role, message } = await request.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
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

    // Check if permission already exists
    const { rows: [existingPermission] } = await client.query(`
      SELECT id FROM document_permissions 
      WHERE document_id = $1 AND email = $2 AND is_active = true
    `, [documentId, email])

    if (existingPermission) {
      return NextResponse.json({ error: 'Permission already exists for this email' }, { status: 400 })
    }

    // Create permission
    const { rows: [newPermission] } = await client.query(`
      INSERT INTO document_permissions (
        document_id, user_id, email, role, granted_by, granted_at, is_active
      ) VALUES ($1, $2, $3, $4, $5, NOW(), true)
      RETURNING *
    `, [documentId, null, email, role, user.id])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'permission_granted', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        email,
        role,
        message: message || null
      })
    ])

    return NextResponse.json({
      id: newPermission.id,
      email: newPermission.email,
      role: newPermission.role,
      granted: newPermission.granted_at,
      status: 'pending',
      accessCount: 0,
      invitedBy: user.full_name || user.email
    })

  } catch (error) {
    logError('Create permission error:', error)
    return NextResponse.json({ 
      error: 'Failed to create permission' 
    }, { status: 500 })
  }
}
