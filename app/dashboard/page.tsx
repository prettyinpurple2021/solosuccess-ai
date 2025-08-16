import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock, 
  Flame, 
  Trophy, 
  Heart, 
  Zap,
  Bot,
  Calendar,
  BarChart3,
  Crown,
  Star,
  ArrowUpRight,
  Users,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock data - in real app this would come from API
  const userStats = {
    level: 15,
    totalPoints: 2847,
    currentStreak: 12,
    wellnessScore: 78,
    focusMinutes: 320,
    tasksCompleted: 47,
    goalsActive: 8,
    aiConversations: 23
  }

  const todaysTasks = [
    { id: 1, title: 'Review Q4 marketing strategy', priority: 'high', status: 'in_progress', due: '2:00 PM' },
    { id: 2, title: 'Call with potential investor', priority: 'urgent', status: 'todo', due: '3:30 PM' },
    { id: 3, title: 'Update product roadmap', priority: 'medium', status: 'todo', due: '5:00 PM' },
    { id: 4, title: 'Review compliance documents', priority: 'high', status: 'completed', due: '10:00 AM' }
  ]

  const empireGoals = [
    { id: 1, title: 'Reach 10K users', progress: 67, target: '10,000', current: '6,700' },
    { id: 2, title: 'Launch new feature', progress: 45, target: '100%', current: '45%' },
    { id: 3, title: 'Increase revenue by 50%', progress: 23, target: '50%', current: '23%' }
  ]

  const recentConversations = [
    { id: 1, agent: 'Roxy', topic: 'Strategic decision framework', time: '2 hours ago', unread: true },
    { id: 2, agent: 'Blaze', topic: 'Growth strategy analysis', time: '1 day ago', unread: false },
    { id: 3, agent: 'Echo', topic: 'Marketing campaign ideas', time: '2 days ago', unread: false }
  ]

  const achievements = [
    { id: 1, title: 'Task Master', description: 'Completed 50 tasks', icon: CheckCircle, unlocked: true },
    { id: 2, title: 'Streak Champion', description: '7-day streak', icon: Flame, unlocked: true },
    { id: 3, title: 'AI Collaborator', description: '20 AI conversations', icon: Bot, unlocked: true },
    { id: 4, title: 'Goal Crusher', description: 'Completed 5 goals', icon: Target, unlocked: false }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BossRoom</h1>
          <p className="text-gray-600 dark:text-gray-300">Your command center for world domination</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Crown className="w-4 h-4 mr-2" />
            Level {userStats.level}
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            <Flame className="w-4 h-4 mr-2" />
            {userStats.currentStreak} day streak
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Minutes</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.focusMinutes}</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.aiConversations}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Mission-Critical Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Today's Mission-Critical Tasks
              </CardTitle>
              <CardDescription>
                Priority tasks that need your attention today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    {task.unread && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
              <Button asChild className="w-full" variant="outline">
                <Link href="/dashboard/slaylist">
                  View All Tasks
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Empire Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-600" />
              Empire Goals
            </CardTitle>
            <CardDescription>
              Your active goals and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {empireGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-muted-foreground">{goal.current} / {goal.target}</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
            <Button asChild className="w-full" variant="outline">
              <Link href="/dashboard/slaylist">
                Manage Goals
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent AI Conversations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="w-5 h-5 mr-2 text-purple-600" />
              Recent AI Conversations
            </CardTitle>
            <CardDescription>
              Your latest chats with the AI squad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentConversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {conversation.agent.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conversation.agent}</p>
                  <p className="text-xs text-muted-foreground truncate">{conversation.topic}</p>
                </div>
                <div className="text-xs text-muted-foreground">{conversation.time}</div>
                {conversation.unread && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            ))}
            <Button asChild className="w-full" variant="outline">
              <Link href="/team">
                Chat with AI Squad
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-purple-600" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className={`flex items-center space-x-3 p-2 rounded-lg ${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-900/20'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'}`}>
                  <achievement.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-medium ${achievement.unlocked ? 'text-green-800 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Wellness & Focus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-purple-600" />
              Wellness & Focus
            </CardTitle>
            <CardDescription>
              Your health and productivity insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Wellness Score</span>
                <span className="font-medium">{userStats.wellnessScore}%</span>
              </div>
              <Progress value={userStats.wellnessScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Focus Streak</span>
                <span className="font-medium">{userStats.currentStreak} days</span>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < Math.min(userStats.currentStreak, 7) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                You're doing great! Keep up the momentum and remember to take breaks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}