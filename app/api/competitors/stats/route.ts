import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { db} from '@/db'
import { competitors, competitorAlerts, competitorActivities} from '@/db/schema'
import { eq, count, desc, gte, sql} from 'drizzle-orm'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('competitors:stats', ip, 60_000, 10)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Get total competitors count
    const [totalCompetitors] = await db
      .select({ count: count() })
      .from(competitors)
      .where(eq(competitors.user_id, userId))

    // Get competitors by threat level
    const threatLevelStats = await db
      .select({
        threat_level: competitors.threat_level,
        count: count()
      })
      .from(competitors)
      .where(eq(competitors.user_id, userId))
      .groupBy(competitors.threat_level)

    // Get recent alerts count (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [recentAlerts] = await db
      .select({ count: count() })
      .from(competitorAlerts)
      .where(
        sql`${competitorAlerts.competitor_id} IN (
          SELECT id FROM ${competitors} WHERE user_id = ${userId}
        ) AND ${competitorAlerts.created_at} >= ${thirtyDaysAgo.toISOString()}`
      )

    // Get recent activities count (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [recentActivities] = await db
      .select({ count: count() })
      .from(competitorActivities)
      .where(
        sql`${competitorActivities.competitor_id} IN (
          SELECT id FROM ${competitors} WHERE user_id = ${userId}
        ) AND ${competitorActivities.created_at} >= ${sevenDaysAgo.toISOString()}`
      )

    // Get active monitoring count
    const [activeMonitoring] = await db
      .select({ count: count() })
      .from(competitors)
      .where(
        sql`${competitors.user_id} = ${userId} AND ${competitors.monitoring_status} = 'active'`
      )

    // Calculate threat distribution
    const threatDistribution = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    }

    threatLevelStats.forEach(stat => {
      if (stat.threat_level in threatDistribution) {
        threatDistribution[stat.threat_level as keyof typeof threatDistribution] = stat.count
      }
    })

    // Calculate average employee count
    const [avgEmployeeCount] = await db
      .select({
        avg: sql<number>`AVG(${competitors.employee_count})`
      })
      .from(competitors)
      .where(eq(competitors.user_id, userId))

    // Calculate total funding tracked
    const [totalFunding] = await db
      .select({
        sum: sql<number>`SUM(${competitors.funding_amount})`
      })
      .from(competitors)
      .where(eq(competitors.user_id, userId))

    const stats = {
      totalCompetitors: totalCompetitors.count,
      activeMonitoring: activeMonitoring.count,
      recentAlerts: recentAlerts.count,
      recentActivities: recentActivities.count,
      threatDistribution,
      averageEmployeeCount: Math.round(avgEmployeeCount.avg || 0),
      totalFundingTracked: totalFunding.sum || 0,
      monitoringCoverage: totalCompetitors.count > 0 ? 
        Math.round((activeMonitoring.count / totalCompetitors.count) * 100) : 0,
      alertFrequency: recentAlerts.count > 0 ? 
        Math.round(recentAlerts.count / 30 * 7) : 0, // Alerts per week
      activityLevel: recentActivities.count > 0 ? 
        Math.round(recentActivities.count / 7) : 0, // Activities per day
      lastUpdated: new Date().toISOString()
    }

    logInfo('Competitor stats calculated successfully', { userId, stats })

    return NextResponse.json(stats)
  } catch (error) {
    logError('Error fetching competitor stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitor statistics' },
      { status: 500 }
    )
  }
}