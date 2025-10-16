import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { getDb } from '@/lib/database-client'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'



// Edge Runtime disabled due to Node.js dependency incompatibility

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

    const db = getDb()

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

    // Send email invitation via Resend
    try {
      const { Resend } = await import('resend')
      const resendApiKey = process.env.RESEND_API_KEY
      if (!resendApiKey) {
        throw new Error('RESEND_API_KEY not configured')
      }
      const resend = new Resend(resendApiKey)
      const appUrl = process.env.APP_URL || 'https://solobossai.fun'
      const inviteLink = `${appUrl}/briefcase/invite/accept?doc=${encodeURIComponent(documentId)}&email=${encodeURIComponent(email)}`
      await resend.emails.send({
        from: 'SoloBoss AI <noreply@solobossai.fun>',
        to: email,
        subject: `You have been invited to access "${document.name}"`,
        html: `<p>Hello,</p>
               <p>${user.full_name || user.email} has invited you to access the document <strong>${document.name}</strong> with <strong>${role}</strong> access.</p>
               ${message ? `<p>Message from ${user.full_name || user.email}: ${message}</p>` : ''}
               <p>Click the link below to accept the invitation:</p>
               <p><a href="${inviteLink}">Accept Invitation</a></p>
               <p>If you did not expect this email, you can ignore it.</p>`
      })
      logInfo(`Invitation email sent to ${email} for document ${document.name} with role ${role}`)
    } catch (mailError) {
      logWarn('Failed to send invitation email. Proceeding without email.', mailError)
    }

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
