import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Get document versions
    const { rows: versions } = await client.query(`
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
    console.error('Get versions error:', error)
    return NextResponse.json({ 
      error: 'Failed to get versions' 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = id
    const { changelog } = await request.json()
    const client = await createClient()

    // Verify document ownership
    const { rows: [document] } = await client.query(`
      SELECT id, name, file_data, file_size, mime_type FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get next version number
    const { rows: [lastVersion] } = await client.query(`
      SELECT version_number FROM document_versions 
      WHERE document_id = $1 
      ORDER BY version_number DESC 
      LIMIT 1
    `, [documentId])

    const nextVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1

    // Create new version
    const { rows: [newVersion] } = await client.query(`
      INSERT INTO document_versions (
        document_id, version_number, file_name, file_data, file_size, 
        mime_type, created_by, changelog, is_current, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `, [
      documentId,
      nextVersionNumber,
      document.name,
      document.file_data,
      document.file_size,
      document.mime_type,
      user.id,
      changelog || `Version ${nextVersionNumber}`,
      true
    ])

    // Mark all other versions as not current
    await client.query(`
      UPDATE document_versions 
      SET is_current = false 
      WHERE document_id = $1 AND id != $2
    `, [documentId, newVersion.id])

    // Log activity
    await client.query(`
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
      id: newVersion.id,
      versionNumber: newVersion.version_number,
      fileName: newVersion.file_name,
      fileSize: newVersion.file_size,
      mimeType: newVersion.mime_type,
      createdAt: newVersion.created_at,
      createdBy: newVersion.created_by,
      changelog: newVersion.changelog,
      isCurrent: newVersion.is_current
    })

  } catch (error) {
    console.error('Create version error:', error)
    return NextResponse.json({ 
      error: 'Failed to create version' 
    }, { status: 500 })
  }
}
