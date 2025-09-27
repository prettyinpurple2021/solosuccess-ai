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
  const [showVoiceCreator, setShowVoiceCreator] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  // Mock data if not provided
  const mockData = dashboardData || {
    todaysStats: {
      tasks_completed: 8,
      total_tasks: 12,
      focus_minutes: 120,
      ai_interactions: 15,
      goals_achieved: 2,
      productivity_score: 85
    },
    todaysTasks: [
      { id: '1', title: 'Review quarterly goals', status: 'completed', priority: 'high' },
      { id: '2', title: 'Update project timeline', status: 'in_progress', priority: 'medium' },
      { id: '3', title: 'Call with client', status: 'todo', priority: 'high' },
      { id: '4', title: 'Prepare presentation', status: 'todo', priority: 'medium' }
    ],
    activeGoals: [
      { id: '1', title: 'Launch new product', progress_percentage: 75, target_date: '2024-03-15' },
      { id: '2', title: 'Increase revenue by 50%', progress_percentage: 60, target_date: '2024-06-30' }
    ],
    recentConversations: [
      { 
        id: '1', 
        title: 'Business Strategy Discussion', 
        last_message_at: '2024-01-15T10:30:00Z',
        agent: { name: 'roxy', display_name: 'Roxy', accent_color: '#FF6B9D' }
      },
      { 
        id: '2', 
        title: 'Marketing Ideas', 
        last_message_at: '2024-01-15T09:15:00Z',
        agent: { name: 'blaze', display_name: 'Blaze', accent_color: '#4ECDC4' }
      }
    ],
    insights: [
      {
        type: 'productivity',
        title: 'Great focus session!',
        description: 'You completed 3 tasks in your last focus session',
        action: 'Start another session'
      },
      {
        type: 'ai',
        title: 'AI Insight',
        description: 'Your productivity is 20% higher in the morning',
        action: 'Schedule morning tasks'
      }
    ]
  }

  // Create widgets from data
  const widgets: Widget[] = [
    {
      id: 'stats',
      type: 'stats',
      title: 'Today\'s Progress',
      priority: 1,
      data: {
        completion_rate: Math.round((mockData.todaysStats.tasks_completed / mockData.todaysStats.total_tasks) * 100),
        tasks_completed: mockData.todaysStats.tasks_completed,
        focus_minutes: mockData.todaysStats.focus_minutes,
        total_tasks: mockData.todaysStats.total_tasks
      }
    },
    {
      id: 'tasks',
      type: 'tasks',
      title: 'Quick Tasks',
      priority: 2,
      data: mockData.todaysTasks.map(task => ({
        ...task,
        completed: task.status === 'completed'
      }))
    },
    {
      id: 'goals',
      type: 'goals',
      title: 'Active Goals',
      priority: 3,
      data: mockData.activeGoals.map(goal => ({
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
      data: mockData.recentConversations.map(conv => ({
        id: conv.id,
        display_name: conv.agent.display_name,
        has_new_messages: Math.random() > 0.5
      }))
    },
    {
      id: 'insights',
      type: 'insights',
      title: 'AI Insights',
      priority: 5,
      data: mockData.insights
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
        user={user}
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
                      Welcome back, {user?.name || 'Boss'}! 👑
                    </h2>
                    <p className="text-sm opacity-90">
                      Level {user?.level || 1} • {user?.points || 0} points
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
          <MobileDashboardWidgets
            widgets={widgets}
            onWidgetAction={handleWidgetAction}
            onWidgetReorder={handleWidgetReorder}
          />

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
                      {mockData.todaysStats.tasks_completed}
                    </div>
                    <div className="text-xs text-gray-600">Tasks Done</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {mockData.todaysStats.focus_minutes}
                    </div>
                    <div className="text-xs text-gray-600">Focus Mins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {mockData.todaysStats.goals_achieved}
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

