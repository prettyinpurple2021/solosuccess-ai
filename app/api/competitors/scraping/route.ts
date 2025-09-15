import { NextRequest, NextResponse} from 'next/server'
import { z} from 'zod'
import { queueProcessor} from '@/lib/scraping-queue-processor'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const createJobSchema = z.object({
  competitorId: z.number(),
  jobType: z.enum(['website', 'pricing', 'products', 'jobs', 'social']),
  url: z.string().url(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  frequencyType: z.enum(['interval', 'cron', 'manual']).optional(),
  frequencyValue: z.string(),
  frequencyTimezone: z.string().optional(),
  config: z.object({
    changeDetection: z.object({
      enabled: z.boolean(),
      threshold: z.number(),
      ignoreSelectors: z.array(z.string()).optional()
    }).optional(),
    selectors: z.object({
      content: z.array(z.string()).optional(),
      pricing: z.array(z.string()).optional(),
      products: z.array(z.string()).optional()
    }).optional(),
    headers: z.record(z.string()).optional(),
    timeout: z.number().optional(),
    retryDelay: z.number().optional(),
    respectRobotsTxt: z.boolean().optional(),
    platform: z.string().optional()
  }).optional()
})

/**
 * GET /api/competitors/scraping - Get scraping queue statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'; const { allowed } = rateLimitByIp('api', ip, 60000, 100)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get queue statistics
    const stats = await queueProcessor.getQueueStats()
    const healthStatus = queueProcessor.getHealthStatus()

    return NextResponse.json({
      success: true,
      data: {
        stats,
        health: healthStatus
      }
    })

  } catch (error) {
    console.error('Error getting scraping stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/competitors/scraping - Create a new scraping job
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'; const { allowed } = rateLimitByIp('api', ip, 60000, 100)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createJobSchema.parse(body)

    // Create the scraping job
    const jobId = await queueProcessor.addJob({
      ...validatedData,
      userId: user.id
    })

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        message: 'Scraping job created successfully'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating scraping job:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}