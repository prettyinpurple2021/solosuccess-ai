import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { getDb } from '@/lib/database-client'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'



// Edge Runtime disabled due to Node.js dependency incompatibility

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const { id } = params
    const body = await request.json()

    const db = getDb()
    // Ensure ownership
    const { rows: [doc] } = await client.query(`SELECT id FROM documents WHERE id = $1 AND user_id = $2`, [id, user.id])
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { name, description, category, folder_id } = body
    const { rows: [updated] } = await client.query(`
      UPDATE documents
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          folder_id = COALESCE($4, folder_id),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `, [name, description, category, folder_id, id])

    return NextResponse.json({ success: true, document: updated })
  } catch (error) {
    logError('Error updating file:', error)
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const params = await context.params
    const { id } = params

    const db = getDb()
    // Ensure ownership
    const { rows: [doc] } = await client.query(`SELECT id, size, folder_id FROM documents WHERE id = $1 AND user_id = $2`, [id, user.id])
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await client.query(`DELETE FROM documents WHERE id = $1`, [id])

    // Update folder counters if applicable
    if (doc.folder_id) {
      await client.query(`
        UPDATE document_folders
        SET file_count = GREATEST(file_count - 1, 0),
            total_size = GREATEST(total_size - $1, 0),
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
      `, [doc.size || 0, doc.folder_id, user.id])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logError('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const params = await context.params
    const { id } = params

    const db = getDb()
    const { rows: [r] } = await client.query(`
      SELECT d.*, f.name AS folder_name, f.color AS folder_color
      FROM documents d
      LEFT JOIN document_folders f ON f.id = d.folder_id
      WHERE d.id = $1 AND d.user_id = $2
    `, [id, user.id])
    if (!r) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    let tags: string[] = []
    try { tags = Array.isArray(r.tags) ? r.tags : JSON.parse(r.tags || '[]') } catch { tags = [] }

    return NextResponse.json({
      success: true,
      file: {
        id: r.id,
        name: r.name,
        original_name: r.original_name || r.name,
        file_type: r.file_type,
        mime_type: r.mime_type,
        size: Number(r.size || 0),
        category: r.category || 'uncategorized',
        description: r.description || '',
        tags,
        is_favorite: !!r.is_favorite,
        folder_id: r.folder_id,
        folder_name: r.folder_name,
        folder_color: r.folder_color,
        created_at: r.created_at,
        updated_at: r.updated_at,
        downloadUrl: `/api/briefcase/files/${r.id}/download`,
        previewUrl: `/api/briefcase/files/${r.id}/preview`,
      }
    })
  } catch (error) {
    logError('Error fetching file:', error)
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 })
  }
}
