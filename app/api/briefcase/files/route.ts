import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'

// GET /api/briefcase/files -> list user's documents with optional filters
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const folder = searchParams.get('folder')
    const search = searchParams.get('search')
    const limit = Number(searchParams.get('limit') || '100')
    const offset = Number(searchParams.get('offset') || '0')

    const client = await createClient()

    // Build dynamic conditions
    const conditions: string[] = ['d.user_id = $1']
    const params: any[] = [user.id]
    let paramIndex = 2

    if (category && category !== 'all') {
      conditions.push(`d.category = $${paramIndex++}`)
      params.push(category)
    }
    if (folder) {
      conditions.push(`d.folder_id = $${paramIndex++}`)
      params.push(folder)
    }
    if (search) {
      conditions.push(`(d.name ILIKE $${paramIndex} OR d.description ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const query = `
      SELECT d.id, d.user_id, d.folder_id, d.name, d.original_name, d.file_type, d.mime_type,
             d.size, d.category, d.description, d.tags, d.metadata, d.ai_insights,
             d.is_favorite, d.download_count, d.view_count, d.last_accessed,
             d.created_at, d.updated_at,
             f.name AS folder_name, f.color AS folder_color
      FROM documents d
      LEFT JOIN document_folders f ON f.id = d.folder_id
      ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `
    params.push(limit, offset)

    const { rows } = await client.query(query, params)

    const files = rows.map((r: any) => {
      let tags: string[] = []
      try {
        tags = Array.isArray(r.tags) ? r.tags : JSON.parse(r.tags || '[]')
      } catch {
        tags = []
      }
      return {
        id: r.id,
        name: r.name,
        original_name: r.original_name || r.name,
        file_type: r.file_type,
        mime_type: r.mime_type,
        size: Number(r.size || 0),
        category: r.category || 'uncategorized',
        description: r.description || '',
        tags,
        metadata: r.metadata || {},
        ai_insights: r.ai_insights || {},
        is_favorite: !!r.is_favorite,
        download_count: Number(r.download_count || 0),
        view_count: Number(r.view_count || 0),
        last_accessed: r.last_accessed || null,
        created_at: r.created_at,
        updated_at: r.updated_at,
        folder_id: r.folder_id,
        folder_name: r.folder_name,
        folder_color: r.folder_color,
        downloadUrl: `/api/briefcase/files/${r.id}/download`,
        previewUrl: `/api/briefcase/files/${r.id}/preview`,
      }
    })

    // Stats
    const { rows: categoryRows } = await client.query(
      `SELECT category AS name, COUNT(*)::int AS count FROM documents WHERE user_id = $1 GROUP BY category`,
      [user.id]
    )
    const { rows: typeRows } = await client.query(
      `SELECT file_type, COUNT(*)::int AS count FROM documents WHERE user_id = $1 GROUP BY file_type`,
      [user.id]
    )
    const { rows: totalRows } = await client.query(
      `SELECT COUNT(*)::int AS total, COALESCE(SUM(size),0)::bigint AS total_size FROM documents WHERE user_id = $1`,
      [user.id]
    )

    return NextResponse.json({
      success: true,
      files,
      stats: {
        totalFiles: totalRows[0]?.total || 0,
        totalSize: Number(totalRows[0]?.total_size || 0),
        categories: categoryRows || [],
        fileTypes: typeRows || [],
      },
      pagination: {
        total: totalRows[0]?.total || 0,
        limit,
        offset,
        hasMore: offset + limit < (totalRows[0]?.total || 0),
      },
    })
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}

// (Optional) POST can be used for server-side utilities; not used by UI currently
export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 405 })
}
