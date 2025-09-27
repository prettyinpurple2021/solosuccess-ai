import { logger, logError, logInfo } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const rateLimitResult = await rateLimitByIp(request, { requests: 30, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Get template analytics for the user
    const analytics = await getUserTemplateAnalytics(authResult.user.id)

    logInfo('Template analytics fetched successfully', { userId: authResult.user.id })
    return NextResponse.json({ 
      success: true, 
      analytics 
    })
  } catch (error) {
    logError('Error fetching template analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getUserTemplateAnalytics(userId: string) {
  try {
    // Mock analytics data - in production, this would query the database
    const analytics = {
      overview: {
        totalTemplatesUsed: 15,
        totalTimeSaved: 24, // hours
        completionRate: 87,
        favoriteTemplates: 8,
        aiGeneratedTemplates: 3
      },
      usageStats: {
        templatesByCategory: [
          { category: 'Business Planning', count: 5, percentage: 33 },
          { category: 'Marketing', count: 4, percentage: 27 },
          { category: 'Sales', count: 3, percentage: 20 },
          { category: 'Content', count: 2, percentage: 13 },
          { category: 'Financial', count: 1, percentage: 7 }
        ],
        templatesByDifficulty: [
          { difficulty: 'beginner', count: 8, percentage: 53 },
          { difficulty: 'intermediate', count: 5, percentage: 33 },
          { difficulty: 'advanced', count: 2, percentage: 14 }
        ],
        monthlyUsage: [
          { month: 'Jan', count: 3 },
          { month: 'Feb', count: 5 },
          { month: 'Mar', count: 4 },
          { month: 'Apr', count: 6 },
          { month: 'May', count: 7 },
          { month: 'Jun', count: 8 }
        ]
      },
      productivity: {
        averageCompletionTime: 45, // minutes
        timeSavedPerTemplate: 1.6, // hours
        mostProductiveDay: 'Tuesday',
        mostProductiveTime: '10:00 AM - 12:00 PM',
        templatesCompletedToday: 2,
        streakDays: 5
      },
      insights: {
        topPerformingTemplates: [
          { name: 'Business Plan Builder', usage: 3, completion: 100, rating: 5 },
          { name: 'Marketing Strategy', usage: 2, completion: 85, rating: 4.5 },
          { name: 'Content Calendar', usage: 2, completion: 90, rating: 4.8 }
        ],
        recommendations: [
          'You excel at business planning templates - consider trying advanced financial modeling',
          'Your completion rate is 15% above average - great job staying focused!',
          'Try using AI-generated templates to save even more time',
          'Consider setting up template automation for recurring tasks'
        ],
        patterns: [
          'You use templates most frequently on Tuesdays and Wednesdays',
          'Your highest completion rates are for marketing and sales templates',
          'You tend to start templates in the morning and complete them in the afternoon',
          'AI-generated templates have a 95% completion rate for you'
        ]
      },
      goals: {
        currentGoals: [
          { id: 1, title: 'Complete 20 templates this month', progress: 75, target: 20, current: 15 },
          { id: 2, title: 'Try 3 new template categories', progress: 67, target: 3, current: 2 },
          { id: 3, title: 'Save 30 hours with templates', progress: 80, target: 30, current: 24 }
        ],
        achievements: [
          { id: 1, title: 'Template Master', description: 'Completed 10 templates', earned: true, date: '2024-01-15' },
          { id: 2, title: 'Time Saver', description: 'Saved 20 hours with templates', earned: true, date: '2024-01-20' },
          { id: 3, title: 'AI Explorer', description: 'Used 5 AI-generated templates', earned: false, progress: 60 }
        ]
      },
      trends: {
        weeklyTrend: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [2, 4, 3, 2, 1, 0, 1]
        },
        categoryTrend: {
          labels: ['Business', 'Marketing', 'Sales', 'Content', 'Financial'],
          data: [5, 4, 3, 2, 1]
        },
        timeTrend: {
          labels: ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM'],
          data: [1, 8, 4, 2, 0]
        }
      }
    }

    return analytics
  } catch (error) {
    logError('Error generating template analytics:', error)
    throw error
  }
}
