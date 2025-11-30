import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { learningModules, userProgress } from '@/db/schema'
import { eq, and, desc, gte } from 'drizzle-orm'
import { verifyAuth } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req)
    if (!authResult.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = authResult.user.id

    // Fetch all progress for the user
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.user_id, userId))

    // Fetch all modules to cross-reference categories and skills
    const modules = await db
      .select()
      .from(learningModules)

    const modulesMap = new Map(modules.map(m => [m.id, m]))

    // Calculate Analytics
    const completedProgress = progress.filter(p => p.status === 'completed')
    const totalModulesCompleted = completedProgress.length
    const totalTimeSpent = progress.reduce((acc, curr) => acc + (curr.time_spent || 0), 0)

    // Calculate Average Quiz Score
    let totalScore = 0
    let quizCount = 0
    progress.forEach(p => {
      const data = p.data as any
      if (data && data.quizScores) {
        Object.values(data.quizScores).forEach((score: any) => {
          if (typeof score === 'number') {
            totalScore += score
            quizCount++
          }
        })
      }
    })
    const averageQuizScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0

    // Calculate Skills Improved (Estimate based on completed modules)
    const skillsImproved = completedProgress.reduce((acc, curr) => {
      const module = modulesMap.get(curr.module_id)
      return acc + ((module?.skills_covered as string[])?.length || 0)
    }, 0)

    // Calculate Current Streak
    // This is a simplified calculation. Ideally, we'd have a daily activity log.
    // Here we check consecutive days of 'last_accessed' backwards from today.
    // Since we only have 'last_accessed' per module, this is an approximation.
    // A better way is to check if there was any activity today, yesterday, etc.
    // But with only 'last_accessed' per module, we can only check the most recent dates across all modules.
    const sortedActivityDates = progress
      .map(p => p.last_accessed ? new Date(p.last_accessed).toDateString() : null)
      .filter(Boolean)
      .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())

    // Remove duplicates
    const uniqueDates = Array.from(new Set(sortedActivityDates))

    let currentStreak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    if (uniqueDates.includes(today)) {
      currentStreak = 1
      let checkDate = new Date(Date.now() - 86400000)
      while (uniqueDates.includes(checkDate.toDateString())) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    } else if (uniqueDates.includes(yesterday)) {
      currentStreak = 1 // Streak is kept if active yesterday
      let checkDate = new Date(Date.now() - 86400000 * 2)
      while (uniqueDates.includes(checkDate.toDateString())) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }

    // Calculate Learning Velocity (Modules completed in last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const learningVelocity = completedProgress.filter(p =>
      p.completed_at && new Date(p.completed_at) >= oneWeekAgo
    ).length

    // Calculate Top Categories
    const categoryStats = new Map<string, { time: number, count: number }>()
    progress.forEach(p => {
      const module = modulesMap.get(p.module_id)
      if (module && module.category) {
        const current = categoryStats.get(module.category) || { time: 0, count: 0 }
        categoryStats.set(module.category, {
          time: current.time + (p.time_spent || 0),
          count: current.count + (p.status === 'completed' ? 1 : 0)
        })
      }
    })

    const topCategories = Array.from(categoryStats.entries())
      .map(([category, stats]) => ({
        category,
        time_spent: stats.time,
        modules_completed: stats.count
      }))
      .sort((a, b) => b.time_spent - a.time_spent)
      .slice(0, 5)

    // Weekly Goal Progress (Arbitrary goal of 5 modules/week for now)
    const weeklyGoal = 5
    const weeklyGoalProgress = Math.min(100, Math.round((learningVelocity / weeklyGoal) * 100))

    const analytics = {
      total_modules_completed: totalModulesCompleted,
      total_time_spent: totalTimeSpent,
      average_quiz_score: averageQuizScore,
      skills_improved: skillsImproved,
      current_streak: currentStreak,
      learning_velocity: learningVelocity,
      top_categories: topCategories,
      certifications_earned: Math.floor(totalModulesCompleted / 5), // Mock logic: 1 cert per 5 modules
      peer_rank: 12, // Placeholder as we don't have global leaderboard yet
      weekly_goal_progress: weeklyGoalProgress
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error calculating learning analytics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}