"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb, Settings, Zap, Target, Users, FileText, MessageCircle, TrendingUp, Clock } from "lucide-react"
import { logger, logInfo, logDebug } from "@/lib/logger"

export interface SmartTip {
  id: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  category: "productivity" | "ai" | "goals" | "tasks" | "navigation" | "features"
  priority: "low" | "medium" | "high"
  icon: React.ComponentType<{ className?: string }>
  dismissible: boolean
  autoHide?: number // milliseconds
}

interface SmartTipProps {
  tip: SmartTip
  onDismiss: (tipId: string) => void
  onAction?: (tipId: string) => void
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center"
}

export function SmartTipPopup({ tip, onDismiss, onAction, position = "top-right" }: SmartTipProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (tip.autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(tip.id), 300) // Wait for animation
      }, tip.autoHide)
      return () => clearTimeout(timer)
    }
  }, [tip.autoHide, tip.id, onDismiss])

  const handleDismiss = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => onDismiss(tip.id), 300)
  }, [tip.id, onDismiss])

  const handleAction = useCallback(() => {
    if (onAction) {
      onAction(tip.id)
    }
    if (tip.action?.onClick) {
      tip.action.onClick()
    }
    handleDismiss()
  }, [onAction, tip.id, tip.action, handleDismiss])

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4", 
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "center": "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  }

  const categoryColors = {
    productivity: "from-blue-500 to-indigo-500",
    ai: "from-purple-500 to-pink-500",
    goals: "from-green-500 to-teal-500",
    tasks: "from-orange-500 to-red-500",
    navigation: "from-gray-500 to-slate-500",
    features: "from-pink-500 to-rose-500"
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700"
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
          className={`fixed z-50 max-w-sm ${positionClasses[position]}`}
        >
          <Card className="boss-card border-2 border-purple-200 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${categoryColors[tip.category]} flex items-center justify-center flex-shrink-0`}>
                  <tip.icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`text-xs ${priorityColors[tip.priority]}`}>
                      {tip.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {tip.category}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{tip.description}</p>
                  
                  {tip.action && (
                    <Button
                      size="sm"
                      onClick={handleAction}
                      className="w-full text-xs"
                    >
                      {tip.action.label}
                    </Button>
                  )}
                </div>
                
                {tip.dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface SmartTipManagerProps {
  enabled?: boolean
  onSettingsClick?: () => void
}

export function SmartTipManager({ enabled = true, onSettingsClick }: SmartTipManagerProps) {
  const [tips, setTips] = useState<SmartTip[]>([])
  const [userPreferences, setUserPreferences] = useState({
    tipsEnabled: true,
    tipFrequency: "medium" as "low" | "medium" | "high",
    categories: {
      productivity: true,
      ai: true,
      goals: true,
      tasks: true,
      navigation: true,
      features: true
    }
  })

  // Load user preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smart-tip-preferences')
    if (saved) {
      try {
        setUserPreferences(JSON.parse(saved))
      } catch (error) {
        logDebug('Failed to load tip preferences:', error)
      }
    }
  }, [])

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('smart-tip-preferences', JSON.stringify(userPreferences))
  }, [userPreferences])

  const showTip = useCallback((tip: SmartTip) => {
    if (!enabled || !userPreferences.tipsEnabled) return
    if (!userPreferences.categories[tip.category]) return
    
    // Check frequency limits
    const now = Date.now()
    const recentTips = JSON.parse(localStorage.getItem('recent-tips') || '[]')
    const recentCount = recentTips.filter((t: number) => now - t < 300000).length // 5 minutes
    
    const frequencyLimits = { low: 3, medium: 2, high: 1 }
    if (recentCount >= frequencyLimits[userPreferences.tipFrequency]) {
      logDebug('Tip frequency limit reached')
      return
    }

    logInfo('Showing smart tip:', tip.title)
    setTips(prev => [...prev, tip])
    
    // Track recent tip
    recentTips.push(now)
    localStorage.setItem('recent-tips', JSON.stringify(recentTips.slice(-10)))
  }, [enabled, userPreferences])

  const dismissTip = useCallback((tipId: string) => {
    setTips(prev => prev.filter(tip => tip.id !== tipId))
  }, [])

  const handleTipAction = useCallback((tipId: string) => {
    logInfo('Tip action taken:', tipId)
    // Track tip engagement
    const engagement = JSON.parse(localStorage.getItem('tip-engagement') || '{}')
    engagement[tipId] = (engagement[tipId] || 0) + 1
    localStorage.setItem('tip-engagement', JSON.stringify(engagement))
  }, [])

  // Expose showTip function globally for other components
  useEffect(() => {
    (window as any).showSmartTip = showTip
    return () => {
      delete (window as any).showSmartTip
    }
  }, [showTip])

  if (!enabled) return null

  return (
    <>
      {tips.map(tip => (
        <SmartTipPopup
          key={tip.id}
          tip={tip}
          onDismiss={dismissTip}
          onAction={handleTipAction}
        />
      ))}
      
      {/* Settings button */}
      {onSettingsClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
          className="fixed bottom-4 left-4 z-40"
        >
          <Settings className="h-4 w-4 mr-2" />
          Tip Settings
        </Button>
      )}
    </>
  )
}

// Predefined smart tips for common scenarios
export const SMART_TIPS: Record<string, SmartTip> = {
  'goal-creation-struggle': {
    id: 'goal-creation-struggle',
    title: '💡 Pro Tip: Break Down Large Goals',
    description: 'Try creating smaller, actionable sub-goals instead of one big goal. This makes progress more visible and achievable!',
    category: 'goals',
    priority: 'medium',
    icon: Target,
    dismissible: true,
    autoHide: 8000
  },
  'ai-chat-inefficient': {
    id: 'ai-chat-inefficient',
    title: '🤖 AI Tip: Be Specific',
    description: 'Try being more specific in your requests. Instead of "help me", try "help me create a marketing strategy for my SaaS product".',
    category: 'ai',
    priority: 'medium',
    icon: MessageCircle,
    dismissible: true,
    autoHide: 10000
  },
  'task-overwhelm': {
    id: 'task-overwhelm',
    title: '⚡ Productivity Tip: Use the 2-Minute Rule',
    description: 'If a task takes less than 2 minutes, do it now. Otherwise, break it into smaller steps or schedule it.',
    category: 'productivity',
    priority: 'high',
    icon: Zap,
    dismissible: true,
    autoHide: 12000
  },
  'navigation-confusion': {
    id: 'navigation-confusion',
    title: '🧭 Navigation Tip: Use the Search',
    description: 'Can\'t find what you\'re looking for? Try the global search (Ctrl+K) to quickly find features, goals, or tasks.',
    category: 'navigation',
    priority: 'low',
    icon: TrendingUp,
    dismissible: true,
    autoHide: 6000
  },
  'feature-discovery': {
    id: 'feature-discovery',
    title: '✨ Hidden Feature: Voice Commands',
    description: 'Did you know you can create tasks using voice commands? Click the microphone icon in the task creation area.',
    category: 'features',
    priority: 'medium',
    icon: Lightbulb,
    dismissible: true,
    autoHide: 10000
  }
}
