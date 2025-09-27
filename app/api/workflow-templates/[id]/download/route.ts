import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { logger, logError, logInfo } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limiter'

// POST /api/workflow-templates/[id]/download - Download template
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const rateLimitResult = await rateLimiter.checkLimit(ip, 'template-download', 50, 3600) // 50 downloads per hour
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const templateId = params.id

    // Get template
    const { data: template, error: templateError } = await supabase
      .from('workflow_templates')
      .select('*')
      .eq('id', templateId)
      .eq('is_public', true)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user already downloaded this template
    const { data: existingDownload, error: downloadCheckError } = await supabase
      .from('template_downloads')
      .select('id')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .single()

    if (downloadCheckError && downloadCheckError.code !== 'PGRST116') {
      logError('Failed to check existing download:', downloadCheckError)
    }

    // If not already downloaded, record the download
    if (!existingDownload) {
      const { error: downloadError } = await supabase
        .from('template_downloads')
        .insert({
          template_id: templateId,
          user_id: user.id,
          downloaded_at: new Date().toISOString()
        })

      if (downloadError) {
        logError('Failed to record download:', downloadError)
      } else {
        // Increment download count
        await supabase
          .from('workflow_templates')
          .update({ 
            download_count: supabase.raw('download_count + 1'),
            updated_at: new Date().toISOString()
          })
          .eq('id', templateId)
      }
    }

    // Get template author info
    const { data: author, error: authorError } = await supabase
      .from('profiles')
      .select('username, avatar_url, verified')
      .eq('id', template.user_id)
      .single()

    if (authorError) {
      logError('Failed to fetch template author:', authorError)
    }

    logInfo('Template downloaded', {
      templateId,
      userId: user.id,
      templateName: template.name,
      isNewDownload: !existingDownload
    })

    return NextResponse.json({
      template: {
        ...template,
        author: author ? {
          name: author.username,
          avatar: author.avatar_url,
          verified: author.verified
        } : {
          name: 'Unknown',
          verified: false
        },
        userDownloaded: true,
        downloadedAt: existingDownload ? new Date().toISOString() : new Date().toISOString()
      }
    })

  } catch (error) {
    logError('Error in POST /api/workflow-templates/[id]/download:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/workflow-templates/[id]/download - Get template details for download
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templateId = params.id

    // Get template with author info
    const { data: template, error: templateError } = await supabase
      .from('workflow_templates')
      .select(`
        *,
        profiles!workflow_templates_user_id_fkey(username, avatar_url, verified)
      `)
      .eq('id', templateId)
      .eq('is_public', true)
      .single()

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if user has downloaded this template
    const { data: userDownload, error: downloadError } = await supabase
      .from('template_downloads')
      .select('downloaded_at')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .single()

    if (downloadError && downloadError.code !== 'PGRST116') {
      logError('Failed to check user download:', downloadError)
    }

    // Get template ratings
    const { data: ratings, error: ratingsError } = await supabase
      .from('template_ratings')
      .select('rating, user_id')
      .eq('template_id', templateId)

    if (ratingsError) {
      logError('Failed to fetch template ratings:', ratingsError)
    }

    // Calculate user's rating
    const userRating = ratings?.find(r => r.user_id === user.id)?.rating || null

    // Get template bookmarks
    const { data: userBookmark, error: bookmarkError } = await supabase
      .from('template_bookmarks')
      .select('created_at')
      .eq('template_id', templateId)
      .eq('user_id', user.id)
      .single()

    if (bookmarkError && bookmarkError.code !== 'PGRST116') {
      logError('Failed to check user bookmark:', bookmarkError)
    }

    return NextResponse.json({
      template: {
        ...template,
        author: template.profiles ? {
          name: template.profiles.username,
          avatar: template.profiles.avatar_url,
          verified: template.profiles.verified
        } : {
          name: 'Unknown',
          verified: false
        },
        userDownloaded: !!userDownload,
        userRating,
        userBookmarked: !!userBookmark,
        downloadedAt: userDownload?.downloaded_at || null
      }
    })

  } catch (error) {
    logError('Error in GET /api/workflow-templates/[id]/download:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
