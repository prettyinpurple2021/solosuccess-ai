import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'


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
    const { email, role, message, _invitedBy } = await request.json()

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }

    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, name FROM documents 
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
      return NextResponse.json({ error: 'User already has access to this document' }, { status: 400 })
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
      VALUES ($1, $2, 'invitation_sent', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        email,
        role,
        message: message || null,
        documentName: document.name
      })
    ])

    // TODO: Send email invitation
    // This would integrate with your email service (SendGrid, AWS SES, etc.)
    logInfo(`Invitation sent to ${email} for document ${document.name} with role ${role}`)

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
    logError('Send invitation error:', error)
    return NextResponse.json({ 
      error: 'Failed to send invitation' 
    }, { status: 500 })
  }
}
