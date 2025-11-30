import { NextRequest } from 'next/server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  withAuth,
  handleApiError 
} from '@/lib/api-response'
import { getDb } from '@/lib/database-client'
import { 
  users, 
  tasks, 
  goals, 
  briefcases, 
  chatConversations,
  userCompetitiveStats 
} from '@/db/schema'
import { eq, and, gte, sql, count, desc } from 'drizzle-orm'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schema for query parameters
const DashboardQuerySchema = z.object({
  time_range: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  include_stats: z.string().optional().transform(val => val === 'true'),
  include_goals: z.string().optional().transform(val => val === 'true')
})

interface DashboardStats {
  user: {
    id: string
    email: string
    full_name: string | null
    subscription_tier: string
    onboarding_completed: boolean
  }
  overview: {
    total_tasks: number
    completed_tasks: number
    active_goals: number
    briefcases: number
    conversations: number
  }
  productivity: {
    completion_rate: number
    tasks_this_week: number
    streak_days: number
  }
  competitive: {
    competitors_monitored: number
    intelligence_gathered: number
    alerts_processed: number
  }
}

export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url)
    const queryResult = DashboardQuerySchema.safeParse(Object.fromEntries(searchParams.entries()))
    
    if (!queryResult.success) {
      return createErrorResponse('Invalid query parameters', 400)
    }

    const { time_range, include_stats, include_goals } = queryResult.data
    const db = getDb()

    // Calculate date range
    const now = new Date()
    const daysBack = time_range === '7d' ? 7 : time_range === '30d' ? 30 : time_range === '90d' ? 90 : 365
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)

    // Get user data
    const userResults = await db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        subscription_tier: users.subscription_tier,
        onboarding_completed: users.onboarding_completed
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    if (userResults.length === 0) {
      return createErrorResponse('User not found', 404)
    }

    const userData = userResults[0]

    // Get task statistics
    const [totalTasksResult, completedTasksResult, tasksThisWeekResult] = await Promise.all([
      db.select({ count: count() }).from(tasks).where(eq(tasks.user_id, user.id)),
      db.select({ count: count() }).from(tasks).where(
        and(eq(tasks.user_id, user.id), eq(tasks.status, 'completed'))
      ),
      db.select({ count: count() }).from(tasks).where(
        and(eq(tasks.user_id, user.id), gte(tasks.created_at, startDate))
      )
    ])

    // Get goals and briefcases count
    const [goalsResult, briefcasesResult] = await Promise.all([
      db.select({ count: count() }).from(goals).where(eq(goals.user_id, user.id)),
      db.select({ count: count() }).from(briefcases).where(eq(briefcases.user_id, user.id))
    ])

    // Get conversations count
    const conversationsResult = await db
      .select({ count: count() })
      .from(chatConversations)
      .where(eq(chatConversations.user_id, user.id))

    // Get competitive stats if available
    let competitiveStats = {
      competitors_monitored: 0,
      intelligence_gathered: 0,
      alerts_processed: 0
    }

    if (include_stats) {
      const competitiveResult = await db
        .select()
        .from(userCompetitiveStats)
        .where(eq(userCompetitiveStats.user_id, user.id))
        .limit(1)

      if (competitiveResult.length > 0) {
        const stats = competitiveResult[0]
        competitiveStats = {
          competitors_monitored: stats.competitors_monitored || 0,
          intelligence_gathered: stats.intelligence_gathered || 0,
          alerts_processed: stats.alerts_processed || 0
        }
      }
    }

    // Calculate completion rate
    const totalTasks = totalTasksResult[0]?.count || 0
    const completedTasks = completedTasksResult[0]?.count || 0
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const dashboardStats: DashboardStats = {
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        subscription_tier: userData.subscription_tier || 'free',
        onboarding_completed: userData.onboarding_completed || false
      },
      overview: {
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        active_goals: goalsResult[0]?.count || 0,
        briefcases: briefcasesResult[0]?.count || 0,
        conversations: conversationsResult[0]?.count || 0
      },
      productivity: {
        completion_rate: completionRate,
        tasks_this_week: tasksThisWeekResult[0]?.count || 0,
        streak_days: 0 // This would need to be calculated from task completion history
      },
      competitive: competitiveStats
    }

    return createSuccessResponse(dashboardStats, 'Dashboard data retrieved successfully')

  } catch (error) {
    return handleApiError(error, 'Get dashboard data')
  }
})


