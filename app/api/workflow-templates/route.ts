import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { logger, logError, logInfo } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limiter'

// GET /api/workflow-templates - List workflow templates
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'templates-list', 100, 3600) // 100 requests per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const category = searchParams.get('category')
    const complexity = searchParams.get('complexity')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'popularity'
    const featured = searchParams.get('featured') === 'true'
    const trending = searchParams.get('trending') === 'true'

    // Build query
    let query = supabase
      .from('workflow_templates')
      .select(`
        *,
        template_ratings(rating, user_id),
        template_downloads(user_id, downloaded_at)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (complexity && complexity !== 'all') {
      query = query.eq('complexity', complexity)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (featured) {
      query = query.eq('featured', true)
    }

    if (trending) {
      query = query.eq('trending', true)
    }

    // Apply sorting
    switch (sortBy) {
      case 'popularity':
        query = query.order('download_count', { ascending: false })
        break
      case 'rating':
        query = query.order('average_rating', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'complexity':
        query = query.order('complexity', { ascending: true })
        break
      default:
        query = query.order('download_count', { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: templates, error: templatesError } = await query

    if (templatesError) {
      logError('Failed to fetch templates:', templatesError)
      return NextResponse.json(
        { error: 'Failed to fetch templates' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('workflow_templates')
      .select('id', { count: 'exact' })
      .eq('is_public', true)

    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category)
    }

    if (complexity && complexity !== 'all') {
      countQuery = countQuery.eq('complexity', complexity)
    }

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    if (featured) {
      countQuery = countQuery.eq('featured', true)
    }

    if (trending) {
      countQuery = countQuery.eq('trending', true)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      logError('Failed to count templates:', countError)
    }

    // Enhance templates with user-specific data
    const enhancedTemplates = await Promise.all(
      templates.map(async (template) => {
        // Check if user has downloaded this template
        const { data: userDownload } = await supabase
          .from('template_downloads')
          .select('downloaded_at')
          .eq('template_id', template.id)
          .eq('user_id', user.id)
          .single()

        // Check if user has rated this template
        const { data: userRating } = await supabase
          .from('template_ratings')
          .select('rating')
          .eq('template_id', template.id)
          .eq('user_id', user.id)
          .single()

        // Check if user has bookmarked this template
        const { data: userBookmark } = await supabase
          .from('template_bookmarks')
          .select('created_at')
          .eq('template_id', template.id)
          .eq('user_id', user.id)
          .single()

        return {
          ...template,
          userDownloaded: !!userDownload,
          userRating: userRating?.rating || null,
          userBookmarked: !!userBookmark,
          downloadedAt: userDownload?.downloaded_at || null
        }
      })
    )

    logInfo('Templates fetched successfully', {
      userId: user.id,
      count: enhancedTemplates.length,
      page,
      limit,
      filters: { category, complexity, search, featured, trending }
    })

    return NextResponse.json({
      templates: enhancedTemplates,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    logError('Error in GET /api/workflow-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/workflow-templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'templates-create', 5, 3600) // 5 templates per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      category,
      tags,
      complexity,
      workflow,
      estimatedTime,
      requiredIntegrations,
      isPublic = false,
      featured = false
    } = body

    // Validate required fields
    if (!name || !description || !category || !workflow) {
      return NextResponse.json(
        { error: 'Name, description, category, and workflow are required' },
        { status: 400 }
      )
    }

    // Validate workflow structure
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      return NextResponse.json(
        { error: 'Invalid workflow structure' },
        { status: 400 }
      )
    }

    // Create template
    const { data: template, error: templateError } = await supabase
      .from('workflow_templates')
      .insert({
        user_id: user.id,
        name,
        description,
        category,
        tags: tags || [],
        complexity: complexity || 'beginner',
        workflow: workflow,
        estimated_time: estimatedTime || '15-30 min',
        required_integrations: requiredIntegrations || [],
        is_public: isPublic,
        featured: featured,
        download_count: 0,
        like_count: 0,
        average_rating: 0,
        rating_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (templateError) {
      logError('Failed to create template:', templateError)
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }

    logInfo('Template created successfully', {
      templateId: template.id,
      userId: user.id,
      name,
      category,
      isPublic
    })

    return NextResponse.json({ template }, { status: 201 })

  } catch (error) {
    logError('Error in POST /api/workflow-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workflow-templates - Update template
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'templates-update', 20, 3600) // 20 updates per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Check if template exists and user owns it
    const { data: existingTemplate, error: fetchError } = await supabase
      .from('workflow_templates')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Update template
    const { data: updatedTemplate, error: updateError } = await supabase
      .from('workflow_templates')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      logError('Failed to update template:', updateError)
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      )
    }

    logInfo('Template updated successfully', {
      templateId: id,
      userId: user.id,
      updates: Object.keys(updates)
    })

    return NextResponse.json({ template: updatedTemplate })

  } catch (error) {
    logError('Error in PUT /api/workflow-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflow-templates - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const headersList = headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'templates-delete', 5, 3600) // 5 deletes per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    // Check if template exists and user owns it
    const { data: template, error: fetchError } = await supabase
      .from('workflow_templates')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Delete template (cascade will handle related data)
    const { error: deleteError } = await supabase
      .from('workflow_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      logError('Failed to delete template:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete template' },
        { status: 500 }
      )
    }

    logInfo('Template deleted successfully', {
      templateId: id,
      userId: user.id,
      name: template.name
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    logError('Error in DELETE /api/workflow-templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
