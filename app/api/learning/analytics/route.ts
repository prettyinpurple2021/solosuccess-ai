import { logger, logError, logInfo } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { rateLimitByIp } from '@/lib/rate-limit'
import { z } from 'zod'
import { getDb } from '@/lib/database-client'
import { users, tasks, goals, chatConversations, focusSessions } from '@/db/schema'
import { eq, and, gte, desc, count, avg } from 'drizzle-orm'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'


export const dynamic = 'force-dynamic'

const querySchema = z.object({
  type: z.enum(['overview', 'skill-gaps', 'recommendations', 'progress', 'analytics', 'achievements']).optional(),
  timeframe: z.enum(['week', 'month', 'quarter', 'year']).optional(),
  category: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateRequest()
    if (!authResult.user) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }
    const userId = authResult.user.id

    const rateLimitResult = await rateLimitByIp(request, { requests: 30, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))

    const db = getDb()
    const timeframe = query.timeframe || 'month'
    const startDate = getTimeframeStartDate(timeframe)

    let result: any

    switch (query.type) {
      case 'overview':
        result = await getLearningOverview(db, userId, startDate)
        break
      case 'skill-gaps':
        result = await getSkillGaps(db, userId)
        break
      case 'recommendations':
        result = await getLearningRecommendations(db, userId)
        break
      case 'progress':
        result = await getLearningProgress(db, userId, startDate)
        break
      case 'analytics':
        result = await getLearningAnalytics(db, userId, startDate)
        break
      case 'achievements':
        result = await getLearningAchievements(db, userId)
        break
      default:
        // Return all learning insights if no specific type is requested
        const [overview, skillGaps, recommendations, progress, analytics, achievements] = await Promise.all([
          getLearningOverview(db, userId, startDate),
          getSkillGaps(db, userId),
          getLearningRecommendations(db, userId),
          getLearningProgress(db, userId, startDate),
          getLearningAnalytics(db, userId, startDate),
          getLearningAchievements(db, userId)
        ])
        result = { overview, skillGaps, recommendations, progress, analytics, achievements }
        break
    }

    logInfo(`Learning analytics data fetched successfully for type: ${query.type || 'all'}`, { userId })
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    logError('Error in GET /api/learning/analytics:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getLearningOverview(db: any, userId: string, startDate: Date) {
  try {
    // Get user's learning progress
    const userData = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (userData.length === 0) {
      throw new Error('User not found')
    }

    const user = userData[0]

    // Mock learning data - in production, this would come from learning-specific tables
    const mockOverview = {
      total_modules_completed: Math.floor(Math.random() * 30) + 10,
      total_time_spent: Math.floor(Math.random() * 2000) + 500, // minutes
      average_quiz_score: Math.floor(Math.random() * 20) + 80, // 80-100%
      skills_improved: Math.floor(Math.random() * 20) + 5,
      current_streak: Math.floor(Math.random() * 30) + 1,
      learning_velocity: Math.floor(Math.random() * 5) + 2, // modules per week
      certifications_earned: Math.floor(Math.random() * 10) + 1,
      peer_rank: Math.floor(Math.random() * 50) + 1,
      weekly_goal_progress: Math.floor(Math.random() * 40) + 60, // 60-100%
      top_categories: [
        { 
          category: 'Business Strategy', 
          time_spent: Math.floor(Math.random() * 500) + 200, 
          modules_completed: Math.floor(Math.random() * 10) + 5 
        },
        { 
          category: 'Marketing & Sales', 
          time_spent: Math.floor(Math.random() * 400) + 150, 
          modules_completed: Math.floor(Math.random() * 8) + 3 
        },
        { 
          category: 'Financial Management', 
          time_spent: Math.floor(Math.random() * 300) + 100, 
          modules_completed: Math.floor(Math.random() * 6) + 2 
        },
        { 
          category: 'Leadership & Team Building', 
          time_spent: Math.floor(Math.random() * 250) + 80, 
          modules_completed: Math.floor(Math.random() * 5) + 1 
        }
      ]
    }

    return mockOverview
  } catch (error) {
    logError('Error getting learning overview:', error)
    throw error
  }
}

async function getSkillGaps(db: any, userId: string) {
  try {
    // Mock skill gaps data - in production, this would be calculated based on user's goals, tasks, and learning progress
    const mockSkillGaps = [
      {
        skill: {
          id: '1',
          name: 'Data Analytics',
          description: 'Ability to analyze and interpret business data',
          category: 'Technical Skills',
          level: 3,
          experience_points: 750
        },
        gap_score: Math.floor(Math.random() * 30) + 50, // 50-80%
        priority: 'high',
        recommended_modules: [
          {
            id: 'mod1',
            title: 'Introduction to Business Analytics',
            description: 'Learn the fundamentals of data analysis for business decisions',
            duration_minutes: 45,
            difficulty: 'intermediate',
            category: 'Technical Skills',
            skills_covered: ['Data Analytics'],
            prerequisites: [],
            completion_rate: 0,
            rating: 4.5
          }
        ]
      },
      {
        skill: {
          id: '2',
          name: 'Negotiation',
          description: 'Skills for effective business negotiations',
          category: 'Soft Skills',
          level: 4,
          experience_points: 920
        },
        gap_score: Math.floor(Math.random() * 20) + 30, // 30-50%
        priority: 'medium',
        recommended_modules: [
          {
            id: 'mod2',
            title: 'Advanced Negotiation Techniques',
            description: 'Master complex negotiation scenarios and strategies',
            duration_minutes: 60,
            difficulty: 'advanced',
            category: 'Soft Skills',
            skills_covered: ['Negotiation'],
            prerequisites: ['Basic Negotiation'],
            completion_rate: 0,
            rating: 4.8
          }
        ]
      },
      {
        skill: {
          id: '3',
          name: 'Digital Marketing',
          description: 'Online marketing strategies and tools',
          category: 'Marketing',
          level: 2,
          experience_points: 450
        },
        gap_score: Math.floor(Math.random() * 40) + 60, // 60-100%
        priority: 'high',
        recommended_modules: [
          {
            id: 'mod3',
            title: 'Digital Marketing Fundamentals',
            description: 'Learn the basics of online marketing and social media',
            duration_minutes: 90,
            difficulty: 'beginner',
            category: 'Marketing',
            skills_covered: ['Digital Marketing', 'Social Media'],
            prerequisites: [],
            completion_rate: 0,
            rating: 4.2
          }
        ]
      }
    ]

    return mockSkillGaps
  } catch (error) {
    logError('Error getting skill gaps:', error)
    throw error
  }
}

async function getLearningRecommendations(db: any, userId: string) {
  try {
    // Mock recommendations data - in production, this would use ML algorithms to recommend modules
    const mockRecommendations = [
      {
        module_id: 'mod1',
        priority: 'high',
        reason: 'Based on your business goals and current skill gaps',
        estimated_impact: Math.floor(Math.random() * 20) + 75, // 75-95%
        prerequisites_met: true,
        estimated_completion_time: 45
      },
      {
        module_id: 'mod2',
        priority: 'medium',
        reason: 'Will help improve your leadership capabilities',
        estimated_impact: Math.floor(Math.random() * 25) + 65, // 65-90%
        prerequisites_met: false,
        estimated_completion_time: 60
      },
      {
        module_id: 'mod3',
        priority: 'high',
        reason: 'Critical for your current marketing objectives',
        estimated_impact: Math.floor(Math.random() * 15) + 80, // 80-95%
        prerequisites_met: true,
        estimated_completion_time: 90
      }
    ]

    return mockRecommendations
  } catch (error) {
    logError('Error getting learning recommendations:', error)
    throw error
  }
}

async function getLearningProgress(db: any, userId: string, startDate: Date) {
  try {
    // Derive learning progress from actual user activity (tasks, goals, focus sessions)
    // This provides real production data based on user engagement
    
    // Get completed tasks as learning modules
    const completedTasks = await db.select({
      id: tasks.id,
      title: tasks.title,
      category: tasks.category,
      completed_at: tasks.completed_at,
      estimated_minutes: tasks.estimated_minutes,
      actual_minutes: tasks.actual_minutes,
    })
      .from(tasks)
      .where(
        and(
          eq(tasks.user_id, userId),
          eq(tasks.status, 'completed'),
          gte(tasks.completed_at, startDate)
        )
      )
      .orderBy(desc(tasks.completed_at))
      .limit(10)

    // Get focus sessions as learning time
    const userFocusSessions = await db.select({
      id: focusSessions.id,
      duration_minutes: focusSessions.duration_minutes,
      started_at: focusSessions.started_at,
      completed_at: focusSessions.completed_at,
    })
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.user_id, userId),
          gte(focusSessions.started_at, startDate)
        )
      )
      .orderBy(desc(focusSessions.started_at))

    // Calculate total time spent from focus sessions
    const totalTimeSpent = userFocusSessions.reduce((sum, session) => {
      return sum + (session.duration_minutes || 0)
    }, 0)

    // Group tasks by category to create "learning modules"
    const modulesByCategory = new Map<string, any>()
    
    completedTasks.forEach((task, index) => {
      const category = task.category || 'general'
      if (!modulesByCategory.has(category)) {
        modulesByCategory.set(category, {
          module_id: `mod_${category}`,
          category,
          tasks: [],
          total_tasks: 0,
          completed_tasks: 0,
        })
      }
      const module = modulesByCategory.get(category)!
      module.tasks.push(task)
      module.total_tasks++
      module.completed_tasks++
    })

    // Transform into learning progress format
    const progress = Array.from(modulesByCategory.values()).map((module, index) => {
      const moduleTasks = module.tasks
      const avgTimePerTask = moduleTasks.length > 0
        ? moduleTasks.reduce((sum: number, t: any) => sum + (t.actual_minutes || t.estimated_minutes || 0), 0) / moduleTasks.length
        : 0
      
      const lastTask = moduleTasks[0] // Most recent
      const firstTask = moduleTasks[moduleTasks.length - 1] // Oldest
      
      return {
        module_id: module.module_id,
        category: module.category,
        completion_percentage: 100, // All tasks in this module are completed
        time_spent: Math.round(avgTimePerTask * moduleTasks.length),
        tasks_completed: module.completed_tasks,
        total_tasks: module.total_tasks,
        last_accessed: lastTask?.completed_at?.toISOString() || new Date().toISOString(),
        started_at: firstTask?.completed_at?.toISOString() || startDate.toISOString(),
      }
    })

    // If no tasks, return progress based on focus sessions
    if (progress.length === 0 && userFocusSessions.length > 0) {
      const lastSession = userFocusSessions[0]
      return [{
        module_id: 'focus_sessions',
        category: 'focus',
        completion_percentage: 100,
        time_spent: totalTimeSpent,
        tasks_completed: userFocusSessions.length,
        total_tasks: userFocusSessions.length,
        last_accessed: lastSession.started_at?.toISOString() || new Date().toISOString(),
        started_at: userFocusSessions[userFocusSessions.length - 1]?.started_at?.toISOString() || startDate.toISOString(),
      }]
    }

    return progress
  } catch (error) {
    logError('Error getting learning progress:', error)
    throw error
  }
}

async function getLearningAnalytics(db: any, userId: string, startDate: Date) {
  try {
    // Get user's task completion and focus session data for learning analytics
    const userTasks = await db.select()
      .from(tasks)
      .where(and(eq(tasks.user_id, userId), gte(tasks.created_at, startDate)))

    const userFocusSessions = await db.select()
      .from(focusSessions)
      .where(and(eq(focusSessions.user_id, userId), gte(focusSessions.created_at, startDate)))

    // Mock analytics data - in production, this would be calculated from actual learning data
    const mockAnalytics = {
      total_modules_completed: Math.floor(Math.random() * 30) + 10,
      total_time_spent: Math.floor(Math.random() * 2000) + 500,
      average_quiz_score: Math.floor(Math.random() * 20) + 80,
      skills_improved: Math.floor(Math.random() * 20) + 5,
      current_streak: Math.floor(Math.random() * 30) + 1,
      learning_velocity: Math.floor(Math.random() * 5) + 2,
      certifications_earned: Math.floor(Math.random() * 10) + 1,
      peer_rank: Math.floor(Math.random() * 50) + 1,
      weekly_goal_progress: Math.floor(Math.random() * 40) + 60,
      top_categories: [
        { 
          category: 'Business Strategy', 
          time_spent: Math.floor(Math.random() * 500) + 200, 
          modules_completed: Math.floor(Math.random() * 10) + 5 
        },
        { 
          category: 'Marketing & Sales', 
          time_spent: Math.floor(Math.random() * 400) + 150, 
          modules_completed: Math.floor(Math.random() * 8) + 3 
        },
        { 
          category: 'Financial Management', 
          time_spent: Math.floor(Math.random() * 300) + 100, 
          modules_completed: Math.floor(Math.random() * 6) + 2 
        }
      ]
    }

    return mockAnalytics
  } catch (error) {
    logError('Error getting learning analytics:', error)
    throw error
  }
}

async function getLearningAchievements(db: any, userId: string) {
  try {
    // Mock achievements data - in production, this would come from achievements table
    const mockAchievements = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first learning module',
        icon: 'Star',
        unlocked: true,
        progress: 100,
        color: 'text-yellow-400'
      },
      {
        id: '2',
        title: 'Streak Master',
        description: 'Maintain a 10-day learning streak',
        icon: 'Flame',
        unlocked: Math.random() > 0.3, // 70% chance of being unlocked
        progress: Math.floor(Math.random() * 100),
        color: 'text-orange-400'
      },
      {
        id: '3',
        title: 'Knowledge Seeker',
        description: 'Complete 20 learning modules',
        icon: 'BookOpen',
        unlocked: Math.random() > 0.5, // 50% chance of being unlocked
        progress: Math.floor(Math.random() * 100),
        color: 'text-blue-400'
      },
      {
        id: '4',
        title: 'Certification Collector',
        description: 'Earn 5 certifications',
        icon: 'Award',
        unlocked: Math.random() > 0.7, // 30% chance of being unlocked
        progress: Math.floor(Math.random() * 100),
        color: 'text-purple-400'
      },
      {
        id: '5',
        title: 'Top Performer',
        description: 'Achieve top 10% ranking',
        icon: 'Trophy',
        unlocked: Math.random() > 0.8, // 20% chance of being unlocked
        progress: Math.floor(Math.random() * 100),
        color: 'text-green-400'
      },
      {
        id: '6',
        title: 'Quiz Champion',
        description: 'Achieve 95% average quiz score',
        icon: 'Brain',
        unlocked: Math.random() > 0.6, // 40% chance of being unlocked
        progress: Math.floor(Math.random() * 100),
        color: 'text-cyan-400'
      }
    ]

    return mockAchievements
  } catch (error) {
    logError('Error getting learning achievements:', error)
    throw error
  }
}

function getTimeframeStartDate(timeframe: string): Date {
  const now = new Date()
  switch (timeframe) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'quarter':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}
