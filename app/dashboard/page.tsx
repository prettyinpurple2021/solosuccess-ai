"use client"

export const dynamic = 'force-dynamic'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { useState, useEffect, useMemo, useCallback} from "react"
import { useDashboardData} from "@/hooks/use-dashboard-data"
import { useAuth} from "@/hooks/use-auth"
import { useSmartTips, TRIGGER_CONDITIONS } from "@/hooks/use-smart-tips"
import { useAnalytics, usePageTracking, usePerformanceTracking} from "@/hooks/use-analytics"
import { EnhancedOnboarding} from "@/components/onboarding/enhanced-onboarding"
import { WelcomeDashboard} from "@/components/onboarding/welcome-dashboard"
import { Loading} from "@/components/ui/loading"
import { motion, easeOut} from "framer-motion"
import { 
  CheckCircle, 
  Target, 
  Clock, 
  MessageCircle, 
  Trophy, 
  Crown, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  BarChart3, 
  Plus, 
  Briefcase,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Award
} from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter} from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import MobileDashboardEnhanced from "@/components/mobile/mobile-dashboard-enhanced"
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalGrid
} from '@/components/military'

// Note: Metadata cannot be exported from client components
// SEO metadata is handled in the layout.tsx file

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { data, loading, error } = useDashboardData()
  const { track } = useAnalytics()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showWelcomeDashboard, setShowWelcomeDashboard] = useState(false)

  // Smart tips configuration
  const smartTipsConfig = {
    enabled: true,
    triggers: [
      {
        condition: TRIGGER_CONDITIONS.navigationConfusion,
        tipId: 'navigation-confusion',
        delay: 5000,
        cooldown: 10 * 60 * 1000 // 10 minutes
      },
      {
        condition: TRIGGER_CONDITIONS.featureDiscovery,
        tipId: 'feature-discovery',
        delay: 15000,
        cooldown: 15 * 60 * 1000 // 15 minutes
      }
    ]
  }

  useSmartTips(smartTipsConfig)
  const searchParams = useSearchParams()
  const _router = useRouter()
  const isMobile = useIsMobile()

  // Track page views and performance
  usePageTracking()
  usePerformanceTracking()

  // Animation variants - moved to top to avoid hooks order violation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  }), [])

  // Callback functions - moved to top to avoid hooks order violation
  const handleOnboardingComplete = useCallback(async (onboardingData: unknown) => {
    try {
      // Save onboarding data to user profile
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('authToken')
            ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            : {}),
        },
        body: JSON.stringify({
          onboarding_completed: true,
          onboarding_data: onboardingData,
        }),
      })

      if (response.ok) {
        // Track onboarding completion
        track('feature_used', {
          feature: 'onboarding',
          action: 'completed',
          onboardingData
        })
        
        setShowOnboarding(false)
        // Refresh dashboard data
        window.location.reload()
      } else {
        const errorData = await response.json()
        logError('Onboarding completion failed:', errorData)
        // Still close onboarding to prevent user being stuck
        setShowOnboarding(false)
      }
    } catch (error) {
      logError('Error saving onboarding data:', error)
      track('error_occurred', {
        error: 'onboarding_completion_failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }, [track])

  const handleOnboardingSkip = () => {
    logInfo('Dashboard - Onboarding skip called')
    setShowOnboarding(false)
  }

  const handleStartOnboarding = () => {
    setShowWelcomeDashboard(false)
    setShowOnboarding(true)
  }

  const handleSkipWelcome = () => {
    setShowWelcomeDashboard(false)
  }

  // Check if onboarding should be shown
  useEffect(() => {
    if (data && !data.user.onboarding_completed) {
      // Show welcome dashboard first, then onboarding
      setShowWelcomeDashboard(true)
    }
  }, [data])

  // Support query param trigger (?onboarding=1) for reliability
  useEffect(() => {
    const onboardingFlag = searchParams?.get('onboarding')
    if (onboardingFlag === '1') {
      setShowWelcomeDashboard(false)
      setShowOnboarding(true)
      // Clean the param from URL without full reload
      const url = new URL(window.location.href)
      url.searchParams.delete('onboarding')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  // Track dashboard view
  useEffect(() => {
    if (data) {
      track('dashboard_viewed', {
        userLevel: data.user.level,
        totalPoints: data.user.total_points,
        streak: data.user.current_streak
      })
    }
  }, [data, track])

  // Show welcome dashboard for first-time users
  if (showWelcomeDashboard && data) {
    return (
      <WelcomeDashboard
        userData={data.user}
        onStartOnboarding={handleStartOnboarding}
        onSkipOnboarding={handleSkipWelcome}
      />
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-military-midnight">
        <CamoBackground />
        <TacticalGrid />
        
        <EnhancedOnboarding 
          open={showOnboarding} 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
        
        <div className="flex items-center justify-center min-h-[60vh]">
          <GlassCard className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-heading font-bold text-military-glass-white mb-2">
              Loading Command Center...
            </h2>
            <p className="text-military-storm-grey">
              Preparing your tactical dashboard
            </p>
          </GlassCard>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-military-midnight">
        <CamoBackground />
        <TacticalGrid />
        
        <EnhancedOnboarding 
          open={showOnboarding} 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
        
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <GlassCard className="max-w-md p-8 text-center" glow>
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-military-glass-white mb-2">
              Mission Critical Error
            </h2>
            <p className="text-military-storm-grey mb-6">{error}</p>
            <TacticalButton 
              onClick={() => window.location.reload()}
              variant="primary"
              className="w-full"
            >
              <Shield className="w-4 h-4 mr-2" />
              Retry Mission
            </TacticalButton>
          </GlassCard>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-military-midnight">
        <CamoBackground />
        <TacticalGrid />
        
        <EnhancedOnboarding 
          open={showOnboarding} 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
        
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <GlassCard className="max-w-md p-8 text-center" glow>
            <RankStars rank="Commander" size="large" className="justify-center mb-4" />
            <h2 className="text-2xl font-heading font-bold text-military-glass-white mb-2">
              Welcome to SoloSuccess AI
            </h2>
            <p className="text-military-storm-grey mb-6">Begin your tactical mission</p>
            <div className="space-y-3">
              <Link href="/dashboard/slaylist">
                <TacticalButton 
                  variant="primary" 
                  className="w-full"
                  icon={<Target className="w-4 h-4" />}
                >
                  Create Mission
                </TacticalButton>
              </Link>
              <Link href="/dashboard/agents">
                <TacticalButton 
                  variant="secondary" 
                  className="w-full"
                  icon={<MessageCircle className="w-4 h-4" />}
                >
                  Contact Command
                </TacticalButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  const { user: dashboardUser, todaysStats, todaysTasks, activeGoals, recentConversations, recentBriefcases, insights } = data

  // Render mobile PWA dashboard for mobile devices
  if (isMobile) {
    return (
      <MobileDashboardEnhanced
        user={{
          name: data.user.full_name || data.user.email.split('@')[0],
          email: data.user.email,
          avatar: data.user.avatar,
          level: data.user.level,
          points: data.user.total_points
        }}
        dashboardData={{
          todaysStats: {
            tasks_completed: data.todaysStats.tasks_completed,
            total_tasks: data.todaysStats.total_tasks,
            focus_minutes: data.todaysStats.focus_minutes,
            ai_interactions: data.todaysStats.ai_interactions,
            goals_achieved: data.todaysStats.goals_achieved,
            productivity_score: data.todaysStats.productivity_score
          },
          todaysTasks: data.todaysTasks || [],
          todaysGoals: data.todaysGoals || []
        }}
      />
    )
  }

  return (
    <main className="min-h-screen bg-military-midnight" role="main">
      <CamoBackground />
      <TacticalGrid />
      
      <EnhancedOnboarding 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-8"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-12 h-12 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center"
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-military-glass-white">
                  Welcome back, {data.user.full_name || data.user.email.split('@')[0]}! 👑
                </h1>
                <p className="text-lg text-military-storm-grey">
                  Command center status report
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatsBadge variant="warning" size="lg">
              Level {data.user.level}
            </StatsBadge>
            <StatsBadge variant="success" size="lg">
              {data.user.total_points} pts
            </StatsBadge>
          </div>
        </motion.div>

        {/* Today's Stats */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Today's Statistics</h2>
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <StatsBadge variant="success" size="sm">
                  +15%
                </StatsBadge>
              </div>
              <h3 className="text-2xl font-bold text-military-glass-white mb-1">
                {todaysStats.tasks_completed}/{todaysStats.total_tasks}
              </h3>
              <p className="text-military-storm-grey text-sm">Tasks Completed</p>
            </GlassCard>
            
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <StatsBadge variant="success" size="sm">
                  +8%
                </StatsBadge>
              </div>
              <h3 className="text-2xl font-bold text-military-glass-white mb-1">
                {todaysStats.focus_minutes}m
              </h3>
              <p className="text-military-storm-grey text-sm">Focus Time</p>
            </GlassCard>
            
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <StatsBadge variant="success" size="sm">
                  +12%
                </StatsBadge>
              </div>
              <h3 className="text-2xl font-bold text-military-glass-white mb-1">
                {todaysStats.ai_interactions}
              </h3>
              <p className="text-military-storm-grey text-sm">AI Interactions</p>
            </GlassCard>
            
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <StatsBadge variant="success" size="sm">
                  +5%
                </StatsBadge>
              </div>
              <h3 className="text-2xl font-bold text-military-glass-white mb-1">
                {todaysStats.productivity_score}%
              </h3>
              <p className="text-military-storm-grey text-sm">Productivity Score</p>
            </GlassCard>
          </motion.div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Tasks */}
          <section aria-labelledby="tasks-heading" className="lg:col-span-2">
            <h2 id="tasks-heading" className="sr-only">Today's Tasks</h2>
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-military-glass-white flex items-center space-x-2">
                    <Target className="w-6 h-6 text-military-hot-pink" />
                    <span>Today's Missions</span>
                  </h2>
                  <TacticalButton variant="secondary" size="sm">
                    View All
                  </TacticalButton>
                </div>
                
                <div className="space-y-4">
                  {todaysTasks.length > 0 ? (
                    todaysTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-military-tactical/30 border border-military-gunmetal/30 rounded-lg hover:bg-military-tactical/50 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className={`w-3 h-3 rounded-full ${
                              task.status === 'completed' ? 'bg-military-hot-pink' : 'bg-military-storm-grey'
                            }`}
                          />
                          <div>
                            <p className="font-medium text-military-glass-white">{task.title}</p>
                            {task.goal && (
                              <p className="text-sm text-military-storm-grey">
                                Goal: {task.goal.title}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatsBadge 
                            variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'} 
                            size="sm"
                          >
                            {task.priority}
                          </StatsBadge>
                          {task.status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-military-hot-pink" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-military-storm-grey mx-auto mb-4" />
                      <p className="text-military-storm-grey mb-4">No missions for today</p>
                      <TacticalButton 
                        variant="primary" 
                        size="sm"
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Add Mission
                      </TacticalButton>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </section>

          {/* Active Goals */}
          <section aria-labelledby="goals-heading">
            <h2 id="goals-heading" className="sr-only">Active Goals</h2>
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-military-glass-white flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-military-hot-pink" />
                    <span>Active Objectives</span>
                  </h2>
                  <TacticalButton size="sm" variant="primary">
                    View All
                  </TacticalButton>
                </div>
                
                <div className="space-y-4">
                  {activeGoals.length > 0 ? (
                    activeGoals.map((goal, index) => (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-military-tactical/30 border border-military-gunmetal/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-military-glass-white">{goal.title}</h3>
                          <span className="text-sm font-bold text-military-hot-pink">
                            {goal.progress_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-military-gunmetal/30 rounded-full h-2 mb-2">
                          <div 
                            className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink h-2 rounded-full transition-all duration-300"
                            style={{ width: `${goal.progress_percentage}%` }}
                          />
                        </div>
                        {goal.target_date && (
                          <p className="text-xs text-military-storm-grey">
                            Due: {new Date(goal.target_date).toLocaleDateString()}
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-military-storm-grey mx-auto mb-4" />
                      <p className="text-military-storm-grey mb-4">No active objectives</p>
                      <TacticalButton 
                        variant="primary" 
                        size="sm"
                        icon={<Crown className="w-4 h-4" />}
                      >
                        Create Objective
                      </TacticalButton>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </section>
        </div>

        {/* Recent Conversations & Insights */}
        <section aria-labelledby="conversations-heading">
          <h2 id="conversations-heading" className="sr-only">Recent Conversations and Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Conversations */}
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-military-glass-white flex items-center space-x-2">
                    <MessageCircle className="w-6 h-6 text-military-hot-pink" />
                    <span>Recent Intel</span>
                  </h2>
                  <TacticalButton size="sm" variant="primary">
                    View All
                  </TacticalButton>
                </div>
                
                <div className="space-y-3">
                  {recentConversations.length > 0 ? (
                    recentConversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-military-tactical/30 border border-military-gunmetal/30 rounded-lg hover:bg-military-tactical/50 transition-all cursor-pointer"
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: conversation.agent.accent_color }}
                        >
                          {conversation.agent.display_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-military-glass-white">{conversation.agent.display_name}</p>
                          <p className="text-sm text-military-storm-grey">
                            {new Date(conversation.last_message_at).toLocaleDateString()}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-military-storm-grey" />
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-military-storm-grey mx-auto mb-4" />
                      <p className="text-military-storm-grey mb-4">No recent intel</p>
                      <TacticalButton 
                        variant="primary" 
                        size="sm"
                      >
                        Start Communication
                      </TacticalButton>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Insights */}
            <motion.div variants={itemVariants}>
              <GlassCard className="p-6" glow>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-heading font-bold text-military-glass-white flex items-center space-x-2">
                    <Sparkles className="w-6 h-6 text-military-hot-pink" />
                    <span>AI Intelligence</span>
                  </h2>
                  <TacticalButton size="sm" variant="primary">
                    View All
                  </TacticalButton>
                </div>
                
                <div className="space-y-4">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-military-tactical/30 border border-military-gunmetal/30 rounded-lg"
                      >
                        <h3 className="font-semibold text-military-glass-white mb-2">{insight.title}</h3>
                        <p className="text-sm text-military-storm-grey mb-3">
                          {insight.description}
                        </p>
                        <TacticalButton size="sm" variant="primary">
                          {insight.action}
                        </TacticalButton>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-military-storm-grey mx-auto mb-4" />
                      <p className="text-military-storm-grey mb-2">No intelligence yet</p>
                      <p className="text-sm text-military-storm-grey">
                        Complete more missions to get AI insights
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Briefcase Section */}
        <section aria-labelledby="briefcase-heading">
          <h2 id="briefcase-heading" className="sr-only">Recent Briefcases</h2>
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-military-glass-white flex items-center space-x-2">
                  <Briefcase className="w-6 h-6 text-military-hot-pink" />
                  <span>Mission Briefcases</span>
                </h2>
                <Link href="/dashboard/briefcase">
                  <TacticalButton size="sm" variant="primary">
                    View All
                  </TacticalButton>
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentBriefcases && recentBriefcases.length > 0 ? (
                  recentBriefcases.map((briefcase: any, index: number) => (
                    <motion.div
                      key={briefcase.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-military-tactical/30 border border-military-gunmetal/30 rounded-lg hover:bg-military-tactical/50 transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-military-glass-white">{briefcase.title}</p>
                        <p className="text-sm text-military-storm-grey">
                          {briefcase.goal_count} objectives • {briefcase.task_count} missions
                        </p>
                        <p className="text-xs text-military-storm-grey">
                          Updated {new Date(briefcase.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatsBadge 
                          variant={briefcase.status === 'active' ? 'success' : briefcase.status === 'completed' ? 'info' : 'secondary'} 
                          size="sm"
                        >
                          {briefcase.status}
                        </StatsBadge>
                        <ArrowRight className="w-4 h-4 text-military-storm-grey" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-military-storm-grey mx-auto mb-4" />
                    <p className="text-military-storm-grey mb-2">No briefcases yet</p>
                    <p className="text-sm text-military-storm-grey mb-4">
                      Create your first briefcase to organize your missions and objectives
                    </p>
                    <Link href="/dashboard/briefcase">
                      <TacticalButton 
                        variant="primary" 
                        size="sm"
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Create Briefcase
                      </TacticalButton>
                    </Link>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </motion.div>
    </main>
  )
}