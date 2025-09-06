"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Crown, 
  Sparkles, 
  Target, 
  Users, 
  Rocket, 
  Gift, 
  Star,
  Zap,
  TrendingUp,
  Brain,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
  Plus,
  MessageCircle,
  FileText,
  Calendar,
  Award,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

interface WelcomeDashboardProps {
  userData?: any
  onStartOnboarding?: () => void
  onSkipOnboarding?: () => void
}

export function WelcomeDashboard({ userData, onStartOnboarding, onSkipOnboarding }: WelcomeDashboardProps) {
  const [currentTip, setCurrentTip] = useState(0)
  const [showCelebration, setShowCelebration] = useState(true)

  const quickActions = [
    {
      id: "create-goal",
      title: "Create Your First Goal",
      description: "Set a goal and start your journey",
      icon: Target,
      color: "from-purple-500 to-pink-500",
      href: "/dashboard/slaylist"
    },
    {
      id: "chat-ai",
      title: "Chat with AI",
      description: "Meet your AI squad",
      icon: MessageCircle,
      color: "from-pink-500 to-purple-500",
      href: "/dashboard/agents"
    },
    {
      id: "upload-file",
      title: "Upload a File",
      description: "Add documents to your briefcase",
      icon: FileText,
      color: "from-teal-500 to-blue-500",
      href: "/dashboard/briefcase"
    },
    {
      id: "explore-features",
      title: "Explore Features",
      description: "Discover what's possible",
      icon: Lightbulb,
      color: "from-orange-500 to-red-500",
      href: "/features"
    }
  ]

  const dailyTips = [
    "Check your dashboard daily for motivation and progress updates",
    "Set 3-5 main goals maximum for better focus and achievement",
    "Use AI agents for specific tasks - they each have unique expertise",
    "Break large goals into smaller, actionable tasks",
    "Review your analytics weekly to identify productivity patterns",
    "Upload important documents to let AI analyze and organize them",
    "Use voice commands to create tasks quickly and efficiently"
  ]

  const achievements = [
    {
      id: "first-login",
      title: "Welcome to the Empire!",
      description: "You've successfully joined SoloBoss AI",
      icon: Crown,
      unlocked: true,
      points: 100
    },
    {
      id: "first-goal",
      title: "Goal Setter",
      description: "Create your first goal",
      icon: Target,
      unlocked: false,
      points: 250
    },
    {
      id: "first-task",
      title: "Task Master",
      description: "Add your first task",
      icon: CheckCircle,
      unlocked: false,
      points: 150
    },
    {
      id: "first-ai-chat",
      title: "AI Collaborator",
      description: "Start your first AI conversation",
      icon: MessageCircle,
      unlocked: false,
      points: 200
    }
  ]

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dailyTips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Hide celebration after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen gradient-background p-6">
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-32 h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Crown className="h-16 w-16 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Crown className="h-10 w-10 text-white" />
          </motion.div>
          
          <div>
            <h1 className="text-4xl font-bold boss-heading mb-2">
              Welcome to Your Empire! 👑
            </h1>
            <p className="text-xl text-muted-foreground">
              You're ready to dominate your industry with AI-powered productivity tools
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Badge className="girlboss-badge text-lg px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Level 1 Boss
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              100 Points
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Link href={action.href}>
                <Card className="boss-card h-full cursor-pointer transition-all duration-200 hover:shadow-lg">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full punk-button text-white"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Getting Started Guide */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="boss-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-600" />
                  Getting Started Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Set Your First Goal", desc: "Define what you want to achieve", completed: false },
                    { step: 2, title: "Create Tasks", desc: "Break down your goal into actionable steps", completed: false },
                    { step: 3, title: "Chat with AI", desc: "Get help from your AI squad", completed: false },
                    { step: 4, title: "Track Progress", desc: "Monitor your success with analytics", completed: false }
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-bold">{item.step}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Progress: 0 of 4 steps completed</p>
                      <Progress value={0} className="w-full mt-2" />
                    </div>
                    <Button 
                      onClick={onStartOnboarding}
                      className="punk-button text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Daily Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Daily Tip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-muted-foreground"
                    >
                      {dailyTips[currentTip]}
                    </motion.p>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {achievement.points} pts
                      </Badge>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Welcome Bonus */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Card className="boss-card border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-purple-600" />
                    Welcome Bonus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <p className="text-sm font-medium">🎉 7-Day Premium Trial</p>
                    <p className="text-xs text-muted-foreground">Access to all features</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                    <p className="text-sm font-medium">🚀 100 AI Credits</p>
                    <p className="text-xs text-muted-foreground">Bonus conversations</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                    <p className="text-sm font-medium">📚 Premium Templates</p>
                    <p className="text-xs text-muted-foreground">50+ business templates</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-lg font-semibold empowering-text">
            <Sparkles className="h-5 w-5" />
            Ready to start building your empire!
            <Sparkles className="h-5 w-5" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={onStartOnboarding}
              className="punk-button text-white text-lg px-8 py-4"
              size="lg"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              onClick={onSkipOnboarding}
              variant="outline"
              className="text-lg px-8 py-4"
              size="lg"
            >
              Skip for Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
