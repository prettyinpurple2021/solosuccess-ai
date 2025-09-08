import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

// File types that can be previewed
const PREVIEWABLE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'text/typescript',
  'application/typescript',
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = params.id
    const client = await createClient()

    // Get document info with file data
    const { rows: [document] } = await client.query(`
      SELECT id, name, original_name, mime_type, size, file_data, user_id
      FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if file type is previewable
    if (!PREVIEWABLE_TYPES.includes(document.mime_type)) {
      return NextResponse.json({ 
        error: 'File type not previewable',
        previewable: false 
      }, { status: 400 })
    }

    // Check if user has permission to view
    const hasPermission = await checkViewPermission(client, documentId, user.id)
    if (!hasPermission) {
      return NextResponse.json({ error: 'No permission to view' }, { status: 403 })
    }

    // Get file data from database
    const fileBuffer = document.file_data

    // Update view count and last accessed
    await client.query(`
      UPDATE documents 
      SET view_count = view_count + 1, 
          last_accessed = NOW(),
          updated_at = NOW()
      WHERE id = $1
    `, [documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'viewed', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        fileName: document.name,
        fileType: document.mime_type,
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
    ])

    // Return file with appropriate headers for preview
    const headers: Record<string, string> = {
      'Content-Type': document.mime_type,
      'Content-Length': document.size.toString(),
      'Cache-Control': 'private, max-age=3600',
    }

    // For images, allow inline display
    if (document.mime_type.startsWith('image/')) {
      headers['Content-Disposition'] = 'inline'
    } else {
      headers['Content-Disposition'] = `inline; filename="${document.original_name}"`
    }

    return new NextResponse(fileBuffer, { headers })

  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json(
      { error: 'Failed to preview file' },
      { status: 500 }
    )
  }
}

async function checkViewPermission(client: any, documentId: string, userId: string): Promise<boolean> {
  // Check if user owns the document
  const { rows: [document] } = await client.query(`
    SELECT user_id FROM documents WHERE id = $1
  `, [documentId])

  if (document && document.user_id === userId) {
    return true
  }

  // Check if user has explicit permission
  const { rows: [permission] } = await client.query(`
    SELECT role FROM document_permissions 
    WHERE document_id = $1 AND user_id = $2 AND is_active = true
  `, [documentId, userId])

  return !!permission
}
