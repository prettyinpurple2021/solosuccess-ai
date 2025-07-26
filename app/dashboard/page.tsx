"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Calendar,
  Crown,
  Target,
  MessageSquare,
  Sparkles,
  Zap,
  FileText,
  Users,
  TrendingUp,
  ChevronRight,
} from "lucide-react"

import { AuthGuard } from "@/components/auth/auth-guard"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { FeatureGate } from "@/components/subscription/feature-gate"

const quickActions = [
  { name: "Generate SlayList", icon: Target, href: "/slaylist", color: "from-purple-500 to-pink-500" },
  { name: "Chat with AI Squad", icon: MessageSquare, href: "/team", color: "from-blue-500 to-cyan-500" },
  { name: "Brand Studio", icon: Sparkles, href: "/brand", color: "from-green-500 to-emerald-500" },
  { name: "Focus Mode", icon: Zap, href: "/focus", color: "from-orange-500 to-red-500" },
]

const recentActivities = [
  { action: "Completed morning routine checklist", time: "2 hours ago", icon: Target },
  { action: "Roxy helped optimize your brand colors", time: "4 hours ago", icon: Sparkles },
  { action: "Echo scheduled 3 client meetings", time: "6 hours ago", icon: Calendar },
  { action: "Generated new content ideas", time: "1 day ago", icon: FileText },
]

const achievements = [
  { title: "Task Slayer", description: "Completed 50 tasks this month", progress: 85, icon: Crown },
  { title: "Brand Boss", description: "Created 10 brand assets", progress: 60, icon: Sparkles },
  { title: "Team Leader", description: "Collaborated with all AI agents", progress: 100, icon: Users },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { subscription, loading } = useSubscription()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <AuthGuard>
      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soloboss%20title%20banner-kRO6VUQJZdd5QuIFTlylS6iicfsrtx.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex items-center gap-2 px-4 text-white">
            <SidebarTrigger className="-ml-1 text-white hover:bg-white/20" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold text-lg">BossRoom Dashboard</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {getGreeting()}, Boss! 👑
            </h1>
            <p className="text-gray-600">Ready to dominate your empire? Your AI squad is standing by.</p>
            {!loading && subscription && (
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                {subscription.features.name} Plan
              </Badge>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Jump into your most powerful tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link href={action.href}>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-all duration-200 group bg-transparent"
                        >
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white group-hover:scale-110 transition-transform`}
                          >
                            <action.icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-medium text-center">{action.name}</span>
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats Overview */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                  <Target className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">127</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                  <Progress value={75} className="mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">89</div>
                  <p className="text-xs text-muted-foreground">+23% from last week</p>
                  <Progress value={60} className="mt-2" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-muted-foreground">Boss level achieved! 👑</p>
                  <Progress value={94} className="mt-2" />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest empire-building moves</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                      <div className="p-1 rounded-full bg-white shadow-sm">
                        <activity.icon className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Boss Achievements
                  </CardTitle>
                  <CardDescription>Your path to empire domination</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 + index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <achievement.icon className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">{achievement.title}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {achievement.progress}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <Progress value={achievement.progress} className="h-2" />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Premium Features Showcase */}
          <FeatureGate tier="accelerator">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Squad Collaboration Hub
                  </CardTitle>
                  <CardDescription>Your premium AI agents are ready to collaborate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                    <Link href="/collaboration">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                        Start Collaboration
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </FeatureGate>

          {/* Upgrade Prompt for Free Users */}
          <FeatureGate
            tier="accelerator"
            showUpgrade={false}
            fallback={
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Crown className="h-6 w-6 text-purple-500" />
                      Unlock Your Full Boss Potential
                    </CardTitle>
                    <CardDescription>
                      Upgrade to access all 8 AI agents, unlimited tasks, and premium features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
                        View Pricing Plans
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            }
          />
        </div>
      </SidebarInset>
    </AuthGuard>
  )
}
