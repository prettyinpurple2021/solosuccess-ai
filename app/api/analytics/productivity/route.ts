import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { neon } from '@neondatabase/serverless'


// Force dynamic rendering
export const dynamic = 'force-dynamic'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const range = url.searchParams.get('range') || 'week'
    
    const sql = getSql()
    
    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get task analytics
    const tasks = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'pending' AND due_date < NOW() THEN 1 END) as overdue
      FROM tasks 
      WHERE user_id = ${user.id} AND created_at >= ${startDate.toISOString()}
    `

    // Get goal analytics
    const goals = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'achieved' THEN 1 END) as achieved,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress
      FROM goals 
      WHERE user_id = ${user.id} AND created_at >= ${startDate.toISOString()}
    `

    // Get productivity insights
    const insights = await sql`
      SELECT 
        insight_type,
        metrics
      FROM productivity_insights 
      WHERE user_id = ${user.id} AND date >= ${startDate.toISOString()}
      ORDER BY date DESC
      LIMIT 10
    `

    // Calculate completion rate
    const taskData = tasks[0] || { total: 0, completed: 0, pending: 0, overdue: 0 }
    const goalData = goals[0] || { total: 0, achieved: 0, in_progress: 0 }
    
    const completionRate = taskData.total > 0 ? Math.round((taskData.completed / taskData.total) * 100) : 0
    const achievementRate = goalData.total > 0 ? Math.round((goalData.achieved / goalData.total) * 100) : 0

    // Get weekly trends (compare with previous period)
    const previousStartDate = new Date(startDate)
    previousStartDate.setDate(previousStartDate.getDate() - (range === 'week' ? 7 : range === 'month' ? 30 : 90))
    
    const previousTasks = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
      FROM tasks 
      WHERE user_id = ${user.id} 
        AND created_at >= ${previousStartDate.toISOString()} 
        AND created_at < ${startDate.toISOString()}
    `

    const previousTaskData = previousTasks[0] || { total: 0, completed: 0 }
    const weeklyTrend = previousTaskData.total > 0 
      ? Math.round(((taskData.completed / taskData.total) - (previousTaskData.completed / previousTaskData.total)) * 100)
      : 0

    // Process insights for recommendations
    const commonDistractions: string[] = []
    const recommendations: string[] = []
    
    insights.forEach((insight: any) => {
      if (insight.insight_type === 'distraction_analysis' && insight.metrics) {
        const metrics = typeof insight.metrics === 'string' ? JSON.parse(insight.metrics) : insight.metrics
        if (metrics.distractions) {
          commonDistractions.push(...metrics.distractions)
        }
      }
      if (insight.insight_type === 'recommendations' && insight.metrics) {
        const metrics = typeof insight.metrics === 'string' ? JSON.parse(insight.metrics) : insight.metrics
        if (metrics.recommendations) {
          recommendations.push(...metrics.recommendations)
        }
      }
    })

    const analyticsData = {
      tasks: {
        total: parseInt(taskData.total) || 0,
        completed: parseInt(taskData.completed) || 0,
        pending: parseInt(taskData.pending) || 0,
        overdue: parseInt(taskData.overdue) || 0,
        completionRate,
        weeklyTrend
      },
      goals: {
        total: parseInt(goalData.total) || 0,
        achieved: parseInt(goalData.achieved) || 0,
        inProgress: parseInt(goalData.in_progress) || 0,
        achievementRate,
        weeklyProgress: parseInt(goalData.achieved) || 0
      },
      focus: {
        totalSessions: 0, // TODO: Implement focus session tracking
        totalHours: 0,
        averageSessionLength: 0,
        weeklyHours: 0,
        weeklyTrend: 0
      },
      productivity: {
        overallScore: completionRate,
        weeklyScore: completionRate + weeklyTrend,
        monthlyScore: completionRate,
        improvement: weeklyTrend
      },
      insights: {
        topPerformingDay: "Monday", // TODO: Calculate from actual data
        mostProductiveTime: "9:00 AM - 11:00 AM", // TODO: Calculate from actual data
        commonDistractions: commonDistractions.slice(0, 3),
        recommendations: recommendations.slice(0, 3)
      }
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    logError('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 })
  }
}
