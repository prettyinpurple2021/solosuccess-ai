// @ts-nocheck
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, CheckCircle, Clock, BookOpen, Target, ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { LearningModule, QuizQuestion } from '@/lib/learning-engine'

interface LearningModuleProps {
  module: LearningModule
  onProgress: (progressData: {
    completion_percentage: number
    time_spent: number
    quiz_scores?: { quiz_id: string; score: number }[]
    exercises_completed?: string[]
  }) => void
  onComplete: () => void
}

export default function LearningModuleComponent({ module, onProgress, onComplete }: LearningModuleProps) {
  const [currentSection, setCurrentSection] = useState<'content' | 'quiz' | 'exercise'>('content')
  const [timeSpent, setTimeSpent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: number }>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [exerciseCompleted, setExerciseCompleted] = useState(false)
  const [contentProgress, setContentProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleContentProgress = (progress: number) => {
    setContentProgress(progress)
    
    // Track progress every 25%
    if (progress % 25 === 0) {
      onProgress({
        completion_percentage: progress,
        time_spent: timeSpent
      })
    }
  }

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleQuizComplete = () => {
    if (module.quiz_questions) {
      const correctAnswers = module.quiz_questions.filter(
        (question, index) => quizAnswers[question.id] === question.correct_answer
      ).length
      
      const score = Math.round((correctAnswers / module.quiz_questions.length) * 100)
      
      onProgress({
        completion_percentage: 75,
        time_spent: timeSpent,
        quiz_scores: [{ quiz_id: module.id, score }]
      })
      
      setQuizCompleted(true)
    }
  }

  const handleExerciseComplete = () => {
    setExerciseCompleted(true)
    onProgress({
      completion_percentage: 100,
      time_spent: timeSpent,
      exercises_completed: [module.id]
    })
    onComplete()
  }

  const getContentIcon = () => {
    switch (module.content_type) {
      case 'video': return '🎥'
      case 'article': return '📖'
      case 'interactive': return '🎮'
      case 'quiz': return '❓'
      case 'exercise': return '💪'
      default: return '📚'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'advanced': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getContentIcon()}</div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{module.title}</h1>
                <p className="text-gray-300">{module.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(module.difficulty)}`}>
                {module.difficulty}
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <Clock className="w-4 h-4" />
                <span>{module.duration_minutes}m</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Progress</span>
              <span>{contentProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${contentProgress}%` }}
              />
            </div>
          </div>

          {/* Timer and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeSpent)}</span>
              </div>
              <button
                onClick={handlePlayPause}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'content', label: 'Content', icon: BookOpen },
            ...(module.quiz_questions && module.quiz_questions.length > 0 ? [{ id: 'quiz', label: 'Quiz', icon: Target }] : []),
            ...(module.exercises && module.exercises.length > 0 ? [{ id: 'exercise', label: 'Exercise', icon: Star }] : [])
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = currentSection === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-8"
        >
          {currentSection === 'content' && (
            <ContentSection 
              module={module} 
              onProgress={handleContentProgress}
              isPlaying={isPlaying}
            />
          )}

          {currentSection === 'quiz' && module.quiz_questions && (
            <QuizSection
              questions={module.quiz_questions}
              answers={quizAnswers}
              onAnswer={handleQuizAnswer}
              onComplete={handleQuizComplete}
              completed={quizCompleted}
            />
          )}

          {currentSection === 'exercise' && module.exercises && (
            <ExerciseSection
              exercises={module.exercises}
              onComplete={handleExerciseComplete}
              completed={exerciseCompleted}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

function ContentSection({ module, onProgress, isPlaying }: {
  module: LearningModule
  onProgress: (progress: number) => void
  isPlaying: boolean
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(100, prev + 0.5)
          onProgress(newProgress)
          return newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isPlaying, onProgress])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Learning Content</h2>
      
      {module.content_url ? (
        <div className="mb-6">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎥</div>
              <p className="text-white text-lg">Video Content</p>
              <p className="text-gray-300 text-sm">{module.content_url}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none mb-6">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Module Overview</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {module.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">What you&apos;ll learn:</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Core concepts and principles</li>
                  <li>• Practical applications</li>
                  <li>• Best practices and tips</li>
                  <li>• Common pitfalls to avoid</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Learning objectives:</h4>
                <ul className="text-gray-300 space-y-1">
                  <li>• Understand key concepts</li>
                  <li>• Apply knowledge practically</li>
                  <li>• Demonstrate competency</li>
                  <li>• Build confidence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => onProgress(100)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Mark as Complete
        </button>
      </div>
    </div>
  )
}

function QuizSection({ questions, answers, onAnswer, onComplete, completed }: {
  questions: QuizQuestion[]
  answers: { [questionId: string]: number }
  onAnswer: (questionId: string, answerIndex: number) => void
  onComplete: () => void
  completed: boolean
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const currentQ = questions[currentQuestion]
  const userAnswer = answers[currentQ.id]

  if (completed) {
    const correctAnswers = questions.filter(
      (q, index) => answers[q.id] === q.correct_answer
    ).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-gray-300 text-lg mb-4">Great job on completing the quiz.</p>
        <div className="text-4xl font-bold text-green-400 mb-2">{score}%</div>
        <p className="text-gray-300">You got {correctAnswers} out of {questions.length} questions correct.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Quiz</h2>
        <div className="text-sm text-gray-300">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(currentQ.id, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                userAnswer === index
                  ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                  : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={userAnswer === undefined}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ExerciseSection({ exercises, onComplete, completed }: {
  exercises: any[]
  onComplete: () => void
  completed: boolean
}) {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [exerciseAnswers, setExerciseAnswers] = useState<{ [exerciseId: string]: string }>({})

  const currentEx = exercises[currentExercise]

  if (completed) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Exercise Complete!</h2>
        <p className="text-gray-300 text-lg">Excellent work on completing the exercise.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Exercise</h2>
        <div className="text-sm text-gray-300">
          Exercise {currentExercise + 1} of {exercises.length}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">{currentEx.title}</h3>
        <p className="text-gray-300 mb-4">{currentEx.description}</p>
        
        <div className="bg-white/5 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-white mb-2">Instructions:</h4>
          <p className="text-gray-300">{currentEx.instructions}</p>
        </div>

        <div className="mb-4">
          <label className="block text-white font-medium mb-2">Your Answer:</label>
          <textarea
            value={exerciseAnswers[currentEx.id] || ''}
            onChange={(e) => setExerciseAnswers(prev => ({
              ...prev,
              [currentEx.id]: e.target.value
            }))}
            className="w-full h-32 p-4 bg-black/30 border border-purple-800/30 rounded-lg text-gray-300 placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
            placeholder="Enter your response here..."
          />
        </div>

        {currentEx.hints && currentEx.hints.length > 0 && (
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Hints:</h4>
            <ul className="text-gray-300 space-y-1">
              {currentEx.hints.map((hint: string, index: number) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentExercise(prev => Math.max(0, prev - 1))}
          disabled={currentExercise === 0}
          className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={() => {
            if (currentExercise < exercises.length - 1) {
              setCurrentExercise(prev => prev + 1)
            } else {
              onComplete()
            }
          }}
          disabled={!exerciseAnswers[currentEx.id]}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {currentExercise === exercises.length - 1 ? 'Complete Exercise' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
