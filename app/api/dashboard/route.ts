import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// JWT authentication helper
async function authenticateJWTRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { user: null, error: 'No authorization header' }
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    return { 
      user: {
        id: decoded.userId,
        email: decoded.email,
        full_name: decoded.full_name || null,
        avatar_url: null,
        subscription_tier: 'free',
        level: 1,
        total_points: 0,
        current_streak: 0,
        wellness_score: 50,
        focus_minutes: 0,
        onboarding_completed: false
      }, 
      error: null 
    }
  } catch (error) {
    console.error('JWT authentication error:', error)
    return { user: null, error: 'Invalid token' }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request using JWT
    const { user, error } = await authenticateJWTRequest(request)
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data from database or create if doesn't exist
    const sql = getSql()
    
    // First, try to get existing user data
    let userData = await sql`
      SELECT id, email, full_name, avatar_url, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end, is_verified, created_at, updated_at
      FROM users 
      WHERE id = ${user.id}
    `

    let dbUser = userData[0]

    // If user doesn't exist in database, create them
    if (!dbUser) {
      const newUser = await sql`
        INSERT INTO users (id, email, full_name, avatar_url, subscription_tier, subscription_status, cancel_at_period_end, is_verified, created_at, updated_at)
        VALUES (${user.id}, ${user.email}, ${user.full_name}, ${user.avatar_url}, 'launch', 'active', false, false, NOW(), NOW())
        RETURNING id, email, full_name, avatar_url, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end, is_verified, created_at, updated_at
      `
      dbUser = newUser[0]
    }

    // Get basic data from existing tables (simplified for now)
    let todaysStatsRes: any, todaysTasksRes: any, activeGoalsRes: any, conversationsRes: any, achievementsRes: any, weeklyFocusRes: any, briefcasesRes: any;
    
    try {
      // Try to get tasks data if table exists
      todaysStatsRes = await sql`
        SELECT 
            COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END),0) AS tasks_completed,
            COUNT(*) AS total_tasks,
            0 AS focus_minutes,
            0 AS ai_interactions,
            0 AS goals_achieved,
            0 AS productivity_score
         FROM tasks 
         WHERE user_id = ${user.id} AND DATE(updated_at) = CURRENT_DATE
      `;
      
      todaysTasksRes = await sql`
        SELECT id, title, description, status, priority, due_date
           FROM tasks
          WHERE user_id = ${user.id}
          ORDER BY COALESCE(due_date, NOW()) ASC
          LIMIT 10
      `;

      // Get briefcases (projects) data
      briefcasesRes = await sql`
        SELECT 
          b.id, b.title, b.description, b.status, b.metadata,
          b.created_at, b.updated_at,
          COUNT(DISTINCT g.id) as goal_count,
          COUNT(DISTINCT t.id) as task_count
        FROM briefcases b
        LEFT JOIN goals g ON b.id = g.briefcase_id
        LEFT JOIN tasks t ON b.id = t.briefcase_id
        WHERE b.user_id = ${user.id}
        GROUP BY b.id, b.title, b.description, b.status, b.metadata, b.created_at, b.updated_at
        ORDER BY b.updated_at DESC
        LIMIT 6
      `;
    } catch (error) {
      // If tables don't exist, use default data
      todaysStatsRes = [{ tasks_completed: 0, total_tasks: 0, focus_minutes: 0, ai_interactions: 0, goals_achieved: 0, productivity_score: 0 }];
      todaysTasksRes = [];
      briefcasesRes = [];
    }
    
    // Default empty data for other tables that might not exist
    activeGoalsRes = [];
    conversationsRes = [];
    achievementsRes = [];
    weeklyFocusRes = [{ total_minutes: 0, sessions_count: 0, average_session: 0 }];

    const todaysStatsRow = todaysStatsRes[0] || {
      tasks_completed: 0,
      total_tasks: 0,
      focus_minutes: 0,
      ai_interactions: 0,
      goals_achieved: 0,
      productivity_score: 0,
    }

    const todaysTasks = todaysTasksRes.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      priority: r.priority,
      due_date: r.due_date,
      goal: null, // Simplified for now
    }))

    const activeGoals = activeGoalsRes.map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      progress_percentage: r.progress_percentage,
      target_date: r.target_date,
      category: r.category,
      tasks_total: r.tasks_total,
      tasks_completed: r.tasks_completed,
    }))

    const recentConversations = conversationsRes.map((r: any) => ({
      id: r.id,
      title: null,
      last_message_at: r.last_message_at,
      agent: { name: r.name, display_name: r.display_name, accent_color: r.accent_color },
    }))

    const recentAchievements = achievementsRes.map((r: any) => ({
      id: r.id,
      earned_at: r.earned_at,
      achievement: { name: r.name, title: r.title, description: r.description, icon: r.icon, points: r.points },
    }))

    const weeklyFocusRow = weeklyFocusRes[0] || { total_minutes: 0, sessions_count: 0, average_session: 0 }

    // Transform briefcases data
    const recentBriefcases = briefcasesRes.map((b: any) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      status: b.status,
      goal_count: parseInt(b.goal_count),
      task_count: parseInt(b.task_count),
      created_at: b.created_at,
      updated_at: b.updated_at,
    }))

    // Generate some sample insights for new users
    const insights = todaysTasks.length === 0 && recentBriefcases.length === 0 ? [
      {
        type: 'welcome',
        title: 'Welcome to SoloSuccess AI!',
        description: 'Start by creating your first briefcase (project) to get organized.',
        action: 'Create Briefcase'
      }
    ] : []

    const responseData = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        full_name: dbUser.full_name || user.full_name || null,
        avatar_url: dbUser.avatar_url || user.avatar_url || null,
        subscription_tier: dbUser.subscription_tier || 'free',
        level: 1, // Default level for all users
        total_points: 0, // Default points
        current_streak: 0, // Default streak
        wellness_score: 50, // Default wellness score
        focus_minutes: 0, // Default focus minutes
        onboarding_completed: false, // Default onboarding status
      },
      todaysStats: todaysStatsRow,
      todaysTasks,
      activeGoals,
      recentConversations,
      recentAchievements,
      recentBriefcases,
      weeklyFocus: weeklyFocusRow,
      insights,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    )
  }
}
