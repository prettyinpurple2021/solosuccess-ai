// @ts-nocheck
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, CheckCircle, ArrowRight, Star } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  description: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
}

interface SkillAssessmentProps {
  skills: Skill[]
  onComplete: (assessments: Array<{
    skill_id: string
    current_level: number
    confidence_score: number
    assessment_method: 'self_evaluation'
  }>) => void
}

export default function SkillAssessment({ skills, onComplete }: SkillAssessmentProps) {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [assessments, setAssessments] = useState<Array<{
    skill_id: string
    current_level: number
    confidence_score: number
    assessment_method: 'self_evaluation'
  }>>([])
  const [isComplete, setIsComplete] = useState(false)

  const currentSkill = skills[currentSkillIndex]

  const handleAssessment = (level: number, confidence: number) => {
    const newAssessment = {
      skill_id: currentSkill.id,
      current_level: level,
      confidence_score: confidence,
      assessment_method: 'self_evaluation' as const
    }

    setAssessments(prev => [...prev.filter(a => a.skill_id !== currentSkill.id), newAssessment])
  }

  const handleNext = () => {
    if (currentSkillIndex < skills.length - 1) {
      setCurrentSkillIndex(prev => prev + 1)
    } else {
      setIsComplete(true)
      onComplete(assessments)
    }
  }

  const handlePrevious = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex(prev => prev - 1)
    }
  }

  const getCurrentAssessment = () => {
    return assessments.find(a => a.skill_id === currentSkill.id)
  }

  const getLevelDescription = (level: number) => {
    if (level <= 20) return 'Beginner - Just starting out'
    if (level <= 40) return 'Novice - Basic understanding'
    if (level <= 60) return 'Intermediate - Comfortable with basics'
    if (level <= 80) return 'Advanced - Strong skills'
    return 'Expert - Mastery level'
  }

  const getConfidenceDescription = (confidence: number) => {
    if (confidence <= 20) return 'Very uncertain'
    if (confidence <= 40) return 'Somewhat uncertain'
    if (confidence <= 60) return 'Moderately confident'
    if (confidence <= 80) return 'Very confident'
    return 'Extremely confident'
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Assessment Complete!
            </h2>
            
            <p className="text-gray-300 text-lg mb-8">
              Thank you for completing the skill assessment. We&apos;ll use this information to create personalized learning recommendations for you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">{skills.length}</div>
                <div className="text-gray-300 text-sm">Skills Assessed</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {Math.round(assessments.reduce((sum, a) => sum + a.current_level, 0) / assessments.length)}%
                </div>
                <div className="text-gray-300 text-sm">Average Level</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {Math.round(assessments.reduce((sum, a) => sum + a.confidence_score, 0) / assessments.length)}%
                </div>
                <div className="text-gray-300 text-sm">Average Confidence</div>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/dashboard/learning'}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              View Learning Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Skill Assessment Progress</span>
            <span>{currentSkillIndex + 1} of {skills.length}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSkillIndex + 1) / skills.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Skill Card */}
        <motion.div
          key={currentSkill.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{currentSkill.name}</h2>
              <p className="text-gray-300">{currentSkill.category} • {currentSkill.difficulty_level}</p>
            </div>
          </div>

          <p className="text-gray-300 text-lg mb-8">{currentSkill.description}</p>

          {/* Current Level Assessment */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              What&apos;s your current skill level?
            </h3>
            
            <div className="grid grid-cols-5 gap-3">
              {[0, 25, 50, 75, 100].map((level) => {
                const currentAssessment = getCurrentAssessment()
                const isSelected = currentAssessment?.current_level === level
                
                return (
                  <button
                    key={level}
                    onClick={() => handleAssessment(level, currentAssessment?.confidence_score || 50)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                        : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{level}%</div>
                    <div className="text-xs">{getLevelDescription(level)}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Confidence Level Assessment */}
          {getCurrentAssessment() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                How confident are you in this assessment?
              </h3>
              
              <div className="grid grid-cols-5 gap-3">
                {[0, 25, 50, 75, 100].map((confidence) => {
                  const currentAssessment = getCurrentAssessment()
                  const isSelected = currentAssessment?.confidence_score === confidence
                  
                  return (
                    <button
                      key={confidence}
                      onClick={() => handleAssessment(
                        currentAssessment?.current_level || 0, 
                        confidence
                      )}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                          : 'border-gray-600 bg-white/5 text-gray-300 hover:border-gray-500 hover:text-white'
                      }`}
                    >
                      <div className="text-2xl font-bold mb-1">{confidence}%</div>
                      <div className="text-xs">{getConfidenceDescription(confidence)}</div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Current Assessment Summary */}
          {getCurrentAssessment() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg p-4 mb-8"
            >
              <h4 className="text-lg font-semibold text-white mb-2">Your Assessment:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-300">Current Level</div>
                  <div className="text-lg font-semibold text-blue-400">
                    {getCurrentAssessment()?.current_level}% - {getLevelDescription(getCurrentAssessment()?.current_level || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Confidence</div>
                  <div className="text-lg font-semibold text-yellow-400">
                    {getCurrentAssessment()?.confidence_score}% - {getConfidenceDescription(getCurrentAssessment()?.confidence_score || 0)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentSkillIndex === 0}
            className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!getCurrentAssessment()}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentSkillIndex === skills.length - 1 ? 'Complete Assessment' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
