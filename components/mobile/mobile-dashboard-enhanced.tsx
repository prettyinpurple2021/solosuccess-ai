"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MobilePWAProvider, usePWAMobile } from './mobile-pwa-provider'
import MobileDashboard from './mobile-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Zap, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Sparkles,
  Crown,
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  Bell,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileDashboardEnhancedProps {
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
      estimated_minutes?: number
      due_date?: string
    }>
    todaysGoals: Array<{
      id: string
      title: string
      description?: string
      progress: number
      target: number
      deadline?: string
    }>
  }
  className?: string
}

function MobileDashboardContent({ user, dashboardData, className = "" }: MobileDashboardEnhancedProps) {
  const { isInstalled, isOnline, canInstall, install, refresh } = usePWAMobile()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      // Show success message or navigate
      console.log('App installed successfully!')
    }
  }

  // Quick action items
  const quickActions = [
    {
      id: 'voice-task',
      label: 'Voice Task',
      icon: Zap,
      action: () => {
        // Open voice task creator
        const voiceButton = document.querySelector('[data-voice-task]')
        if (voiceButton) {
          (voiceButton as HTMLElement).click()
        }
      },
      color: 'bg-purple-500'
    },
    {
      id: 'focus-session',
      label: 'Focus',
      icon: Target,
      action: () => {
        window.location.href = '/dashboard/focus'
      },
      color: 'bg-blue-500'
    },
    {
      id: 'ai-chat',
      label: 'AI Chat',
      icon: Sparkles,
      action: () => {
        window.location.href = '/dashboard/agents'
      },
      color: 'bg-pink-500'
    },
    {
      id: 'analytics',
      label: 'Stats',
      icon: TrendingUp,
      action: () => {
        window.location.href = '/dashboard/analytics'
      },
      color: 'bg-green-500'
    }
  ]

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-purple-50 to-pink-50", className)}>
      {/* Enhanced Status Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Wifi className="w-3 h-3" />
                    <span>Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <WifiOff className="w-3 h-3" />
                    <span>Offline</span>
                  </div>
                )}
                {isInstalled && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    PWA
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </Button>
            
            {canInstall && !isInstalled && (
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-8 px-3 text-xs bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Tasks Progress */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Tasks</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {dashboardData?.todaysStats.tasks_completed || 0}/{dashboardData?.todaysStats.total_tasks || 0}
                </Badge>
              </div>
              <Progress 
                value={(dashboardData?.todaysStats.tasks_completed || 0) / Math.max(dashboardData?.todaysStats.total_tasks || 1, 1) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* Focus Time */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Focus</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {dashboardData?.todaysStats.focus_minutes || 0}m
                </Badge>
              </div>
              <div className="text-xs text-gray-600">
                {dashboardData?.todaysStats.focus_minutes || 0} minutes today
              </div>
            </CardContent>
          </Card>

          {/* Productivity Score */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Score</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  {dashboardData?.todaysStats.productivity_score || 0}%
                </Badge>
              </div>
              <Progress 
                value={dashboardData?.todaysStats.productivity_score || 0} 
                className="h-2"
              />
            </CardContent>
          </Card>

          {/* AI Interactions */}
          <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-gray-700">AI Chat</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {dashboardData?.todaysStats.ai_interactions || 0}
                </Badge>
              </div>
              <div className="text-xs text-gray-600">
                Conversations today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  onClick={action.action}
                  className="h-16 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", action.color)}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Mobile Dashboard */}
        <MobileDashboard 
          user={user}
          dashboardData={dashboardData}
          className="border-2 border-gray-200"
        />
      </div>

      {/* Floating Quick Actions */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-4 z-40 space-y-2"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  size="sm"
                  onClick={action.action}
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg text-white",
                    action.color,
                    "hover:scale-110 transition-transform"
                  )}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <Button
        size="lg"
        onClick={() => setShowQuickActions(!showQuickActions)}
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        <Zap className="w-6 h-6" />
      </Button>
    </div>
  )
}

export default function MobileDashboardEnhanced(props: MobileDashboardEnhancedProps) {
  return (
    <MobilePWAProvider>
      <MobileDashboardContent {...props} />
    </MobilePWAProvider>
  )
}

// Export the hook for use in other components
export { usePWAMobile } from './mobile-pwa-provider'
