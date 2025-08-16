import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target, 
  Timer, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Flame, 
  TrendingUp,
  Brain,
  Coffee,
  Heart,
  Zap,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  Activity,
  Plus
} from 'lucide-react'
import { useState } from 'react'

export default function FocusPage() {
  const [activeTab, setActiveTab] = useState('timer')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentSession, setCurrentSession] = useState({
    mode: 'focus',
    duration: 25,
    elapsed: 0,
    task: 'Review Q4 marketing strategy'
  })

  // Mock data - in real app this would come from API
  const focusStats = {
    todayMinutes: 320,
    weeklyAverage: 280,
    currentStreak: 12,
    wellnessScore: 78,
    sessionsCompleted: 8,
    totalFocusTime: 2847
  }

  const focusSessions = [
    {
      id: 1,
      task: 'Review Q4 marketing strategy',
      mode: 'focus',
      plannedMinutes: 25,
      actualMinutes: 28,
      status: 'completed',
      completedAt: '2024-10-18T10:30:00Z'
    },
    {
      id: 2,
      task: 'Call with potential investor',
      mode: 'deep_work',
      plannedMinutes: 60,
      actualMinutes: 55,
      status: 'completed',
      completedAt: '2024-10-18T09:15:00Z'
    },
    {
      id: 3,
      task: 'Update product roadmap',
      mode: 'focus',
      plannedMinutes: 30,
      actualMinutes: 0,
      status: 'cancelled',
      completedAt: null
    }
  ]

  const wellnessInsights = [
    {
      type: 'energy',
      level: 'high',
      message: 'Your energy levels are optimal for deep work',
      icon: Zap
    },
    {
      type: 'focus',
      level: 'medium',
      message: 'Consider taking a short break to maintain focus',
      icon: Brain
    },
    {
      type: 'stress',
      level: 'low',
      message: 'Stress levels are well managed',
      icon: Heart
    }
  ]

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'focus': return 'from-purple-500 to-pink-500'
      case 'deep_work': return 'from-blue-500 to-cyan-500'
      case 'break': return 'from-green-500 to-emerald-500'
      case 'planning': return 'from-orange-500 to-red-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getWellnessColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const startTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setCurrentSession(prev => ({ ...prev, elapsed: 0 }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Focus Mode</h1>
          <p className="text-gray-600 dark:text-gray-300">Maximize your productivity with focused work sessions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Flame className="w-4 h-4 mr-2" />
            {focusStats.currentStreak} day streak
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Heart className="w-4 h-4 mr-2" />
            Wellness: {focusStats.wellnessScore}%
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Focus</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(focusStats.todayMinutes)}</div>
            <Progress value={(focusStats.todayMinutes / 480) * 100} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((focusStats.todayMinutes / 480) * 100)}% of daily goal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(focusStats.weeklyAverage)}</div>
            <p className="text-xs text-muted-foreground">
              Per day this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{focusStats.sessionsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(focusStats.totalFocusTime)}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timer">Focus Timer</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Focus Timer */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Focus Timer
                  </CardTitle>
                  <CardDescription>
                    Set your focus session and start working
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full space-y-8">
                  {/* Timer Display */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                      {formatTime(currentSession.duration - currentSession.elapsed)}
                    </div>
                    <div className="text-lg text-muted-foreground mb-6">
                      {currentSession.task}
                    </div>
                    <Progress 
                      value={(currentSession.elapsed / currentSession.duration) * 100} 
                      className="h-3 w-64 mb-6" 
                    />
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center space-x-4">
                    {!isTimerRunning ? (
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={startTimer}
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Focus
                      </Button>
                    ) : (
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={pauseTimer}
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={stopTimer}
                    >
                      <Square className="w-5 h-5 mr-2" />
                      Stop
                    </Button>
                  </div>

                  {/* Session Settings */}
                  <div className="flex items-center space-x-4">
                    <Select value={currentSession.mode}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="focus">Focus</SelectItem>
                        <SelectItem value="deep_work">Deep Work</SelectItem>
                        <SelectItem value="break">Break</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={currentSession.duration.toString()}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15m</SelectItem>
                        <SelectItem value="25">25m</SelectItem>
                        <SelectItem value="45">45m</SelectItem>
                        <SelectItem value="60">60m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common focus tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Brain className="w-4 h-4 mr-2" />
                    Deep Work Session
                  </div>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Coffee className="w-4 h-4 mr-2" />
                    Take a Break
                  </div>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Calendar className="w-4 h-4 mr-2" />
                    Plan Tomorrow
                  </div>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Activity className="w-4 h-4 mr-2" />
                    Review Progress
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Focus Sessions</h3>
              <p className="text-sm text-muted-foreground">Track your productivity sessions</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </div>

          <div className="space-y-4">
            {focusSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getModeColor(session.mode)} flex items-center justify-center`}>
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{session.task}</h4>
                        <p className="text-sm text-muted-foreground">
                          {session.mode.replace('_', ' ')} • {session.plannedMinutes}m planned
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {session.actualMinutes > 0 ? formatTime(session.actualMinutes) : 'Not completed'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {session.completedAt ? new Date(session.completedAt).toLocaleTimeString() : 'Cancelled'}
                        </div>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wellness Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-green-600" />
                  Wellness Insights
                </CardTitle>
                <CardDescription>
                  Your current wellness status and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {wellnessInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getModeColor(insight.type)} flex items-center justify-center`}>
                      <insight.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium capitalize">{insight.type}</span>
                        <Badge className={getWellnessColor(insight.level)}>
                          {insight.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Productivity Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Productivity Tips
                </CardTitle>
                <CardDescription>
                  Tips to improve your focus and productivity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Take regular breaks</p>
                      <p className="text-sm text-muted-foreground">Follow the Pomodoro technique with 5-minute breaks</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Eliminate distractions</p>
                      <p className="text-sm text-muted-foreground">Turn off notifications and find a quiet space</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Set clear goals</p>
                      <p className="text-sm text-muted-foreground">Define what you want to accomplish in each session</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
