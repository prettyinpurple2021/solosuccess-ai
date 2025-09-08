import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Ensure user exists in database
    const client = await createClient()
    let { rows: userData } = await client.query(
      'SELECT id FROM users WHERE id = $1',
      [user.id]
    )

    if (userData.length === 0) {
      // Create user if they don't exist
      await client.query(
        `INSERT INTO users (id, email, full_name, avatar_url, subscription_tier, level, total_points, current_streak, wellness_score, focus_minutes, onboarding_completed, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          user.id,
          user.email,
          user.full_name,
          user.avatar_url,
          'free',
          1,
          0,
          0,
          50,
          0,
          false
        ]
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query with folder information (exclude file_data for performance)
    let query = `
      SELECT 
        d.id, d.name, d.original_name, d.file_type, d.mime_type, d.size, 
        d.category, d.description, d.tags, d.metadata, d.ai_insights,
        d.is_favorite, d.download_count, d.view_count, d.last_accessed,
        d.created_at, d.updated_at, d.folder_id,
        f.name as folder_name, f.color as folder_color
      FROM documents d
      LEFT JOIN document_folders f ON d.folder_id = f.id
      WHERE d.user_id = $1
    `
    const params = [user.id]
    let paramIndex = 2

    if (category && category !== 'all') {
      query += ` AND d.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    if (search) {
      query += ` AND (d.name ILIKE $${paramIndex} OR d.description ILIKE $${paramIndex} OR d.tags::text ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` ORDER BY d.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit.toString(), offset.toString())

    const { rows: files } = await client.query(query, params)

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM documents d WHERE d.user_id = $1`
    const countParams = [user.id]

    if (category && category !== 'all') {
      countQuery += ` AND d.category = $2`
      countParams.push(category)
    }

    if (search) {
      countQuery += ` AND (d.name ILIKE $${countParams.length + 1} OR d.description ILIKE $${countParams.length + 1} OR d.tags::text ILIKE $${countParams.length + 1})`
      countParams.push(`%${search}%`)
    }

    const { rows: [{ total }] } = await client.query(countQuery, countParams)

    // Get category statistics
    const { rows: categoryStats } = await client.query(
      `SELECT d.category, COUNT(*) as count, SUM(d.size) as total_size
       FROM documents d
       WHERE d.user_id = $1 
       GROUP BY d.category
       ORDER BY count DESC`,
      [user.id]
    )

    // Get file type statistics
    const { rows: fileTypeStats } = await client.query(
      `SELECT d.file_type, COUNT(*) as count, SUM(d.size) as total_size
       FROM documents d
       WHERE d.user_id = $1 
       GROUP BY d.file_type
       ORDER BY count DESC`,
      [user.id]
    )

    return NextResponse.json({
      files: files.map(file => ({
        id: file.id,
        name: file.name,
        originalName: file.original_name,
        type: file.file_type,
        mimeType: file.mime_type,
        size: file.size,
        category: file.category,
        description: file.description,
        tags: file.tags ? JSON.parse(file.tags) : [],
        metadata: file.metadata ? JSON.parse(file.metadata) : {},
        aiInsights: file.ai_insights ? JSON.parse(file.ai_insights) : {},
        isFavorite: file.is_favorite,
        downloadCount: file.download_count,
        viewCount: file.view_count,
        lastAccessed: file.last_accessed,
        folderId: file.folder_id,
        folderName: file.folder_name,
        folderColor: file.folder_color,
        createdAt: file.created_at,
        updatedAt: file.updated_at,
        downloadUrl: `/api/briefcase/files/${file.id}/download`,
        previewUrl: `/api/briefcase/files/${file.id}/preview`,
      })),
      pagination: {
        total: parseInt(total),
        limit,
        offset,
        hasMore: offset + limit < parseInt(total)
      },
      stats: {
        totalFiles: parseInt(total),
        totalSize: files.reduce((sum, file) => sum + parseInt(file.size), 0),
        categories: categoryStats.map(stat => ({
          name: stat.category,
          count: parseInt(stat.count),
          totalSize: parseInt(stat.total_size || 0)
        })),
        fileTypes: fileTypeStats.map(stat => ({
          type: stat.file_type,
          count: parseInt(stat.count),
          totalSize: parseInt(stat.total_size || 0)
        }))
      }
    })

  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    )
  }
}
