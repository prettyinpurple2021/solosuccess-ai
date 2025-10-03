// @ts-nocheck
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { useState, useEffect, useCallback } from 'react'


export interface DashboardData {
  user: {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    subscription_tier: string
    level: number
    total_points: number
    current_streak: number
    wellness_score: number
    focus_minutes: number
    onboarding_completed: boolean
  }
  todaysStats: {
    tasks_completed: number
    total_tasks: number
    focus_minutes: number
    ai_interactions: number
    goals_achieved: number
    productivity_score: number
  }
  todaysTasks: Array<{
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    due_date: string | null
    goal: {
      id: string
      title: string
      category: string | null
    } | null
  }>
  activeGoals: Array<{
    id: string
    title: string
    description: string | null
    progress_percentage: number
    target_date: string | null
    category: string | null
    tasks_total: number
    tasks_completed: number
  }>
  recentConversations: Array<{
    id: string
    title: string | null
    last_message_at: string
    agent: {
      name: string
      display_name: string
      accent_color: string
    }
  }>
  recentAchievements: Array<{
    id: string
    earned_at: string
    achievement: {
      name: string
      title: string
      description: string
      icon: string
      points: number
    }
  }>
  recentBriefcases: Array<{
    id: number
    title: string
    description: string
    status: string
    goal_count: number
    task_count: number
    created_at: string
    updated_at: string
  }>
  weeklyFocus: {
    total_minutes: number
    sessions_count: number
    average_session: number
  }
  insights: Array<{
    type: string
    title: string
    description: string
    action: string
  }>
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to get JWT token from localStorage first (for custom auth)
      const token = localStorage.getItem('authToken')
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      
      // Only add Authorization header if we have a JWT token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers,
        credentials: 'include', // Include cookies for Better Auth
        // Add cache busting to ensure fresh data
        cache: 'no-cache',
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken')
          setError('Authentication expired. Please sign in again.')
          // Only redirect if we're not already on the signin page
          if (window.location.pathname !== '/signin') {
            window.location.href = '/signin'
          }
          return
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`)
      }
      
      const dashboardData = await response.json()
      setData(dashboardData)
      setLastUpdated(new Date())
    } catch (err) {
      logError('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchDashboardData])

  // Manual refetch function
  const refetch = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Optimistic updates for immediate UI feedback
  const updateTaskStatus = useCallback((taskId: string, newStatus: string) => {
    if (!data) return

    setData(prevData => {
      if (!prevData) return prevData

      return {
        ...prevData,
        todaysTasks: prevData.todaysTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
        todaysStats: {
          ...prevData.todaysStats,
          tasks_completed: newStatus === 'completed' 
            ? prevData.todaysStats.tasks_completed + 1
            : prevData.todaysStats.tasks_completed - 1
        }
      }
    })
  }, [data])

  const updateGoalProgress = useCallback((goalId: string, newProgress: number) => {
    if (!data) return

    setData(prevData => {
      if (!prevData) return prevData

      return {
        ...prevData,
        activeGoals: prevData.activeGoals.map(goal => 
          goal.id === goalId ? { ...goal, progress_percentage: newProgress } : goal
        )
      }
    })
  }, [data])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch,
    updateTaskStatus,
    updateGoalProgress,
  }
} 