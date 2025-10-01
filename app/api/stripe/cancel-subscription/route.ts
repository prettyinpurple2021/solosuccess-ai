import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { stripe} from '@/lib/stripe'
import { getUserSubscription, updateUserSubscription} from '@/lib/stripe-db-utils'



// Removed Edge Runtime due to Node.js dependencies (JWT, auth, fs, crypto, etc.)
// Edge Runtime disabled due to Node.js dependency incompatibility

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 5, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
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

    // Get user's subscription
    const subscription = await getUserSubscription(user.id)
    if (!subscription || !subscription.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Cancel subscription in Stripe (at period end)
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }
    
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    )

    // Update user subscription in database
    const result = await updateUserSubscription(user.id, {
      cancel_at_period_end: true
    })

    if (!result.success) {
      logError('Failed to update user subscription:', result.error)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the current period',
      cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      current_period_end: new Date((stripeSubscription as any).current_period_end * 1000)
    })

  } catch (error) {
    logError('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
