// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Target, TrendingUp, Award, Clock, Brain, CheckCircle } from 'lucide-react'
import { Skill, LearningModule, UserProgress, LearningRecommendation } from '@/lib/learning-engine'

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
}

export default function LearningDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'skill-gaps' | 'recommendations' | 'progress' | 'analytics'>('overview')
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLearningData()
  }, [])

  const loadLearningData = async () => {
    try {
      setLoading(true)
      
      const [skillGapsRes, recommendationsRes, progressRes, analyticsRes] = await Promise.all([
        fetch('/api/learning?action=skill-gaps'),
        fetch('/api/learning?action=recommendations'),
        fetch('/api/learning?action=progress'),
        fetch('/api/learning?action=analytics')
      ])

      if (skillGapsRes.ok) {
        const data = await skillGapsRes.json()
        setSkillGaps(data.skill_gaps || [])
      }

      if (recommendationsRes.ok) {
        const data = await recommendationsRes.json()
        setRecommendations(data || [])
      }

      if (progressRes.ok) {
        const data = await progressRes.json()
        setProgress(data || [])
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading learning data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'skill-gaps', label: 'Skill Gaps', icon: Target },
    { id: 'recommendations', label: 'Recommendations', icon: TrendingUp },
    { id: 'progress', label: 'Progress', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: Brain }
  ]


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-lg mb-6 w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Learning Center
          </h1>
          <p className="text-gray-300 text-lg">
            Personalized learning paths to accelerate your entrepreneurial journey
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 p-1 bg-black/20 rounded-xl backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
          {activeTab === 'skill-gaps' && <SkillGapsTab skillGaps={skillGaps} />}
          {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} />}
          {activeTab === 'progress' && <ProgressTab progress={progress} />}
          {activeTab === 'analytics' && <AnalyticsTab analytics={analytics} />}
        </motion.div>
      </div>
    </div>
  )
}

function OverviewTab({ analytics }: { analytics: LearningAnalytics | null }) {
  if (!analytics) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
        <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Welcome to Learning!</h3>
        <p className="text-gray-300">Start your learning journey by exploring skill gaps and recommendations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Modules Completed"
          value={analytics.total_modules_completed}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Time Spent"
          value={formatTime(analytics.total_time_spent)}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Current Streak"
          value={`${analytics.current_streak} days`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Skills Improved"
          value={analytics.skills_improved}
          icon={Brain}
          color="pink"
        />
      </div>

      {/* Learning Categories */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Top Learning Categories
        </h3>
        <div className="space-y-3">
          {analytics.top_categories.map((category, index) => (
            <div key={category.category} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-white font-medium">{category.category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {formatTime(category.time_spent)} • {category.modules_completed} modules
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SkillGapsTab({ skillGaps }: { skillGaps: SkillGap[] }) {
  if (skillGaps.length === 0) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
        <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Skill Gaps Detected!</h3>
        <p className="text-gray-300">You&apos;re doing great! Keep up the excellent work.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {skillGaps.map((gap) => (
        <div key={gap.skill.id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{gap.skill.name}</h3>
              <p className="text-gray-300 text-sm">{gap.skill.description}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(gap.priority)}`}>
              {gap.gap_score}% gap
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Skill Gap</span>
              <span>{gap.gap_score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${gap.gap_score}%` }}
              />
            </div>
          </div>

          {gap.recommended_modules.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Modules:</h4>
              <div className="space-y-2">
                {gap.recommended_modules.slice(0, 3).map((module) => (
                  <div key={module.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">{module.title}</span>
                    <span className="text-gray-400 text-xs ml-auto">{module.duration_minutes}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function RecommendationsTab({ recommendations }: { recommendations: LearningRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
        <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
        <p className="text-gray-300">Complete a skill assessment to get personalized recommendations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <div key={rec.module_id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Module #{index + 1}</h3>
              <p className="text-gray-300 text-sm">{rec.reason}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(rec.priority)}`}>
              {rec.priority} priority
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Estimated Impact</span>
              <span>{rec.estimated_impact}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${rec.estimated_impact}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {rec.prerequisites_met ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <div className="w-4 h-4 border border-yellow-400 rounded-full" />
              )}
              <span className="text-sm text-gray-300">
                {rec.prerequisites_met ? 'Prerequisites met' : 'Prerequisites required'}
              </span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              Start Learning
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProgressTab({ progress }: { progress: UserProgress[] }) {
  if (progress.length === 0) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
        <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Learning Progress Yet</h3>
        <p className="text-gray-300">Start your first learning module to track your progress.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {progress.map((prog) => (
        <div key={prog.module_id} className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Module: {prog.module_id}</h3>
            <div className="text-sm text-gray-300">
              {prog.completion_percentage}% Complete
            </div>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${prog.completion_percentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">Time Spent: {formatTime(prog.time_spent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">Quizzes: {prog.quiz_scores.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300">Exercises: {prog.exercises_completed.length}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnalyticsTab({ analytics }: { analytics: LearningAnalytics | null }) {
  if (!analytics) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center">
        <Brain className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Analytics Data Yet</h3>
        <p className="text-gray-300">Start learning to see detailed analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Quiz Performance</h3>
          <div className="text-3xl font-bold text-blue-400 mb-1">{analytics.average_quiz_score}%</div>
          <p className="text-gray-300 text-sm">Average Score</p>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Learning Velocity</h3>
          <div className="text-3xl font-bold text-green-400 mb-1">{analytics.learning_velocity}</div>
          <p className="text-gray-300 text-sm">Modules/Week</p>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Skills Improved</h3>
          <div className="text-3xl font-bold text-purple-400 mb-1">{analytics.skills_improved}</div>
          <p className="text-gray-300 text-sm">Total Skills</p>
        </div>
      </div>

      {/* Learning Categories Chart */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Learning Distribution</h3>
        <div className="space-y-4">
          {analytics.top_categories.map((category, index) => {
            const totalTime = analytics.top_categories.reduce((sum, c) => sum + c.time_spent, 0)
            const percentage = totalTime > 0 ? (category.time_spent / totalTime) * 100 : 0
            
            return (
              <div key={category.category} className="flex items-center gap-4">
                <div className="w-32 text-sm text-gray-300">{category.category}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-20 text-sm text-gray-300 text-right">
                  {formatTime(category.time_spent)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: { 
  title: string
  value: string | number
  icon: any
  color: string
}) {
  const colorClasses = {
    green: 'text-green-400 bg-green-400/10 border-green-400/30',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    pink: 'text-pink-400 bg-pink-400/10 border-pink-400/30'
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-300 text-sm">{title}</div>
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
    case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10'
    case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
    case 'low': return 'text-green-400 border-green-400/30 bg-green-400/10'
    default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
  }
}
