import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Type for document search results from database
interface DocumentSearchResult {
  id: string
  name: string
  description: string
  tags: string[]
  category: string
  file_type: string
  ai_insights: any
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      query = '',
      semantic = false,
      fileTypes = [],
      categories = [],
      tags = [],
      dateRange,
      sizeRange = [0, 1000],
      authors = [],
      favorites = false,
      folders = [],
      sortBy = 'relevance',
      sortOrder = 'desc',
      includeContent = true,
      includeComments = false,
      limit = 50,
      offset = 0
    } = await request.json()

    const client = await createClient()

    // Build base query
    let whereConditions = ['d.user_id = $1']
    let params: any[] = [user.id]
    let paramIndex = 2

    // Text search
    if (query.trim()) {
      if (semantic && includeContent) {
        // For semantic search, we'll use AI to find relevant documents
        const semanticResults = await performSemanticSearch(query, user.id, client)
        if (semanticResults.length > 0) {
          // Use parameterized queries to prevent SQL injection
          const placeholders = semanticResults.map(() => `$${paramIndex++}`).join(',')
          whereConditions.push(`d.id IN (${placeholders})`)
          params.push(...semanticResults.map(r => r.id))
        } else {
          // Fallback to regular text search if semantic search fails
          whereConditions.push(`(
            d.name ILIKE $${paramIndex} OR 
            d.description ILIKE $${paramIndex} OR
            d.original_name ILIKE $${paramIndex}
          )`)
          params.push(`%${query}%`)
          paramIndex++
        }
      } else {
        // Regular text search
        if (includeContent) {
          whereConditions.push(`(
            d.name ILIKE $${paramIndex} OR 
            d.description ILIKE $${paramIndex} OR
            d.original_name ILIKE $${paramIndex}
          )`)
        } else {
          whereConditions.push(`(
            d.name ILIKE $${paramIndex} OR 
            d.original_name ILIKE $${paramIndex}
          )`)
        }
        params.push(`%${query}%`)
        paramIndex++
      }
    }

    // File types filter
    if (fileTypes.length > 0) {
      const placeholders = fileTypes.map(() => `$${paramIndex++}`).join(',')
      whereConditions.push(`d.file_type IN (${placeholders})`)
      params.push(...fileTypes)
    }

    // Categories filter
    if (categories.length > 0) {
      const placeholders = categories.map(() => `$${paramIndex++}`).join(',')
      whereConditions.push(`d.category IN (${placeholders})`)
      params.push(...categories)
    }

    // Tags filter
    if (tags.length > 0) {
      const tagConditions = tags.map((tag: string) => {
        const condition = `$${paramIndex++} = ANY(d.tags)`
        params.push(tag)
        return condition
      })
      whereConditions.push(`(${tagConditions.join(' OR ')})`)
    }

    // Date range filter
    if (dateRange?.from) {
      whereConditions.push(`d.created_at >= $${paramIndex++}`)
      params.push(dateRange.from.toISOString())
    }
    if (dateRange?.to) {
      whereConditions.push(`d.created_at <= $${paramIndex++}`)
      params.push(dateRange.to.toISOString())
    }

    // Size range filter (convert MB to bytes)
    if (sizeRange[0] > 0) {
      whereConditions.push(`d.size >= $${paramIndex++}`)
      params.push(sizeRange[0] * 1024 * 1024)
    }
    if (sizeRange[1] < 1000) {
      whereConditions.push(`d.size <= $${paramIndex++}`)
      params.push(sizeRange[1] * 1024 * 1024)
    }

    // Favorites filter
    if (favorites) {
      whereConditions.push(`d.is_favorite = true`)
    }

    // Folders filter
    if (folders.length > 0) {
      const placeholders = folders.map(() => `$${paramIndex++}`).join(',')
      whereConditions.push(`d.folder_id IN (${placeholders})`)
      params.push(...folders)
    }

    // Build sort clause
    let orderClause = ''
    switch (sortBy) {
      case 'date':
        orderClause = `ORDER BY d.created_at ${sortOrder.toUpperCase()}`
        break
      case 'name':
        orderClause = `ORDER BY d.name ${sortOrder.toUpperCase()}`
        break
      case 'size':
        orderClause = `ORDER BY d.size ${sortOrder.toUpperCase()}`
        break
      case 'relevance':
      default:
        if (semantic && query.trim()) {
          // For semantic search, maintain AI relevance order
          orderClause = `ORDER BY d.created_at DESC`
        } else {
          orderClause = `ORDER BY d.created_at DESC`
        }
        break
    }

    // Build final query
    const query_sql = `
      SELECT 
        d.id, d.name, d.original_name, d.file_type, d.mime_type, d.size, 
        d.category, d.description, d.tags, d.metadata, d.ai_insights,
        d.is_favorite, d.download_count, d.view_count, d.last_accessed,
        d.created_at, d.updated_at, d.folder_id,
        f.name as folder_name, f.color as folder_color
      FROM documents d
      LEFT JOIN document_folders f ON d.folder_id = f.id
      WHERE ${whereConditions.join(' AND ')}
      ${orderClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `

    params.push(limit, offset)

    // Execute search
    const { rows: files } = await client.query(query_sql, params)

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM documents d
      LEFT JOIN document_folders f ON d.folder_id = f.id
      WHERE ${whereConditions.join(' AND ')}
    `
    const { rows: [{ total }] } = await client.query(countQuery, params.slice(0, -2)) // Remove limit and offset

    // Get search statistics
    const stats = await getSearchStats(client, user.id, whereConditions, params.slice(0, -2))

    return NextResponse.json({
      files: files.map(file => ({
        ...file,
        downloadUrl: `/api/briefcase/files/${file.id}/download`,
        previewUrl: `/api/briefcase/files/${file.id}/preview`,
        tags: Array.isArray(file.tags) ? file.tags : [],
        metadata: file.metadata || {},
        aiInsights: file.ai_insights || {}
      })),
      total: parseInt(total),
      stats,
      searchInfo: {
        query,
        semantic,
        filters: {
          fileTypes,
          categories,
          tags,
          dateRange,
          sizeRange,
          favorites,
          folders
        },
        sortBy,
        sortOrder
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: 'Search failed' 
    }, { status: 500 })
  }
}

// Perform semantic search using AI
async function performSemanticSearch(query: string, userId: string, client: any) {
  try {
    // Get user's documents for semantic analysis
    const { rows: documents }: { rows: DocumentSearchResult[] } = await client.query(`
      SELECT id, name, description, tags, category, file_type, ai_insights
      FROM documents 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 100
    `, [userId])

    if (documents.length === 0) {
      return []
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const context = documents.map((doc: DocumentSearchResult) => ({
      id: doc.id,
      name: doc.name,
      description: doc.description,
      tags: doc.tags,
      category: doc.category,
      fileType: doc.file_type,
      aiInsights: doc.ai_insights
    }))

    const prompt = `
You are an AI assistant helping to find relevant documents based on a semantic search query.

User's search query: "${query}"

Available documents:
${JSON.stringify(context, null, 2)}

Please analyze the search query and return the IDs of the most relevant documents. Consider:
1. Semantic meaning and context
2. Document content, tags, and categories
3. File types and descriptions
4. Any AI insights available

Return a JSON array with this format:
[
  {
    "id": "document_id",
    "relevance_score": 0.95,
    "reason": "Brief explanation of why this document is relevant"
  }
]

Return only the most relevant documents (max 20), ordered by relevance score (highest first).
Focus on semantic relevance rather than exact keyword matches.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse AI response
    const aiResults = JSON.parse(text)
    if (Array.isArray(aiResults)) {
      return aiResults
        .filter(result => result.id && result.relevance_score > 0.3)
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 20)
    }

    return []
  } catch (error) {
    console.error('Semantic search error:', error)
    return []
  }
}

// Get search statistics
async function getSearchStats(client: any, userId: string, whereConditions: string[], params: any[]) {
  try {
    // File type distribution
    const { rows: fileTypeStats } = await client.query(`
      SELECT file_type, COUNT(*) as count, SUM(size) as total_size
      FROM documents d
      WHERE ${whereConditions.map((_, i) => `$${i + 1}`).join(' AND ')}
      GROUP BY file_type
      ORDER BY count DESC
    `, params)

    // Category distribution
    const { rows: categoryStats } = await client.query(`
      SELECT category, COUNT(*) as count
      FROM documents d
      WHERE ${whereConditions.map((_, i) => `$${i + 1}`).join(' AND ')}
      GROUP BY category
      ORDER BY count DESC
    `, params)

    // Tag distribution
    const { rows: tagStats } = await client.query(`
      SELECT jsonb_array_elements_text(tags) as tag, COUNT(*) as count
      FROM documents d
      WHERE ${whereConditions.map((_, i) => `$${i + 1}`).join(' AND ')} AND tags IS NOT NULL
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 20
    `, params)

    return {
      fileTypes: fileTypeStats,
      categories: categoryStats,
      tags: tagStats
    }
  } catch (error) {
    console.error('Stats error:', error)
    return {
      fileTypes: [],
      categories: [],
      tags: []
    }
  }
}
