import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: documentId, versionId } = params
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get version details
    const { rows: [version] } = await client.query(`
      SELECT 
        dv.*,
        u.name as created_by_name,
        u.avatar_url
      FROM document_versions dv
      LEFT JOIN users u ON dv.created_by = u.id
      WHERE dv.id = $1 AND dv.document_id = $2
    `, [versionId, documentId])

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: version.id,
      versionNumber: version.version_number,
      fileName: version.file_name,
      fileSize: version.file_size,
      mimeType: version.mime_type,
      createdAt: version.created_at,
      createdBy: version.created_by,
      createdByName: version.created_by_name || 'Unknown',
      createdByAvatar: version.avatar_url,
      changelog: version.changelog,
      isCurrent: version.is_current
    })

  } catch (error) {
    console.error('Get version error:', error)
    return NextResponse.json({ 
      error: 'Failed to get version' 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: documentId, versionId } = params
    const { action } = await request.json()
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get version details
    const { rows: [version] } = await client.query(`
      SELECT * FROM document_versions 
      WHERE id = $1 AND document_id = $2
    `, [versionId, documentId])

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    switch (action) {
      case 'restore':
        // Restore this version as current
        await client.query(`
          UPDATE document_versions 
          SET is_current = false 
          WHERE document_id = $1
        `, [documentId])

        await client.query(`
          UPDATE document_versions 
          SET is_current = true 
          WHERE id = $1
        `, [versionId])

        // Update the main document with this version's data
        await client.query(`
          UPDATE documents 
          SET 
            file_data = $1,
            file_size = $2,
            mime_type = $3,
            updated_at = NOW()
          WHERE id = $4
        `, [version.file_data, version.file_size, version.mime_type, documentId])

        // Log activity
        await client.query(`
          INSERT INTO document_activity (document_id, user_id, action, details, created_at)
          VALUES ($1, $2, 'version_restored', $3, NOW())
        `, [
          documentId,
          user.id,
          JSON.stringify({
            versionId,
            versionNumber: version.version_number,
            changelog: version.changelog
          })
        ])

        return NextResponse.json({
          success: true,
          message: 'Version restored successfully'
        })

      case 'download':
        // Return file data for download
        return new NextResponse(version.file_data, {
          headers: {
            'Content-Type': version.mime_type,
            'Content-Disposition': `attachment; filename="${version.file_name}"`,
            'Content-Length': version.file_size.toString()
          }
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Version action error:', error)
    return NextResponse.json({ 
      error: 'Failed to process version action' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: documentId, versionId } = params
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get version details before deletion
    const { rows: [version] } = await client.query(`
      SELECT version_number, changelog, is_current FROM document_versions 
      WHERE id = $1 AND document_id = $2
    `, [versionId, documentId])

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Don't allow deletion of current version
    if (version.is_current) {
      return NextResponse.json({ error: 'Cannot delete current version' }, { status: 400 })
    }

    // Delete version
    await client.query(`
      DELETE FROM document_versions 
      WHERE id = $1 AND document_id = $2
    `, [versionId, documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'version_deleted', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        versionId,
        versionNumber: version.version_number,
        changelog: version.changelog
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Version deleted successfully'
    })

  } catch (error) {
    console.error('Delete version error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete version' 
    }, { status: 500 })
  }
}
