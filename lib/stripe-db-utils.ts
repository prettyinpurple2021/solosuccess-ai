import { neon } from '@neondatabase/serverless'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

// Get user by Stripe customer ID
export async function getUserByStripeCustomerId(customerId: string) {
  try {
    const sql = getSql()
    const users = await sql`
      SELECT id, email, full_name, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end
      FROM users 
      WHERE stripe_customer_id = ${customerId}
    `
    return users[0] || null
  } catch (error) {
    console.error('Error getting user by Stripe customer ID:', error)
    return null
  }
}

// Update user subscription
export async function updateUserSubscription(
  userId: string, 
  subscriptionData: {
    stripe_subscription_id?: string
    stripe_customer_id?: string
    subscription_tier?: string
    subscription_status?: string
    current_period_start?: Date
    current_period_end?: Date
    cancel_at_period_end?: boolean
  }
) {
  try {
    const sql = getSql()
    
    // Build dynamic update query
    const updateFields = []
    const values = []
    let paramIndex = 1

    if (subscriptionData.stripe_subscription_id !== undefined) {
      updateFields.push(`stripe_subscription_id = $${paramIndex}`)
      values.push(subscriptionData.stripe_subscription_id)
      paramIndex++
    }
    
    if (subscriptionData.stripe_customer_id !== undefined) {
      updateFields.push(`stripe_customer_id = $${paramIndex}`)
      values.push(subscriptionData.stripe_customer_id)
      paramIndex++
    }
    
    if (subscriptionData.subscription_tier !== undefined) {
      updateFields.push(`subscription_tier = $${paramIndex}`)
      values.push(subscriptionData.subscription_tier)
      paramIndex++
    }
    
    if (subscriptionData.subscription_status !== undefined) {
      updateFields.push(`subscription_status = $${paramIndex}`)
      values.push(subscriptionData.subscription_status)
      paramIndex++
    }
    
    if (subscriptionData.current_period_start !== undefined) {
      updateFields.push(`current_period_start = $${paramIndex}`)
      values.push(subscriptionData.current_period_start)
      paramIndex++
    }
    
    if (subscriptionData.current_period_end !== undefined) {
      updateFields.push(`current_period_end = $${paramIndex}`)
      values.push(subscriptionData.current_period_end)
      paramIndex++
    }
    
    if (subscriptionData.cancel_at_period_end !== undefined) {
      updateFields.push(`cancel_at_period_end = $${paramIndex}`)
      values.push(subscriptionData.cancel_at_period_end)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return { success: false, error: 'No fields to update' }
    }

    updateFields.push(`updated_at = NOW()`)
    values.push(userId)

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id
    `

    const result = await sql.unsafe(query, values)
    
    if (result.length === 0) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user: result[0] }
  } catch (error) {
    console.error('Error updating user subscription:', error)
    return { success: false, error: 'Database error' }
  }
}

// Update user Stripe customer ID
export async function updateUserStripeCustomerId(userId: string, customerId: string) {
  try {
    const sql = getSql()
    const result = await sql`
      UPDATE users 
      SET stripe_customer_id = ${customerId}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, stripe_customer_id
    `
    
    if (result.length === 0) {
      return { success: false, error: 'User not found' }
    }

    return { success: true, user: result[0] }
  } catch (error) {
    console.error('Error updating user Stripe customer ID:', error)
    return { success: false, error: 'Database error' }
  }
}

// Get subscription tier from price ID
export function getSubscriptionTierFromPriceId(priceId: string): string {
  if (priceId.includes('accelerator')) {
    return 'accelerator'
  } else if (priceId.includes('dominator')) {
    return 'dominator'
  }
  return 'launch'
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const sql = getSql()
    const users = await sql`
      SELECT subscription_status, subscription_tier
      FROM users 
      WHERE id = ${userId}
    `
    
    if (users.length === 0) return false
    
    const user = users[0]
    return user.subscription_status === 'active' && user.subscription_tier !== 'launch'
  } catch (error) {
    console.error('Error checking active subscription:', error)
    return false
  }
}

// Get user subscription details
export async function getUserSubscription(userId: string) {
  try {
    const sql = getSql()
    const users = await sql`
      SELECT subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, 
             current_period_start, current_period_end, cancel_at_period_end
      FROM users 
      WHERE id = ${userId}
    `
    
    return users[0] || null
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}
