import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { 
  stripe, 
  createCheckoutSession, 
  SUBSCRIPTION_TIERS,
  STRIPE_PRICES 
} from '@/lib/stripe'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schema
const CheckoutSessionSchema = z.object({
  tier: z.enum(['accelerator', 'dominator']),
  billing: z.enum(['monthly', 'yearly']).default('monthly')
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 10, window: 60 })
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

    // Parse request body
    const body = await request.json()
    const { tier, billing } = CheckoutSessionSchema.parse(body)

    // Get subscription tier details
    const subscriptionTier = SUBSCRIPTION_TIERS[tier.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS]
    if (!subscriptionTier) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      )
    }

    // Get the appropriate price ID
    let priceId: string
    if (billing === 'yearly') {
      priceId = subscriptionTier.stripeYearlyPriceId || subscriptionTier.stripePriceId
    } else {
      priceId = subscriptionTier.stripePriceId
    }

    // Create or get Stripe customer
    let customerId: string
    if (user.stripe_customer_id) {
      customerId = user.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: {
          user_id: user.id,
          platform: 'soloboss-ai'
        }
      })
      customerId = customer.id
      
      // Update user with Stripe customer ID
      // This would typically be done in a database update
      // await updateUserStripeCustomerId(user.id, customerId)
    }

    // Create checkout session
    const session = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      {
        user_id: user.id,
        tier: tier,
        billing: billing
      }
    )

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
