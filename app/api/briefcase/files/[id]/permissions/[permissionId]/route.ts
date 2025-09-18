import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'


export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; permissionId: string }> }
) {
  try {
    const params = await context.params
    const { id: documentId, permissionId } = params
    
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 })
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

    // Update permission
    const { rows: [updatedPermission] } = await client.query(`
      UPDATE document_permissions 
      SET role = $1
      WHERE id = $2 AND document_id = $3
      RETURNING *
    `, [role, permissionId, documentId])

    if (!updatedPermission) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 })
    }

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'permission_updated', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        permissionId,
        newRole: role,
        email: updatedPermission.email
      })
    ])

    return NextResponse.json({
      success: true,
      role: updatedPermission.role
    })

  } catch (error) {
    logError('Update permission error:', error)
    return NextResponse.json({ 
      error: 'Failed to update permission' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; permissionId: string }> }
) {
  try {
    const params = await context.params
    const { id: documentId, permissionId } = params
    
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Get permission details before deletion
    const { rows: [permission] } = await client.query(`
      SELECT email, role FROM document_permissions 
      WHERE id = $1 AND document_id = $2
    `, [permissionId, documentId])

    if (!permission) {
      return NextResponse.json({ error: 'Permission not found' }, { status: 404 })
    }

    // Delete permission
    await client.query(`
      DELETE FROM document_permissions 
      WHERE id = $1 AND document_id = $2
    `, [permissionId, documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'permission_revoked', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        permissionId,
        email: permission.email,
        role: permission.role
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Permission revoked successfully'
    })

  } catch (error) {
    logError('Delete permission error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete permission' 
    }, { status: 500 })
  }
}
