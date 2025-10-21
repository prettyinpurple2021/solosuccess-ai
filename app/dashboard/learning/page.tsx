"use client"


export const dynamic = 'force-dynamic'
import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  Brain, 
  CheckCircle,
  Star,
  Zap,
  Users,
  Play,
  Download,
  RefreshCw,
  Sparkles,
  Crown,
  Lightbulb,
  ArrowRight,
  Calendar,
  BarChart3,
  Eye,
  Trophy,
  Flame,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import { logger, logInfo, logError } from '@/lib/logger'

interface Skill {
  id: string
  name: string
  description: string
  category: string
  level: number
  experience_points: number
}

interface LearningModule {
  id: string
  title: string
  description: string
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: string
  skills_covered: string[]
  prerequisites: string[]
  completion_rate: number
  rating: number
}

interface UserProgress {
  module_id: string
  completion_percentage: number
  time_spent: number
  quiz_scores: { quiz_id: string; score: number }[]
  exercises_completed: string[]
  last_accessed: string
  started_at: string
}

interface LearningRecommendation {
  module_id: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  estimated_impact: number
  prerequisites_met: boolean
  estimated_completion_time: number
}

interface SkillGap {
  skill: Skill
  gap_score: number
  priority: 'high' | 'medium' | 'low'
  recommended_modules: LearningModule[]
}

interface LearningAnalytics {
  total_modules_completed: number
  total_time_spent: number
  average_quiz_score: number
  skills_improved: number
  current_streak: number
  learning_velocity: number
  top_categories: Array<{ category: string; time_spent: number; modules_completed: number }>
  certifications_earned: number
  peer_rank: number
  weekly_goal_progress: number
}

export default function LearningDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'skill-gaps' | 'recommendations' | 'progress' | 'analytics' | 'achievements'>('overview')
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadLearningData()
  }, [])

  const loadLearningData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Mock data - in production, this would come from API
      const mockAnalytics: LearningAnalytics = {
        total_modules_completed: 23,
        total_time_spent: 1240, // minutes
        average_quiz_score: 87,
        skills_improved: 15,
        current_streak: 12,
        learning_velocity: 3.2,
        certifications_earned: 4,
        peer_rank: 8,
        weekly_goal_progress: 75,
        top_categories: [
          { category: 'Business Strategy', time_spent: 320, modules_completed: 8 },
          { category: 'Marketing & Sales', time_spent: 280, modules_completed: 6 },
          { category: 'Financial Management', time_spent: 240, modules_completed: 5 },
          { category: 'Leadership & Team Building', time_spent: 200, modules_completed: 4 }
        ]
      }

      const mockSkillGaps: SkillGap[] = [
        {
          skill: {
            id: '1',
            name: 'Data Analytics',
            description: 'Ability to analyze and interpret business data',
            category: 'Technical Skills',
            level: 3,
            experience_points: 750
          },
          gap_score: 65,
          priority: 'high',
          recommended_modules: [
            {
              id: 'mod1',
              title: 'Introduction to Business Analytics',
              description: 'Learn the fundamentals of data analysis for business decisions',
              duration_minutes: 45,
              difficulty: 'intermediate',
              category: 'Technical Skills',
              skills_covered: ['Data Analytics'],
              prerequisites: [],
              completion_rate: 0,
              rating: 4.5
            }
          ]
        },
        {
          skill: {
            id: '2',
            name: 'Negotiation',
            description: 'Skills for effective business negotiations',
            category: 'Soft Skills',
            level: 4,
            experience_points: 920
          },
          gap_score: 40,
          priority: 'medium',
          recommended_modules: [
            {
              id: 'mod2',
              title: 'Advanced Negotiation Techniques',
              description: 'Master complex negotiation scenarios and strategies',
              duration_minutes: 60,
              difficulty: 'advanced',
              category: 'Soft Skills',
              skills_covered: ['Negotiation'],
              prerequisites: ['Basic Negotiation'],
              completion_rate: 0,
              rating: 4.8
            }
          ]
        }
      ]

      const mockRecommendations: LearningRecommendation[] = [
        {
          module_id: 'mod1',
          priority: 'high',
          reason: 'Based on your business goals and current skill gaps',
          estimated_impact: 85,
          prerequisites_met: true,
          estimated_completion_time: 45
        },
        {
          module_id: 'mod2',
          priority: 'medium',
          reason: 'Will help improve your leadership capabilities',
          estimated_impact: 70,
          prerequisites_met: false,
          estimated_completion_time: 60
        }
      ]

      const mockProgress: UserProgress[] = [
        {
          module_id: 'mod3',
          completion_percentage: 75,
          time_spent: 35,
          quiz_scores: [{ quiz_id: 'q1', score: 85 }],
          exercises_completed: ['ex1', 'ex2'],
          last_accessed: new Date().toISOString(),
          started_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]

      setAnalytics(mockAnalytics)
      setSkillGaps(mockSkillGaps)
      setRecommendations(mockRecommendations)
      setProgress(mockProgress)
      
      logInfo('Learning data loaded successfully')
    } catch (error) {
      logError('Error loading learning data:', error)
      toast.error('Failed to load learning data', { icon: '❌' })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadLearningData()
    setRefreshing(false)
    toast.success('Learning data refreshed!', { icon: '✅' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading your learning journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-8"
      >
        {/* Header */}
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
                className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md"
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gradient">Learning Center</h1>
                <p className="text-lg text-purple-200">
                  Personalized learning paths to accelerate your entrepreneurial journey
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Progress
            </Button>
          </div>
        </motion.div>

        {/* Learning Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-purple-900/50 border border-purple-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="skill-gaps" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Skill Gaps
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                <Award className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {analytics && <OverviewTab analytics={analytics} />}
            </TabsContent>

            {/* Skill Gaps Tab */}
            <TabsContent value="skill-gaps" className="space-y-6">
              <SkillGapsTab skillGaps={skillGaps} />
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6">
              <RecommendationsTab recommendations={recommendations} />
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-6">
              <ProgressTab progress={progress} />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              {analytics && <AnalyticsTab analytics={analytics} />}
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <AchievementsTab analytics={analytics} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}

function OverviewTab({ analytics }: { analytics: LearningAnalytics }) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Modules Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.total_modules_completed}</div>
            <p className="text-xs text-green-400">+3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Learning Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.current_streak} days</div>
            <p className="text-xs text-orange-400 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Keep it going!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Skills Improved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.skills_improved}</div>
            <p className="text-xs text-blue-400">Leveling up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.certifications_earned}</div>
            <p className="text-xs text-purple-400">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-300" />
              Weekly Learning Goal
            </CardTitle>
            <CardDescription className="text-purple-200">
              Track your progress towards weekly learning objectives
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Progress</span>
              <span className="text-white font-medium">{analytics.weekly_goal_progress}%</span>
            </div>
            <Progress value={analytics.weekly_goal_progress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-300">3 modules completed</span>
              <span className="text-purple-300">4 modules target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-300" />
              Peer Ranking
            </CardTitle>
            <CardDescription className="text-purple-200">
              Your position among other learners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">#{analytics.peer_rank}</div>
              <p className="text-purple-200">Out of 150 learners</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">Top 5% performer</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Learning Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            Top Learning Categories
          </CardTitle>
          <CardDescription className="text-purple-200">
            Your most focused learning areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top_categories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-purple-700">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{category.category}</h4>
                    <p className="text-sm text-purple-200">{category.modules_completed} modules</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white font-medium">{formatTime(category.time_spent)}</div>
                  <div className="text-xs text-purple-300">Total time</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SkillGapsTab({ skillGaps }: { skillGaps: SkillGap[] }) {
  if (skillGaps.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Skill Gaps Detected!</h3>
          <p className="text-purple-200">You're doing great! Keep up the excellent work.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {skillGaps.map((gap, index) => (
        <motion.div
          key={gap.skill.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{gap.skill.name}</CardTitle>
                  <CardDescription className="text-purple-200">{gap.skill.description}</CardDescription>
                </div>
                <Badge className={getPriorityColor(gap.priority)}>
                  {gap.gap_score}% gap
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Skill Gap</span>
                  <span className="text-white">{gap.gap_score}%</span>
                </div>
                <Progress value={gap.gap_score} className="h-2" indicatorClassName="bg-gradient-to-r from-red-500 to-yellow-500" />
              </div>

              {gap.recommended_modules.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Recommended Modules:</h4>
                  {gap.recommended_modules.map((module) => (
                    <div key={module.id} className="p-3 bg-white/5 rounded-lg border border-purple-700">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-white">{module.title}</h5>
                        <Badge variant="outline" className="border-purple-600 text-purple-200">
                          {module.duration_minutes}m
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-200 mb-3">{module.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white">{module.rating}</span>
                          <Badge variant="outline" className="border-cyan-600 text-cyan-200">
                            {module.difficulty}
                          </Badge>
                        </div>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function RecommendationsTab({ recommendations }: { recommendations: LearningRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
          <p className="text-purple-200">Complete a skill assessment to get personalized recommendations.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <motion.div
          key={rec.module_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">Learning Module #{index + 1}</CardTitle>
                  <CardDescription className="text-purple-200">{rec.reason}</CardDescription>
                </div>
                <Badge className={getPriorityColor(rec.priority)}>
                  {rec.priority} priority
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Estimated Impact</span>
                  <span className="text-white">{rec.estimated_impact}%</span>
                </div>
                <Progress value={rec.estimated_impact} className="h-2" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {rec.prerequisites_met ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-yellow-400 rounded-full" />
                  )}
                  <span className="text-sm text-purple-200">
                    {rec.prerequisites_met ? 'Prerequisites met' : 'Prerequisites required'}
                  </span>
                </div>
                <div className="text-sm text-purple-200">
                  ~{rec.estimated_completion_time}m to complete
                </div>
              </div>

              <Button className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Learning Module
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function ProgressTab({ progress }: { progress: UserProgress[] }) {
  if (progress.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Learning Progress Yet</h3>
          <p className="text-purple-200">Start your first learning module to track your progress.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {progress.map((prog, index) => (
        <motion.div
          key={prog.module_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Module: {prog.module_id}</CardTitle>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  {prog.completion_percentage}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Progress</span>
                  <span className="text-white">{prog.completion_percentage}%</span>
                </div>
                <Progress value={prog.completion_percentage} className="h-3" indicatorClassName="bg-gradient-to-r from-green-500 to-blue-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">{formatTime(prog.time_spent)}</div>
                    <div className="text-purple-300 text-xs">Time Spent</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-white font-medium">{prog.quiz_scores.length}</div>
                    <div className="text-purple-300 text-xs">Quizzes Taken</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">{prog.exercises_completed.length}</div>
                    <div className="text-purple-300 text-xs">Exercises Done</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-purple-700">
                <div className="text-sm text-purple-200">
                  Last accessed: {new Date(prog.last_accessed).toLocaleDateString()}
                </div>
                <Button size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

function AnalyticsTab({ analytics }: { analytics: LearningAnalytics }) {
  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400 mb-2">{analytics.average_quiz_score}%</div>
            <p className="text-purple-200 text-sm">Average Score</p>
            <div className="mt-3">
              <Progress value={analytics.average_quiz_score} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Learning Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-2">{analytics.learning_velocity}</div>
            <p className="text-purple-200 text-sm">Modules/Week</p>
            <div className="mt-3">
              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                Above Average
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Skills Improved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.skills_improved}</div>
            <p className="text-purple-200 text-sm">Total Skills</p>
            <div className="mt-3">
              <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">
                Excellent Progress
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-300" />
            Learning Distribution
          </CardTitle>
          <CardDescription className="text-purple-200">
            Time spent across different learning categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.top_categories.map((category, index) => {
              const totalTime = analytics.top_categories.reduce((sum, c) => sum + c.time_spent, 0)
              const percentage = totalTime > 0 ? (category.time_spent / totalTime) * 100 : 0
              
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200 font-medium">{category.category}</span>
                    <span className="text-white text-sm">{formatTime(category.time_spent)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" indicatorClassName="bg-gradient-to-r from-cyan-500 to-purple-500" />
                  <div className="flex justify-between text-xs text-purple-300">
                    <span>{category.modules_completed} modules</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AchievementsTab({ analytics }: { analytics: LearningAnalytics | null }) {
  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first learning module',
      icon: Star,
      unlocked: true,
      progress: 100,
      color: 'text-yellow-400'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 10-day learning streak',
      icon: Flame,
      unlocked: analytics ? analytics.current_streak >= 10 : false,
      progress: analytics ? Math.min((analytics.current_streak / 10) * 100, 100) : 0,
      color: 'text-orange-400'
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Complete 20 learning modules',
      icon: BookOpen,
      unlocked: analytics ? analytics.total_modules_completed >= 20 : false,
      progress: analytics ? Math.min((analytics.total_modules_completed / 20) * 100, 100) : 0,
      color: 'text-blue-400'
    },
    {
      id: '4',
      title: 'Certification Collector',
      description: 'Earn 5 certifications',
      icon: Award,
      unlocked: analytics ? analytics.certifications_earned >= 5 : false,
      progress: analytics ? Math.min((analytics.certifications_earned / 5) * 100, 100) : 0,
      color: 'text-purple-400'
    },
    {
      id: '5',
      title: 'Top Performer',
      description: 'Achieve top 10% ranking',
      icon: Trophy,
      unlocked: analytics ? analytics.peer_rank <= 15 : false,
      progress: analytics ? Math.min((15 / analytics.peer_rank) * 100, 100) : 0,
      color: 'text-green-400'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={achievement.unlocked ? 'ring-2 ring-yellow-400/50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${achievement.unlocked ? 'animate-pulse' : ''}`}>
                    <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`} />
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                      Unlocked
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-white">{achievement.title}</CardTitle>
                <CardDescription className="text-purple-200">{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-200">Progress</span>
                    <span className="text-white">{Math.round(achievement.progress)}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" indicatorClassName={achievement.unlocked ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gray-600'} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-500/20 text-red-500 border-red-500/30'
    case 'medium': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    case 'low': return 'bg-green-500/20 text-green-500 border-green-500/30'
    default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
  }
}