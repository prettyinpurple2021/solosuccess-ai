import { logger, logError, logWarn, logInfo, logDebug } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { predictiveAnalytics } from '@/lib/predictive-analytics'
import { getDb } from '@/lib/database-client'
import { users, tasks, goals, chatConversations, focusSessions } from '@/db/schema'
import { eq, gte, desc, count, and } from 'drizzle-orm'
import { z } from 'zod'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


// Edge Runtime disabled due to Node.js dependency incompatibility

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schemas
const InsightRequestSchema = z.object({
  timeframe: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  categories: z.array(z.enum(['productivity', 'engagement', 'performance', 'business', 'user_behavior'])).optional(),
  includeForecast: z.boolean().default(true),
  includeAnomalies: z.boolean().default(true)
})

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 50, window: 60 })
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

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const categories = searchParams.get('categories')?.split(',') || []
    const includeForecast = searchParams.get('includeForecast') !== 'false'
    const includeAnomalies = searchParams.get('includeAnomalies') !== 'false'

    // Validate parameters
    const validatedParams = InsightRequestSchema.parse({
      timeframe,
      categories,
      includeForecast,
      includeAnomalies
    })

    const db = getDb()
    const userId = user.id

    // Calculate timeframe date
    const now = new Date()
    const timeframeDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    }[validatedParams.timeframe]
    
    const startDate = new Date(now.getTime() - timeframeDays * 24 * 60 * 60 * 1000)

    // Gather user data for analysis
    const userData = await gatherUserData(db, userId, startDate, now)
    
    // Gather business data (for admin users or aggregated data)
    const businessData = await gatherBusinessData(db, startDate, now)

    // Generate predictive insights
    const insights = await predictiveAnalytics.generateInsights(userData, businessData)

    // Filter insights by category if specified
    const filteredInsights = validatedParams.categories.length > 0
      ? insights.filter(insight => validatedParams.categories.includes(insight.category))
      : insights

    // Sort by priority and confidence
    const sortedInsights = filteredInsights.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority
      return b.confidence - a.confidence
    })

    const response: any = {
      success: true,
      data: {
        insights: sortedInsights,
        summary: {
          total: sortedInsights.length,
          byCategory: groupInsightsByCategory(sortedInsights),
          byImpact: groupInsightsByImpact(sortedInsights),
          actionable: sortedInsights.filter(i => i.actionable).length,
          highPriority: sortedInsights.filter(i => i.priority >= 7).length
        }
      }
    }

    // Add forecast if requested
    if (validatedParams.includeForecast) {
      try {
        response.data.forecast = await predictiveAnalytics.generateBusinessForecast(validatedParams.timeframe)
      } catch (error) {
        logWarn('Failed to generate forecast:', error)
      }
    }

    // Add anomalies if requested
    if (validatedParams.includeAnomalies) {
      try {
        const anomalyData = [
          { name: 'task_completion_rate', currentValue: userData.taskCompletionRate, historicalData: userData.taskCompletionHistory },
          { name: 'session_duration', currentValue: userData.avgSessionDuration, historicalData: userData.sessionDurationHistory },
          { name: 'ai_interactions', currentValue: userData.aiInteractions, historicalData: userData.aiInteractionHistory }
        ]
        
        response.data.anomalies = await predictiveAnalytics.detectAnomalies(anomalyData)
      } catch (error) {
        logWarn('Failed to detect anomalies:', error)
      }
    }

    logInfo(`Generated ${sortedInsights.length} predictive insights for user ${userId}`)
    return NextResponse.json(response)

  } catch (error) {
    logError('Error generating predictive insights:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Gather comprehensive user data for analysis
 */
async function gatherUserData(db: any, userId: string, startDate: Date, endDate: Date) {
  try {
    // Get user tasks
    const userTasks = await db.select()
      .from(tasks)
      .where(and(eq(tasks.user_id, userId), gte(tasks.created_at, startDate)))
      .orderBy(desc(tasks.created_at))

    // Get user goals
    const userGoals = await db.select()
      .from(goals)
      .where(and(eq(goals.user_id, userId), gte(goals.created_at, startDate)))
      .orderBy(desc(goals.created_at))

    // Get user conversations
    const userConversations = await db.select()
      .from(chatConversations)
      .where(and(eq(chatConversations.user_id, userId), gte(chatConversations.created_at, startDate)))
      .orderBy(desc(chatConversations.created_at))

    // Get focus sessions
    const userFocusSessions = await db.select()
      .from(focusSessions)
      .where(and(eq(focusSessions.user_id, userId), gte(focusSessions.created_at, startDate)))
      .orderBy(desc(focusSessions.created_at))

    // Calculate metrics
    const completedTasks = userTasks.filter(task => task.status === 'completed').length
    const completedGoals = userGoals.filter(goal => goal.status === 'completed').length
    const totalFocusTime = userFocusSessions.reduce((sum, session) => sum + (session.duration || 0), 0)
    const avgSessionDuration = userFocusSessions.length > 0 
      ? totalFocusTime / userFocusSessions.length 
      : 0

    // Calculate historical trends (simplified - would need more sophisticated time series analysis)
    const taskCompletionHistory = calculateHistoricalTrend(userTasks, 'status', 'completed')
    const sessionDurationHistory = calculateHistoricalTrend(userFocusSessions, 'duration')
    const aiInteractionHistory = calculateHistoricalTrend(userConversations, 'message_count')

    return {
      userId,
      tasksCompleted: completedTasks,
      goalsAchieved: completedGoals,
      focusSessions: userFocusSessions.length,
      aiInteractions: userConversations.length,
      avgSessionDuration,
      totalFocusTime,
      taskCompletionRate: userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0,
      goalAchievementRate: userGoals.length > 0 ? (completedGoals / userGoals.length) * 100 : 0,
      recentActivity: userTasks.slice(0, 10), // Last 10 activities
      taskCompletionHistory,
      sessionDurationHistory,
      aiInteractionHistory,
      loginFrequency: 5, // This would come from auth logs
      featureUsage: {
        'ai_chat': userConversations.length,
        'task_management': userTasks.length,
        'goal_tracking': userGoals.length,
        'focus_mode': userFocusSessions.length
      },
      sessionPatterns: {
        peakHours: [9, 10, 11, 14, 15, 16], // This would be calculated from actual data
        averageSessionLength: avgSessionDuration,
        sessionFrequency: userFocusSessions.length / 30 // per day
      },
      interactionDepth: userConversations.reduce((sum, conv) => sum + (conv.message_count || 0), 0),
      engagementScore: calculateEngagementScore(userTasks, userGoals, userConversations, userFocusSessions),
      lastLogin: new Date().toISOString(), // This would come from auth logs
      sessionFrequency: 5, // This would come from actual session data
      supportTickets: 0, // This would come from support system
      experienceLevel: 'intermediate', // This would be calculated from usage patterns
      primaryUseCase: 'business_management', // This would be inferred from behavior
      subscriptionTier: 'pro' // This would come from user data
    }

  } catch (error) {
    logError('Error gathering user data:', error)
    throw error
  }
}

/**
 * Gather business-level data for analysis
 */
async function gatherBusinessData(db: any, startDate: Date, endDate: Date) {
  try {
    // Get total user counts
    const totalUsers = await db.select({ count: count() }).from(users)
    
    // Get recent signups
    const newUsers30d = await db.select({ count: count() })
      .from(users)
      .where(gte(users.created_at, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))

    // Get task completion rates
    const allTasks = await db.select().from(tasks).where(gte(tasks.created_at, startDate))
    const completedTasks = allTasks.filter(task => task.status === 'completed').length

    // Get goal completion rates
    const allGoals = await db.select().from(goals).where(gte(goals.created_at, startDate))
    const completedGoals = allGoals.filter(goal => goal.status === 'completed').length

    // Get conversation data
    const allConversations = await db.select().from(chatConversations).where(gte(chatConversations.created_at, startDate))

    return {
      activeUsers: totalUsers[0]?.count || 0,
      newUsers30d: newUsers30d[0]?.count || 0,
      revenue30d: 0, // This would come from billing system
      churnRate: 5, // This would be calculated from user activity
      conversionRate: 15, // This would come from conversion tracking
      taskCompletionRate: allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0,
      goalCompletionRate: allGoals.length > 0 ? (completedGoals / allGoals.length) * 100 : 0,
      aiInteractions: allConversations.length,
      historicalTrends: [
        { date: '2024-01', users: 100, revenue: 1000 },
        { date: '2024-02', users: 110, revenue: 1100 },
        { date: '2024-03', users: 120, revenue: 1200 }
      ] // This would come from historical data
    }

  } catch (error) {
    logError('Error gathering business data:', error)
    throw error
  }
}

/**
 * Calculate historical trend for a metric
 */
function calculateHistoricalTrend(data: any[], field: string, value?: any): number[] {
  // Simplified trend calculation - in production, this would be more sophisticated
  const days = 7
  const trend = []
  
  for (let i = 0; i < days; i++) {
    const dayStart = new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
    const dayEnd = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    
    const dayData = data.filter(item => {
      const itemDate = new Date(item.created_at)
      return itemDate >= dayStart && itemDate < dayEnd
    })
    
    if (value) {
      trend.push(dayData.filter(item => item[field] === value).length)
    } else {
      trend.push(dayData.reduce((sum, item) => sum + (item[field] || 0), 0))
    }
  }
  
  return trend.reverse()
}

/**
 * Calculate engagement score
 */
function calculateEngagementScore(tasks: any[], goals: any[], conversations: any[], focusSessions: any[]): number {
  const taskScore = Math.min(tasks.length * 2, 30)
  const goalScore = Math.min(goals.length * 5, 25)
  const conversationScore = Math.min(conversations.length * 3, 25)
  const focusScore = Math.min(focusSessions.length * 2, 20)
  
  return Math.min(taskScore + goalScore + conversationScore + focusScore, 100)
}

/**
 * Group insights by category
 */
function groupInsightsByCategory(insights: any[]): Record<string, number> {
  return insights.reduce((acc, insight) => {
    acc[insight.category] = (acc[insight.category] || 0) + 1
    return acc
  }, {})
}

/**
 * Group insights by impact
 */
function groupInsightsByImpact(insights: any[]): Record<string, number> {
  return insights.reduce((acc, insight) => {
    acc[insight.impact] = (acc[insight.impact] || 0) + 1
    return acc
  }, {})
}
