import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { notificationJobQueue } from '@/lib/notification-job-queue'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET: Get job queue statistics
export async function GET(request: NextRequest) {
  try {
    const { allowed } = await rateLimitByIp(request, { requests: 30, window: 60 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = user.email === 'prettyinpurple2021@gmail.com'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const stats = await notificationJobQueue.getStats()

    return NextResponse.json({
      stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logError('Error fetching job queue stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job queue statistics' },
      { status: 500 }
    )
  }
}