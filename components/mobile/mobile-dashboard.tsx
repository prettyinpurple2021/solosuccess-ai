"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import MobileDashboardWidgets from './mobile-dashboard-widgets'
import MobileNavigation from './mobile-navigation'
import VoiceTaskCreator from './voice-task-creator'
import { TouchGestureWrapper } from './mobile-gestures'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { logInfo } from '@/lib/logger'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { 
  Mic, 
  Plus, 
  Bell, 
  Search, 
  Settings,
  Zap,
  Target,
  Users,
  BarChart3,
  Clock,
  Sparkles,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileDashboardProps {
  user?: {
    name: string
    email: string
    avatar?: string
    level?: number
    points?: number
  }
  dashboardData?: {
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
      description?: string
      status: string
      priority: string
      due_date?: string
    }>
    activeGoals: Array<{
      id: string
      title: string
      progress_percentage: number
      target_date?: string
    }>
    recentConversations: Array<{
      id: string
      title?: string
      last_message_at: string
      agent: {
        name: string
        display_name: string
        accent_color: string
      }
    }>
    insights: Array<{
      type: string
      title: string
      description: string
      action: string
    }>
  }
  className?: string
}

interface Widget {
  id: string
  type: 'stats' | 'tasks' | 'goals' | 'agents' | 'insights' | 'focus'
  title: string
  priority: number
  data: any
}

export default function MobileDashboard({ 
  user, 
  dashboardData,
  className = "" 
}: MobileDashboardProps) {
  const isMobile = useIsMobile()
  const { data: fetchedDashboard, loading: dashboardLoading, error: dashboardError } = useDashboardData()
  const [showVoiceCreator, setShowVoiceCreator] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  // Resolve dashboard data from props or real API
  const resolvedData = dashboardData || fetchedDashboard || null

  // Create widgets from data
  const widgets: Widget[] = [
    {
      id: 'stats',
      type: 'stats',
      title: 'Today\'s Progress',
      priority: 1,
      data: {
        completion_rate: resolvedData ? Math.round((resolvedData.todaysStats.tasks_completed / Math.max(1, resolvedData.todaysStats.total_tasks)) * 100) : 0,
        tasks_completed: resolvedData?.todaysStats.tasks_completed || 0,
        focus_minutes: resolvedData?.todaysStats.focus_minutes || 0,
        total_tasks: resolvedData?.todaysStats.total_tasks || 0
      }
    },
    {
      id: 'tasks',
      type: 'tasks',
      title: 'Quick Tasks',
      priority: 2,
      data: (resolvedData?.todaysTasks || []).map(task => ({
        ...task,
        completed: task.status === 'completed'
      }))
    },
    {
      id: 'goals',
      type: 'goals',
      title: 'Active Goals',
      priority: 3,
      data: (resolvedData?.activeGoals || []).map(goal => ({
        ...goal,
        progress: goal.progress_percentage,
        due_date: goal.target_date
      }))
    },
    {
      id: 'agents',
      type: 'agents',
      title: 'AI Squad',
      priority: 4,
      data: (resolvedData?.recentConversations || []).map(conv => ({
        id: conv.id,
        display_name: conv.agent.display_name,
        has_new_messages: false
      }))
    },
    {
      id: 'insights',
      type: 'insights',
      title: 'AI Insights',
      priority: 5,
      data: resolvedData?.insights || []
    },
    {
      id: 'focus',
      type: 'focus',
      title: 'Focus Session',
      priority: 6,
      data: {
        is_active: false,
        progress: 0,
        remaining_time: 25
      }
    }
  ]

  // Handle widget actions
  const handleWidgetAction = (widgetId: string, action: string, data?: any) => {
    logInfo('Widget action triggered', { widgetId, action, data })
    
    switch (action) {
      case 'add_task':
        setShowVoiceCreator(true)
        break
      case 'chat_agent':
        // Navigate to agent chat
        break
      case 'start_focus':
        // Start focus session
        break
      case 'refresh':
        // Refresh data
        setLastSync(new Date())
        break
      default:
        break
    }
  }

  const handleWidgetReorder = (newWidgets: Widget[]) => {
    logInfo('Widgets reordered', { newOrder: newWidgets.map(w => w.id) })
  }

  const handleTaskCreate = (task: any) => {
    logInfo('Task created via voice', { taskId: task.id, title: task.title })
    setShowVoiceCreator(false)
  }

  const handleSwipe = (gesture: any) => {
    logInfo('Swipe gesture detected', { direction: gesture.direction, velocity: gesture.velocity })
    
    switch (gesture.direction) {
      case 'up':
        // Show quick actions
        break
      case 'down':
        // Refresh dashboard
        setLastSync(new Date())
        break
      case 'left':
        // Previous page
        break
      case 'right':
        // Next page or complete task
        break
    }
  }

  const handleDoubleTap = () => {
    setShowVoiceCreator(true)
  }

  const handleLongPress = () => {
    // Show widget reordering mode
    logInfo('Widget reorder mode activated', { method: 'long_press' })
  }

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isMobile) {
    return null // Only render on mobile
  }

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* Mobile Navigation */}
      <MobileNavigation
        user={user || (resolvedData ? { name: resolvedData.user.full_name || 'Boss', email: resolvedData.user.email } : undefined)}
        notifications={notifications}
        onNotificationClick={() => setNotifications(0)}
      />

      {/* Main Content */}
      <TouchGestureWrapper
        onSwipe={handleSwipe}
        onDoubleTap={handleDoubleTap}
        onLongPress={handleLongPress}
        className="flex-1"
      >
        <div className="pb-20 pt-4 px-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-xs text-gray-600">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last sync: {lastSync.toLocaleTimeString()}
            </div>
          </div>

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      {dashboardLoading ? 'Loading your dashboard…' : `Welcome back, ${user?.name || resolvedData?.user.full_name || 'Boss'}! 👑`}
                    </h2>
                    <p className="text-sm opacity-90">
                      {dashboardLoading
                        ? 'Fetching stats…'
                        : `Level ${user?.level ||  (resolvedData ? resolvedData.user.level : 1)} • ${user?.points || (resolvedData ? resolvedData.user.total_points : 0)} points`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6" />
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dashboard Widgets */}
          {dashboardLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-gray-200 rounded"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <MobileDashboardWidgets
              widgets={widgets}
              onWidgetAction={handleWidgetAction}
              onWidgetReorder={handleWidgetReorder}
            />
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {resolvedData?.todaysStats.tasks_completed || 0}
                    </div>
                    <div className="text-xs text-gray-600">Tasks Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {resolvedData?.todaysStats.focus_minutes || 0}
                    </div>
                    <div className="text-xs text-gray-600">Focus Mins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {resolvedData?.todaysStats.goals_achieved || 0}
                    </div>
                    <div className="text-xs text-gray-600">Goals Hit</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </TouchGestureWrapper>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-20 right-4 z-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <Button
          onClick={() => setShowVoiceCreator(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
        >
          <Mic className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Voice Task Creator */}
      <VoiceTaskCreator
        isOpen={showVoiceCreator}
        onClose={() => setShowVoiceCreator(false)}
        onTaskCreate={handleTaskCreate}
      />

      {/* Gesture Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-2 left-2 right-2 z-20"
      >
        <Card className="bg-black/80 text-white border-0">
          <CardContent className="p-2">
            <div className="text-center text-xs">
              <span className="mr-4">👆 Double tap for voice</span>
              <span className="mr-4">👆 Long press to reorder</span>
              <span>👆 Swipe to navigate</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

