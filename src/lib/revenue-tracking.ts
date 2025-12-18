import { db } from '@/db'
import { paymentProviderConnections } from '@/db/schema'
import { eq, and, gte, lte, sql } from 'drizzle-orm'
import { logError, logInfo, logWarn } from '@/lib/logger'
import Stripe from 'stripe'

export interface RevenueMetrics {
  mrr: number // Monthly Recurring Revenue
  totalRevenue: number // Total revenue for period
  revenueGrowth: number // Percentage growth
  revenueByPeriod: Array<{
    period: string
    revenue: number
    transactions: number
  }>
  subscriptions: {
    active: number
    canceled: number
    new: number
  }
  lastUpdated: Date
}

export class RevenueTrackingService {
  /**
   * Calculate MRR from user's own Stripe account
   */
  static async calculateMRR(userId: number): Promise<number> {
    try {
      const connection = await this.getStripeConnection(userId)
      if (!connection || !connection.access_token) {
        logWarn('No Stripe connection found for user', { userId })
        return 0
      }

      const stripe = new Stripe(connection.access_token, {
        apiVersion: '2024-12-18.acacia'
      })

      // Get all active subscriptions from user's Stripe account
      const subscriptions = await stripe.subscriptions.list({
        status: 'active',
        limit: 100
      })

      let mrr = 0

      for (const subscription of subscriptions.data) {
        // Get the subscription item to find the price
        if (subscription.items.data.length > 0) {
          const price = subscription.items.data[0].price
          if (price) {
            // Convert to monthly
            if (price.recurring?.interval === 'month') {
              mrr += price.unit_amount ? price.unit_amount / 100 : 0
            } else if (price.recurring?.interval === 'year') {
              mrr += price.unit_amount ? (price.unit_amount / 100) / 12 : 0
            } else if (price.recurring?.interval === 'week') {
              mrr += price.unit_amount ? (price.unit_amount / 100) * 4.33 : 0
            } else if (price.recurring?.interval === 'day') {
              mrr += price.unit_amount ? (price.unit_amount / 100) * 30 : 0
            }
          }
        }
      }

      return Math.round(mrr * 100) / 100
    } catch (error) {
      logError('Error calculating MRR:', error)
      return 0
    }
  }

  /**
   * Calculate total revenue for a time period from user's Stripe account
   */
  static async calculateRevenue(
    userId: number,
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    try {
      const connection = await this.getStripeConnection(userId)
      if (!connection || !connection.access_token) {
        logWarn('No Stripe connection found for user', { userId })
        return 0
      }

      const stripe = new Stripe(connection.access_token, {
        apiVersion: '2024-12-18.acacia'
      })

      // Get all successful charges/payment intents in the date range
      const charges = await stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      })

      // Track payment intent IDs that have associated charges to avoid double counting
      const countedPaymentIntentIds = new Set<string>()

      let totalRevenue = 0
      for (const charge of charges.data) {
        if (charge.status === 'succeeded' && charge.paid) {
          totalRevenue += charge.amount / 100 // Convert from cents to dollars
          // Track the payment intent ID if this charge has one
          if (charge.payment_intent && typeof charge.payment_intent === 'string') {
            countedPaymentIntentIds.add(charge.payment_intent)
          }
        }
      }

      // Also check payment intents that don't have associated charges
      const paymentIntents = await stripe.paymentIntents.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      })

      for (const pi of paymentIntents.data) {
        if (pi.status === 'succeeded' && pi.amount) {
          // Only count if this payment intent wasn't already counted via a charge
          if (!countedPaymentIntentIds.has(pi.id)) {
            totalRevenue += pi.amount / 100
          }
        }
      }

      return Math.round(totalRevenue * 100) / 100
    } catch (error) {
      logError('Error calculating revenue:', error)
      return 0
    }
  }

  /**
   * Get comprehensive revenue metrics for a user
   */
  static async getRevenueMetrics(
    userId: number,
    periodDays: number = 30
  ): Promise<RevenueMetrics> {
    try {
      const connection = await this.getStripeConnection(userId)
      if (!connection || !connection.access_token) {
        return {
          mrr: 0,
          totalRevenue: 0,
          revenueGrowth: 0,
          revenueByPeriod: [],
          subscriptions: { active: 0, canceled: 0, new: 0 },
          lastUpdated: new Date()
        }
      }

      const stripe = new Stripe(connection.access_token, {
        apiVersion: '2024-12-18.acacia'
      })

      const now = new Date()
      const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)
      const previousStartDate = new Date(
        startDate.getTime() - periodDays * 24 * 60 * 60 * 1000
      )

      // Calculate current period revenue
      const currentRevenue = await this.calculateRevenue(userId, startDate, now)

      // Calculate previous period revenue for growth
      const previousRevenue = await this.calculateRevenue(
        userId,
        previousStartDate,
        startDate
      )

      const revenueGrowth =
        previousRevenue > 0
          ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
          : 0

      // Get MRR
      const mrr = await this.calculateMRR(userId)

      // Get subscriptions stats
      const activeSubs = await stripe.subscriptions.list({
        status: 'active',
        limit: 100
      })

      const canceledSubs = await stripe.subscriptions.list({
        status: 'canceled',
        limit: 100,
        created: {
          gte: Math.floor(startDate.getTime() / 1000)
        }
      })

      // Get revenue by period (daily or weekly depending on period)
      const revenueByPeriod = await this.getRevenueByPeriod(
        stripe,
        userId,
        startDate,
        now,
        periodDays <= 30 ? 'day' : 'week'
      )

      // Update last synced timestamp
      await db
        .update(paymentProviderConnections)
        .set({
          last_synced_at: new Date(),
          updated_at: new Date()
        })
        .where(eq(paymentProviderConnections.id, connection.id))

      return {
        mrr,
        totalRevenue: currentRevenue,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        revenueByPeriod,
        subscriptions: {
          active: activeSubs.data.length,
          canceled: canceledSubs.data.length,
          new: 0 // Would need to track subscription creation dates
        },
        lastUpdated: new Date()
      }
    } catch (error) {
      logError('Error getting revenue metrics:', error)
      return {
        mrr: 0,
        totalRevenue: 0,
        revenueGrowth: 0,
        revenueByPeriod: [],
        subscriptions: { active: 0, canceled: 0, new: 0 },
        lastUpdated: new Date()
      }
    }
  }

  /**
   * Get revenue breakdown by time period
   */
  private static async getRevenueByPeriod(
    stripe: Stripe,
    userId: number,
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month'
  ): Promise<Array<{ period: string; revenue: number; transactions: number }>> {
    try {
      const charges = await stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      })

      // Group by period
      const periodMap = new Map<string, { revenue: number; transactions: number }>()

      for (const charge of charges.data) {
        if (charge.status === 'succeeded' && charge.paid) {
          const date = new Date(charge.created * 1000)
          let periodKey = ''

          if (interval === 'day') {
            periodKey = date.toISOString().split('T')[0] // YYYY-MM-DD
          } else if (interval === 'week') {
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            periodKey = weekStart.toISOString().split('T')[0]
          } else {
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          }

          const existing = periodMap.get(periodKey) || { revenue: 0, transactions: 0 }
          periodMap.set(periodKey, {
            revenue: existing.revenue + charge.amount / 100,
            transactions: existing.transactions + 1
          })
        }
      }

      return Array.from(periodMap.entries())
        .map(([period, data]) => ({
          period,
          revenue: Math.round(data.revenue * 100) / 100,
          transactions: data.transactions
        }))
        .sort((a, b) => a.period.localeCompare(b.period))
    } catch (error) {
      logError('Error getting revenue by period:', error)
      return []
    }
  }

  /**
   * Get user's Stripe connection from database
   */
  private static async getStripeConnection(userId: number) {
    const connections = await db
      .select()
      .from(paymentProviderConnections)
      .where(
        and(
          eq(paymentProviderConnections.user_id, userId),
          eq(paymentProviderConnections.provider, 'stripe'),
          eq(paymentProviderConnections.is_active, true)
        )
      )
      .limit(1)

    if (connections.length === 0) {
      return null
    }

    return connections[0]
  }

  /**
   * Refresh Stripe access token if expired
   */
  static async refreshStripeToken(userId: number): Promise<boolean> {
    try {
      const connection = await this.getStripeConnection(userId)
      if (!connection || !connection.refresh_token) {
        return false
      }

      // Stripe Connect uses OAuth token refresh
      // This would typically call Stripe's token refresh endpoint
      // For now, return false to prompt reconnection
      logWarn('Stripe token refresh not implemented, user needs to reconnect', { userId })
      return false
    } catch (error) {
      logError('Error refreshing Stripe token:', error)
      return false
    }
  }
}
