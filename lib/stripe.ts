import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Stripe Product IDs - These will be created in your Stripe dashboard
export const STRIPE_PRODUCTS = {
  LAUNCH: 'prod_launch_free', // Free tier
  ACCELERATOR: 'prod_accelerator_monthly', // $19/month
  ACCELERATOR_YEARLY: 'prod_accelerator_yearly', // $190/year
  DOMINATOR: 'prod_dominator_monthly', // $29/month
  DOMINATOR_YEARLY: 'prod_dominator_yearly', // $290/year
} as const

// Stripe Price IDs - These will be created in your Stripe dashboard
export const STRIPE_PRICES = {
  LAUNCH: 'price_launch_free', // Free tier
  ACCELERATOR_MONTHLY: 'price_accelerator_monthly', // $19/month
  ACCELERATOR_YEARLY: 'price_accelerator_yearly', // $190/year
  DOMINATOR_MONTHLY: 'price_dominator_monthly', // $29/month
  DOMINATOR_YEARLY: 'price_dominator_yearly', // $290/year
} as const

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  LAUNCH: {
    id: 'launch',
    name: 'Launch',
    price: 0,
    period: 'month',
    description: 'Perfect for ambitious beginners ready to start their empire',
    features: [
      'Access to 2 AI agents (Nova & Echo)',
      '5 AI conversations per day',
      'Basic task automation',
      'Email support',
      'Community access',
      'Mobile app access'
    ],
    limits: {
      aiAgents: 2,
      dailyConversations: 5,
      fileStorage: '1GB',
      goals: 5,
      tasks: 20,
      competitors: 3,
      templates: 5
    },
    stripePriceId: STRIPE_PRICES.LAUNCH,
    popular: false
  },
  ACCELERATOR: {
    id: 'accelerator',
    name: 'Accelerator',
    price: 19,
    period: 'month',
    yearlyPrice: 190,
    yearlyPeriod: 'year',
    description: 'For solo founders ready to scale their empire',
    features: [
      'Access to all 8 AI agents',
      'Unlimited AI conversations',
      'Advanced automation',
      'Priority support',
      'Advanced analytics',
      'File management (10GB)',
      'Competitive intelligence',
      'Guardian AI compliance',
      'Template library access',
      'API access'
    ],
    limits: {
      aiAgents: 8,
      dailyConversations: -1, // Unlimited
      fileStorage: '10GB',
      goals: -1, // Unlimited
      tasks: -1, // Unlimited
      competitors: 10,
      templates: -1 // Unlimited
    },
    stripePriceId: STRIPE_PRICES.ACCELERATOR_MONTHLY,
    stripeYearlyPriceId: STRIPE_PRICES.ACCELERATOR_YEARLY,
    popular: true
  },
  DOMINATOR: {
    id: 'dominator',
    name: 'Dominator',
    price: 29,
    period: 'month',
    yearlyPrice: 290,
    yearlyPeriod: 'year',
    description: 'For empire builders who demand the best',
    features: [
      'Everything in Accelerator',
      'White-label options',
      'Advanced API access',
      'Custom integrations',
      'File management (100GB)',
      'Priority feature requests',
      'Dedicated support',
      'Advanced analytics',
      'Custom workflows',
      'Team collaboration tools'
    ],
    limits: {
      aiAgents: 8,
      dailyConversations: -1, // Unlimited
      fileStorage: '100GB',
      goals: -1, // Unlimited
      tasks: -1, // Unlimited
      competitors: -1, // Unlimited
      templates: -1, // Unlimited
      teamMembers: 5
    },
    stripePriceId: STRIPE_PRICES.DOMINATOR_MONTHLY,
    stripeYearlyPriceId: STRIPE_PRICES.DOMINATOR_YEARLY,
    popular: false
  }
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

// Helper function to get subscription tier by ID
export function getSubscriptionTier(tierId: string) {
  return Object.values(SUBSCRIPTION_TIERS).find(tier => tier.id === tierId)
}

// Helper function to check if user has access to feature
export function hasFeatureAccess(
  userTier: string,
  feature: keyof typeof SUBSCRIPTION_TIERS.LAUNCH.limits
): boolean {
  const tier = getSubscriptionTier(userTier)
  if (!tier) return false
  
  const limit = tier.limits[feature]
  return limit === -1 || limit > 0 // -1 means unlimited
}

// Helper function to get usage limit for feature
export function getFeatureLimit(
  userTier: string,
  feature: keyof typeof SUBSCRIPTION_TIERS.LAUNCH.limits
): number {
  const tier = getSubscriptionTier(userTier)
  if (!tier) return 0
  
  return tier.limits[feature]
}

// Stripe webhook event types
export const STRIPE_WEBHOOK_EVENTS = {
  CUSTOMER_SUBSCRIPTION_CREATED: 'customer.subscription.created',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  CUSTOMER_SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
} as const

// Create Stripe customer
export async function createStripeCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      platform: 'soloboss-ai',
      ...metadata
    }
  })
}

// Create Stripe checkout session
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      platform: 'soloboss-ai',
      ...metadata
    },
    subscription_data: {
      metadata: {
        platform: 'soloboss-ai',
        ...metadata
      }
    }
  })
}

// Create Stripe billing portal session
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Get Stripe subscription
export async function getStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

// Cancel Stripe subscription
export async function cancelStripeSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId)
  } else {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })
  }
}

// Update Stripe subscription
export async function updateStripeSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations'
  })
}

// Get Stripe customer
export async function getStripeCustomer(
  customerId: string
): Promise<Stripe.Customer> {
  return await stripe.customers.retrieve(customerId) as Stripe.Customer
}

// List Stripe subscriptions for customer
export async function listStripeSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all'
  })
  
  return subscriptions.data
}

// Get Stripe usage records for metered billing
export async function getStripeUsageRecords(
  subscriptionItemId: string,
  startDate: Date,
  endDate: Date
): Promise<Stripe.UsageRecord[]> {
  const usageRecords = await stripe.usageRecords.list({
    subscription_item: subscriptionItemId,
    starting_after: Math.floor(startDate.getTime() / 1000).toString(),
    ending_before: Math.floor(endDate.getTime() / 1000).toString()
  })
  
  return usageRecords.data
}

// Create Stripe usage record for metered billing
export async function createStripeUsageRecord(
  subscriptionItemId: string,
  quantity: number,
  timestamp?: Date
): Promise<Stripe.UsageRecord> {
  return await stripe.usageRecords.create({
    subscription_item: subscriptionItemId,
    quantity,
    timestamp: timestamp ? Math.floor(timestamp.getTime() / 1000) : undefined
  })
}
