import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Target, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Flame, 
  TrendingUp,
  Bot,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

export default function SlayListPage() {
  const [activeTab, setActiveTab] = useState('goals')

  // Mock data - in real app this would come from API
  const goals = [
    {
      id: 1,
      title: 'Reach 10K users',
      description: 'Grow our user base to 10,000 active users',
      status: 'active',
      priority: 'high',
      progress: 67,
      targetDate: '2024-12-31',
      tasks: 8,
      completedTasks: 5,
      aiSuggestions: ['Focus on social media marketing', 'Implement referral program', 'Optimize onboarding flow']
    },
    {
      id: 2,
      title: 'Launch new feature',
      description: 'Release the AI-powered analytics dashboard',
      status: 'active',
      priority: 'urgent',
      progress: 45,
      targetDate: '2024-11-15',
      tasks: 12,
      completedTasks: 6,
      aiSuggestions: ['Prioritize core functionality', 'Set up beta testing', 'Prepare launch materials']
    },
    {
      id: 3,
      title: 'Increase revenue by 50%',
      description: 'Boost monthly recurring revenue through new pricing and features',
      status: 'active',
      priority: 'high',
      progress: 23,
      targetDate: '2024-12-31',
      tasks: 15,
      completedTasks: 3,
      aiSuggestions: ['Analyze pricing strategy', 'Identify upsell opportunities', 'Improve conversion rates']
    }
  ]

  const tasks = [
    {
      id: 1,
      title: 'Review Q4 marketing strategy',
      description: 'Analyze current marketing performance and plan Q4 campaigns',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-10-20',
      estimatedMinutes: 120,
      goalId: 1,
      aiGenerated: true
    },
    {
      id: 2,
      title: 'Call with potential investor',
      description: 'Discuss Series A funding round and company vision',
      status: 'todo',
      priority: 'urgent',
      dueDate: '2024-10-18',
      estimatedMinutes: 60,
      goalId: 3,
      aiGenerated: false
    },
    {
      id: 3,
      title: 'Update product roadmap',
      description: 'Revise product roadmap based on user feedback and market analysis',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-10-25',
      estimatedMinutes: 180,
      goalId: 2,
      aiGenerated: true
    },
    {
      id: 4,
      title: 'Review compliance documents',
      description: 'Ensure all legal documents are up to date',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-10-15',
      estimatedMinutes: 90,
      goalId: 1,
      aiGenerated: false
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'active': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckSquare className="w-4 h-4 text-green-600" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />
      case 'active': return <Target className="w-4 h-4 text-purple-600" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SlayList</h1>
          <p className="text-gray-600 dark:text-gray-300">Your goals and tasks - organized for maximum impact</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
          <Button variant="outline">
            <Bot className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter(t => t.aiGenerated).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks suggested by AI
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center">
                        {goal.title}
                        <Badge className={`ml-2 ${getPriorityColor(goal.priority)}`}>
                          {goal.priority}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {goal.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Tasks: {goal.completedTasks}/{goal.tasks}</span>
                    <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>

                  {goal.aiSuggestions.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Bot className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">AI Suggestions</span>
                      </div>
                      <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                        {goal.aiSuggestions.slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <Star className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      View Tasks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          {/* Tasks Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage your tasks and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="Search tasks..." className="w-full" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getStatusIcon(task.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium truncate">{task.title}</h3>
                          {task.aiGenerated && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              <Bot className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.estimatedMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}