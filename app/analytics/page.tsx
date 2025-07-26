"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
  BarChart3,
  TrendingUp,
  Target,
  Users,
  Clock,
  Zap,
  Crown,
  Sparkles,
  Award,
  Brain,
  MessageCircle,
  CheckSquare,
  Star,
  Heart,
} from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  // Mock analytics data
  const overviewStats = [
    {
      title: "Goals Completed",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "AI Conversations",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Focus Hours",
      value: "42.5h",
      change: "+8%",
      trend: "up",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Boss Score",
      value: "94%",
      change: "+5%",
      trend: "up",
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const productivityData = [
    { day: "Mon", tasks: 8, focus: 6.5, ai_chats: 12 },
    { day: "Tue", tasks: 12, focus: 8.2, ai_chats: 18 },
    { day: "Wed", tasks: 6, focus: 4.1, ai_chats: 9 },
    { day: "Thu", tasks: 15, focus: 9.8, ai_chats: 22 },
    { day: "Fri", tasks: 11, focus: 7.3, ai_chats: 16 },
    { day: "Sat", tasks: 4, focus: 2.5, ai_chats: 7 },
    { day: "Sun", tasks: 3, focus: 1.8, ai_chats: 5 },
  ]

  const aiAgentStats = [
    { name: "Roxy", interactions: 45, efficiency: 94, mood: "💪", status: "active" },
    { name: "Blaze", interactions: 38, efficiency: 89, mood: "🔥", status: "active" },
    { name: "Echo", interactions: 52, efficiency: 96, mood: "✨", status: "active" },
    { name: "Nova", interactions: 29, efficiency: 87, mood: "🎨", status: "idle" },
    { name: "Lexi", interactions: 41, efficiency: 92, mood: "📊", status: "active" },
    { name: "Vex", interactions: 33, efficiency: 85, mood: "⚡", status: "active" },
    { name: "Lumi", interactions: 18, efficiency: 91, mood: "🛡️", status: "idle" },
    { name: "Glitch", interactions: 25, efficiency: 88, mood: "🚀", status: "active" },
  ]

  const achievements = [
    { title: "Goal Crusher", description: "Completed 20+ goals this month", date: "2 days ago", rarity: "epic" },
    { title: "AI Whisperer", description: "Had 100+ AI conversations", date: "1 week ago", rarity: "rare" },
    { title: "Focus Master", description: "40+ hours in focus mode", date: "3 days ago", rarity: "legendary" },
    { title: "Streak Queen", description: "15-day productivity streak", date: "Today", rarity: "epic" },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "epic":
        return "bg-gradient-to-r from-purple-400 to-blue-500 text-white"
      case "rare":
        return "bg-gradient-to-r from-blue-400 to-teal-500 text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-purple-50 to-teal-50">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Boss Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-4 bg-gradient-to-br from-purple-50/30 via-white to-teal-50/30">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight boss-heading flex items-center gap-3">
              <BarChart3 className="h-10 w-10 text-purple-600" />
              Boss Analytics
              <span className="text-2xl">📊</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-2 font-medium">
              Track your empire growth and boss-level performance! 👑✨
            </p>
          </div>
          <div className="flex gap-2">
            {["7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "punk-button text-white" : "bg-transparent"}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="boss-card glitter-effect">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold empowering-text">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold soloboss-text-gradient">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  <span className="text-sm text-muted-foreground">from last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="productivity" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-pink-100">
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Productivity
            </TabsTrigger>
            <TabsTrigger value="ai-squad" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              AI Squad
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="productivity" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Weekly Productivity Chart */}
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-purple-600" />
                    Weekly Task Completion
                  </CardTitle>
                  <CardDescription>Your boss-level task crushing performance 🎯</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productivityData.map((day, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-muted-foreground">{day.tasks} tasks</span>
                        </div>
                        <Progress value={(day.tasks / 15) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Focus Time Analysis */}
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Focus Time Analysis
                  </CardTitle>
                  <CardDescription>Deep work sessions for maximum boss energy ⚡</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productivityData.map((day, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-muted-foreground">{day.focus}h</span>
                        </div>
                        <Progress value={(day.focus / 10) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Productivity Insights */}
            <Card className="boss-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Boss Productivity Insights
                </CardTitle>
                <CardDescription>AI-powered analysis of your empire-building patterns 🧠</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-800">Peak Performance</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Thursday is your most productive day with 15 tasks completed on average! 🚀
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Focus Champion</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your focus sessions average 7.2 hours per day - that's boss-level concentration! 💪
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span className="font-semibold text-purple-800">Balance Boss</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      You maintain great work-life balance with lighter weekends. Keep it up! ✨
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-squad" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* AI Agent Performance */}
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    AI Squad Performance
                  </CardTitle>
                  <CardDescription>Your virtual team's boss-level stats 🤖</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiAgentStats.slice(0, 4).map((agent, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{agent.mood}</div>
                          <div>
                            <p className="font-semibold empowering-text">{agent.name}</p>
                            <p className="text-sm text-muted-foreground">{agent.interactions} interactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-purple-600">{agent.efficiency}%</div>
                          <Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-xs">
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Interaction Trends */}
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-teal-600" />
                    AI Interaction Trends
                  </CardTitle>
                  <CardDescription>How you're collaborating with your squad 💬</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productivityData.map((day, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-muted-foreground">{day.ai_chats} chats</span>
                        </div>
                        <Progress value={(day.ai_chats / 25) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Squad Efficiency Overview */}
            <Card className="boss-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  Squad Efficiency Overview
                </CardTitle>
                <CardDescription>Complete performance breakdown of your AI empire 👑</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  {aiAgentStats.map((agent, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                    >
                      <div className="text-3xl mb-2">{agent.mood}</div>
                      <h3 className="font-bold empowering-text">{agent.name}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="text-2xl font-bold soloboss-text-gradient">{agent.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">{agent.interactions} interactions</div>
                        <Badge variant={agent.status === "active" ? "default" : "secondary"} className="text-xs">
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <Card className="boss-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Recent Boss Achievements
                </CardTitle>
                <CardDescription>Your legendary wins and milestones 🏆</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 border rounded-lg boss-card bounce-on-hover">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold empowering-text">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        </div>
                        <Badge className={`${getRarityColor(achievement.rarity)} text-xs font-bold`}>
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{achievement.date}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* AI Recommendations */}
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI Boss Recommendations
                  </CardTitle>
                  <CardDescription>Smart suggestions to level up your empire 🧠</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">Productivity Boost</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Schedule your most important tasks on Thursday mornings when you're most productive! 🚀
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">AI Squad Optimization</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Echo and Lexi are your top performers. Consider delegating more complex tasks to them! 💪
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold text-purple-800">Wellness Check</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        Your weekend rest periods are perfect for maintaining boss-level energy. Keep it up! ✨
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Progress */}
              <Card className="boss-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-pink-600" />
                    Goal Progress Tracker
                  </CardTitle>
                  <CardDescription>Your empire-building milestones 🎯</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Monthly Revenue Goal</span>
                        <span className="text-muted-foreground">$8,500 / $10,000</span>
                      </div>
                      <Progress value={85} className="h-3" />
                      <p className="text-xs text-muted-foreground">85% complete - You're crushing it! 🔥</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Client Acquisition</span>
                        <span className="text-muted-foreground">7 / 10 clients</span>
                      </div>
                      <Progress value={70} className="h-3" />
                      <p className="text-xs text-muted-foreground">70% complete - Almost there, boss! 💪</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Content Creation</span>
                        <span className="text-muted-foreground">28 / 30 posts</span>
                      </div>
                      <Progress value={93} className="h-3" />
                      <p className="text-xs text-muted-foreground">93% complete - Final sprint! 🚀</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Skill Development</span>
                        <span className="text-muted-foreground">4 / 5 courses</span>
                      </div>
                      <Progress value={80} className="h-3" />
                      <p className="text-xs text-muted-foreground">80% complete - Knowledge is power! 🧠</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Motivational Footer */}
        <Card className="boss-card soloboss-gradient text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Crown className="h-6 w-6" />
              Your Empire is Growing!
              <Sparkles className="h-6 w-6" />
            </h3>
            <p className="text-lg opacity-90">
              Every metric tells the story of a boss who's building something legendary. Keep slaying! 👑✨
            </p>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
