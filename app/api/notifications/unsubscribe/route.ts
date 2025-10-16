import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/api-utils'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'



// Edge Runtime disabled due to Node.js dependency incompatibility

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const unsubscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string().url(),
    expirationTime: z.number().nullable().optional(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string()
    }).optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const { allowed } = await rateLimitByIp(request, { requests: 10, window: 60 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = unsubscribeSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid subscription data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { subscription } = parsed.data
    const now = new Date()

    // Mark subscription as inactive instead of deleting it (for audit purposes)
    const result = await getSql().query(`
      UPDATE push_subscriptions 
      SET 
        is_active = false,
        updated_at = $1
      WHERE endpoint = $2 AND user_id = $3 AND is_active = true
      RETURNING id, created_at
    `, [now, subscription.endpoint, user.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Subscription not found or already inactive' },
        { status: 404 }
      )
    }

    // Log the unsubscription
    logInfo(`User ${user.id} unsubscribed from push notifications`)

    // Check if user has any remaining active subscriptions
    const remainingSubscriptions = await query(`
      SELECT COUNT(*) as count 
      FROM push_subscriptions 
      WHERE user_id = $1 AND is_active = true
    `, [user.id])

    const hasRemainingSubscriptions = parseInt(remainingSubscriptions.rows[0].count) > 0

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from push notifications',
      subscriptionId: result.rows[0].id,
      hasRemainingSubscriptions,
      timestamp: now
    })

  } catch (error) {
    logError('Error unsubscribing from push notifications:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from push notifications' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { allowed } = await rateLimitByIp(request, { requests: 5, window: 60 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all subscriptions for the user (complete cleanup)
    const result = await getSql().query(`
      DELETE FROM push_subscriptions 
      WHERE user_id = $1
      RETURNING COUNT(*) as deleted_count
    `, [user.id])

    const deletedCount = result.rows[0]?.deleted_count || 0

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} push notification subscription(s)`,
      deletedCount,
      timestamp: new Date()
    })

  } catch (error) {
    logError('Error deleting push notification subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to delete push notification subscriptions' },
      { status: 500 }
    )
  }
}