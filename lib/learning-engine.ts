import { neon } from '@neondatabase/serverless'
import { logInfo, logError } from '@/lib/logger'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number // in minutes
  prerequisites: string[]
  learning_objectives: string[]
}

export interface LearningModule {
  id: string
  title: string
  description: string
  skill_id: string
  content_type: 'video' | 'article' | 'interactive' | 'quiz' | 'exercise'
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content_url?: string
  quiz_questions?: QuizQuestion[]
  exercises?: Exercise[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface Exercise {
  id: string
  title: string
  description: string
  instructions: string
  expected_output?: string
  hints: string[]
}

export interface UserSkillAssessment {
  skill_id: string
  current_level: number // 0-100
  confidence_score: number // 0-100
  last_assessed: Date
  assessment_method: 'quiz' | 'self_evaluation' | 'performance' | 'peer_review'
}

export interface LearningPath {
  id: string
  title: string
  description: string
  target_role: string
  estimated_duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  skills: string[]
  modules: string[]
  prerequisites: string[]
}

export interface UserProgress {
  module_id: string
  completion_percentage: number
  time_spent: number
  last_accessed: Date
  quiz_scores: { quiz_id: string; score: number; attempts: number }[]
  exercises_completed: string[]
}

export interface LearningRecommendation {
  module_id: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  estimated_impact: number
  prerequisites_met: boolean
}

export class LearningEngine {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Analyze user's skill gaps based on their goals, tasks, and current skill assessments
   */
  async analyzeSkillGaps(): Promise<{
    skill_gaps: Array<{
      skill: Skill
      gap_score: number
      priority: 'high' | 'medium' | 'low'
      recommended_modules: LearningModule[]
    }>
    overall_readiness: number
    recommended_path: LearningPath | null
  }> {
    try {
      logInfo('Analyzing skill gaps for user', { userId: this.userId })

      // Get user's current goals and tasks to understand their focus areas
      const sql = getSql()
      const userGoals = await sql`
        SELECT g.title, g.description, g.category, g.target_date
        FROM goals g
        WHERE g.user_id = ${this.userId} AND g.status = 'active'
        ORDER BY g.created_at DESC
        LIMIT 10
      `

      const userTasks = await sql`
        SELECT t.title, t.description, t.priority, t.status
        FROM tasks t
        WHERE t.user_id = ${this.userId}
        ORDER BY t.created_at DESC
        LIMIT 50
      `

      // Get user's current skill assessments
      const userSkills = await this.getUserSkillAssessments()

      // Get all available skills
      const allSkills = await this.getAllSkills()

      // Analyze skill gaps based on goals and tasks
      const skillGaps = await this.calculateSkillGaps(userGoals, userTasks, userSkills, allSkills)

      // Get overall readiness score
      const overallReadiness = this.calculateOverallReadiness(userSkills)

      // Recommend a learning path
      const recommendedPath = await this.recommendLearningPath(skillGaps, userGoals)

      return {
        skill_gaps: skillGaps,
        overall_readiness: overallReadiness,
        recommended_path: recommendedPath
      }
    } catch (error) {
      logError('Error analyzing skill gaps', { userId: this.userId, error })
      throw error
    }
  }

  /**
   * Get personalized learning recommendations based on user's skill gaps and interests
   */
  async getPersonalizedRecommendations(): Promise<LearningRecommendation[]> {
    try {
      logInfo('Getting personalized learning recommendations', { userId: this.userId })

      const skillGapAnalysis = await this.analyzeSkillGaps()
      const userProgress = await this.getUserProgress()

      const recommendations: LearningRecommendation[] = []

      // Generate recommendations based on skill gaps
      for (const gap of skillGapAnalysis.skill_gaps) {
        for (const learningModule of gap.recommended_modules) {
          // Check if user has already completed this module
          const progress = userProgress.find(p => p.module_id === learningModule.id)
          if (progress && progress.completion_percentage >= 100) {
            continue
          }

          // Check prerequisites
          const prerequisitesMet = await this.checkPrerequisites(learningModule.id)

          recommendations.push({
            module_id: learningModule.id,
            reason: `Addresses ${gap.skill.name} skill gap (${gap.gap_score}% gap)`,
            priority: gap.priority,
            estimated_impact: gap.gap_score,
            prerequisites_met: prerequisitesMet
          })
        }
      }

      // Sort by priority and impact
      return recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        return b.estimated_impact - a.estimated_impact
      })
    } catch (error) {
      logError('Error getting personalized recommendations', { userId: this.userId, error })
      throw error
    }
  }

  /**
   * Track user progress in a learning module
   */
  async trackProgress(moduleId: string, progressData: {
    completion_percentage: number
    time_spent: number
    quiz_scores?: { quiz_id: string; score: number }[]
    exercises_completed?: string[]
  }): Promise<void> {
    try {
      logInfo('Tracking learning progress', { userId: this.userId, moduleId, progressData })

      // Update or insert progress record
      const sql = getSql()
      await sql`
        INSERT INTO user_learning_progress (
          user_id, module_id, completion_percentage, time_spent, 
          last_accessed, quiz_scores, exercises_completed
        ) VALUES (
          ${this.userId}, ${moduleId}, ${progressData.completion_percentage}, 
          ${progressData.time_spent}, NOW(), 
          ${JSON.stringify(progressData.quiz_scores || [])},
          ${JSON.stringify(progressData.exercises_completed || [])}
        )
        ON CONFLICT (user_id, module_id) 
        DO UPDATE SET
          completion_percentage = ${progressData.completion_percentage},
          time_spent = user_learning_progress.time_spent + ${progressData.time_spent},
          last_accessed = NOW(),
          quiz_scores = ${JSON.stringify(progressData.quiz_scores || [])},
          exercises_completed = ${JSON.stringify(progressData.exercises_completed || [])}
      `
    } catch (error) {
      logError('Error tracking learning progress', { userId: this.userId, moduleId, error })
      throw error
    }
  }

  /**
   * Get user's learning progress across all modules
   */
  async getUserProgress(): Promise<UserProgress[]> {
    try {
      const sql = getSql()
      const progress = await sql`
        SELECT 
          module_id, completion_percentage, time_spent, last_accessed,
          quiz_scores, exercises_completed
        FROM user_learning_progress
        WHERE user_id = ${this.userId}
      `

      return progress.map((p: any) => ({
        module_id: p.module_id,
        completion_percentage: p.completion_percentage,
        time_spent: p.time_spent,
        last_accessed: p.last_accessed,
        quiz_scores: p.quiz_scores || [],
        exercises_completed: p.exercises_completed || []
      }))
    } catch (error) {
      logError('Error getting user progress', { userId: this.userId, error })
      return []
    }
  }

  /**
   * Get all available skills
   */
  private async getAllSkills(): Promise<Skill[]> {
    try {
      const sql = getSql()
      const skills = await sql`
        SELECT id, name, category, description, difficulty_level, 
               estimated_duration, prerequisites, learning_objectives
        FROM skills
        ORDER BY category, difficulty_level
      `

      return skills.map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        description: s.description,
        difficulty_level: s.difficulty_level,
        estimated_duration: s.estimated_duration,
        prerequisites: s.prerequisites || [],
        learning_objectives: s.learning_objectives || []
      }))
    } catch (error) {
      logError('Error getting all skills', { userId: this.userId, error })
      return []
    }
  }

  /**
   * Get user's current skill assessments
   */
  private async getUserSkillAssessments(): Promise<UserSkillAssessment[]> {
    try {
      const sql = getSql()
      const assessments = await sql`
        SELECT skill_id, current_level, confidence_score, last_assessed, assessment_method
        FROM user_skill_assessments
        WHERE user_id = ${this.userId}
      `

      return assessments.map((a: any) => ({
        skill_id: a.skill_id,
        current_level: a.current_level,
        confidence_score: a.confidence_score,
        last_assessed: a.last_assessed,
        assessment_method: a.assessment_method
      }))
    } catch (error) {
      logError('Error getting user skill assessments', { userId: this.userId, error })
      return []
    }
  }

  /**
   * Get available learning modules
   */
  private async getAvailableModules(): Promise<LearningModule[]> {
    try {
      const sql = getSql()
      const modules = await sql`
        SELECT id, title, description, skill_id, content_type, duration_minutes,
               difficulty, content_url, quiz_questions, exercises
        FROM learning_modules
        ORDER BY difficulty, duration_minutes
      `

      return modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        skill_id: m.skill_id,
        content_type: m.content_type,
        duration_minutes: m.duration_minutes,
        difficulty: m.difficulty,
        content_url: m.content_url,
        quiz_questions: m.quiz_questions || [],
        exercises: m.exercises || []
      }))
    } catch (error) {
      logError('Error getting available modules', { userId: this.userId, error })
      return []
    }
  }

  /**
   * Calculate skill gaps based on user goals, tasks, and current assessments
   */
  private async calculateSkillGaps(
    userGoals: any[],
    userTasks: any[],
    userSkills: UserSkillAssessment[],
    allSkills: Skill[]
  ): Promise<Array<{
    skill: Skill
    gap_score: number
    priority: 'high' | 'medium' | 'low'
    recommended_modules: LearningModule[]
  }>> {
    const skillGaps = []

    for (const skill of allSkills) {
      // Find user's current level for this skill
      const userSkill = userSkills.find(s => s.skill_id === skill.id)
      const currentLevel = userSkill?.current_level || 0

      // Calculate required level based on goals and tasks
      const requiredLevel = this.calculateRequiredSkillLevel(skill, userGoals, userTasks)
      
      const gapScore = Math.max(0, requiredLevel - currentLevel)

      if (gapScore > 20) { // Only include significant gaps
        const priority: 'high' | 'medium' | 'low' = gapScore > 60 ? 'high' : gapScore > 30 ? 'medium' : 'low'
        
        // Get recommended modules for this skill
        const recommendedModules = await this.getModulesForSkill(skill.id)

        skillGaps.push({
          skill,
          gap_score: gapScore,
          priority,
          recommended_modules: recommendedModules
        })
      }
    }

    return skillGaps.sort((a, b) => b.gap_score - a.gap_score)
  }

  /**
   * Calculate required skill level based on user's goals and tasks
   */
  private calculateRequiredSkillLevel(skill: Skill, userGoals: any[], userTasks: any[]): number {
    let requiredLevel = 30 // Base level

    // Check if skill is mentioned in goals
    for (const goal of userGoals) {
      if (goal.title?.toLowerCase().includes(skill.name.toLowerCase()) ||
          goal.description?.toLowerCase().includes(skill.name.toLowerCase())) {
        requiredLevel += 30
      }
    }

    // Check if skill is mentioned in tasks
    for (const task of userTasks) {
      if (task.title?.toLowerCase().includes(skill.name.toLowerCase()) ||
          task.description?.toLowerCase().includes(skill.name.toLowerCase())) {
        requiredLevel += 10
      }
    }

    // Adjust based on skill difficulty
    switch (skill.difficulty_level) {
      case 'advanced':
        requiredLevel += 20
        break
      case 'intermediate':
        requiredLevel += 10
        break
    }

    return Math.min(100, requiredLevel)
  }

  /**
   * Calculate overall readiness score
   */
  private calculateOverallReadiness(userSkills: UserSkillAssessment[]): number {
    if (userSkills.length === 0) return 0

    const totalScore = userSkills.reduce((sum, skill) => sum + skill.current_level, 0)
    return Math.round(totalScore / userSkills.length)
  }

  /**
   * Recommend a learning path based on skill gaps
   */
  private async recommendLearningPath(
    skillGaps: Array<{ skill: Skill; gap_score: number; priority: string; recommended_modules: LearningModule[] }>,
    userGoals: any[]
  ): Promise<LearningPath | null> {
    try {
      // Get learning paths that match user's goals
      const sql = getSql()
      const learningPaths = await sql`
        SELECT id, title, description, target_role, estimated_duration,
               difficulty, skills, modules, prerequisites
        FROM learning_paths
        WHERE target_role IN (
          SELECT DISTINCT category FROM goals 
          WHERE user_id = ${this.userId} AND status = 'active'
        )
        ORDER BY estimated_duration
      `

      if (learningPaths.length === 0) return null

      // Find the best matching path based on skill gaps
      let bestPath = null
      let bestScore = 0

      for (const path of learningPaths) {
        const pathSkills = path.skills || []
        const matchingGaps = skillGaps.filter(gap => 
          pathSkills.includes(gap.skill.id)
        )
        
        const matchScore = matchingGaps.reduce((sum, gap) => sum + gap.gap_score, 0)
        
        if (matchScore > bestScore) {
          bestScore = matchScore
          bestPath = {
            id: path.id,
            title: path.title,
            description: path.description,
            target_role: path.target_role,
            estimated_duration: path.estimated_duration,
            difficulty: path.difficulty,
            skills: pathSkills,
            modules: path.modules || [],
            prerequisites: path.prerequisites || []
          }
        }
      }

      return bestPath
    } catch (error) {
      logError('Error recommending learning path', { userId: this.userId, error })
      return null
    }
  }

  /**
   * Get modules for a specific skill
   */
  private async getModulesForSkill(skillId: string): Promise<LearningModule[]> {
    try {
      const sql = getSql()
      const modules = await sql`
        SELECT id, title, description, skill_id, content_type, duration_minutes,
               difficulty, content_url, quiz_questions, exercises
        FROM learning_modules
        WHERE skill_id = ${skillId}
        ORDER BY difficulty, duration_minutes
      `

      return modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        skill_id: m.skill_id,
        content_type: m.content_type,
        duration_minutes: m.duration_minutes,
        difficulty: m.difficulty,
        content_url: m.content_url,
        quiz_questions: m.quiz_questions || [],
        exercises: m.exercises || []
      }))
    } catch (error) {
      logError('Error getting modules for skill', { skillId, error })
      return []
    }
  }

  /**
   * Check if prerequisites are met for a module
   */
  private async checkPrerequisites(moduleId: string): Promise<boolean> {
    try {
      const sql = getSql()
      const learningModule = await sql`
        SELECT prerequisites FROM learning_modules WHERE id = ${moduleId}
      `

      if (!learningModule[0]?.prerequisites) return true

      const prerequisites = learningModule[0].prerequisites
      const userProgress = await this.getUserProgress()

      for (const prereqModuleId of prerequisites) {
        const progress = userProgress.find(p => p.module_id === prereqModuleId)
        if (!progress || progress.completion_percentage < 100) {
          return false
        }
      }

      return true
    } catch (error) {
      logError('Error checking prerequisites', { moduleId, error })
      return false
    }
  }

  /**
   * Create a skill assessment for the user
   */
  async createSkillAssessment(skillId: string, assessmentData: {
    current_level: number
    confidence_score: number
    assessment_method: 'quiz' | 'self_evaluation' | 'performance' | 'peer_review'
  }): Promise<void> {
    try {
      logInfo('Creating skill assessment', { userId: this.userId, skillId, assessmentData })

      const sql = getSql()
      await sql`
        INSERT INTO user_skill_assessments (
          user_id, skill_id, current_level, confidence_score, 
          last_assessed, assessment_method
        ) VALUES (
          ${this.userId}, ${skillId}, ${assessmentData.current_level}, 
          ${assessmentData.confidence_score}, NOW(), ${assessmentData.assessment_method}
        )
        ON CONFLICT (user_id, skill_id) 
        DO UPDATE SET
          current_level = ${assessmentData.current_level},
          confidence_score = ${assessmentData.confidence_score},
          last_assessed = NOW(),
          assessment_method = ${assessmentData.assessment_method}
      `
    } catch (error) {
      logError('Error creating skill assessment', { userId: this.userId, skillId, error })
      throw error
    }
  }

  /**
   * Get learning analytics for the user
   */
  async getLearningAnalytics(): Promise<{
    total_modules_completed: number
    total_time_spent: number
    average_quiz_score: number
    skills_improved: number
    current_streak: number
    learning_velocity: number
    top_categories: Array<{ category: string; time_spent: number; modules_completed: number }>
  }> {
    try {
      const progress = await this.getUserProgress()
      const userSkills = await this.getUserSkillAssessments()

      const totalModulesCompleted = progress.filter(p => p.completion_percentage >= 100).length
      const totalTimeSpent = progress.reduce((sum, p) => sum + p.time_spent, 0)
      
      const allQuizScores = progress.flatMap(p => p.quiz_scores.map(q => q.score))
      const averageQuizScore = allQuizScores.length > 0 
        ? allQuizScores.reduce((sum, score) => sum + score, 0) / allQuizScores.length 
        : 0

      const skillsImproved = userSkills.filter(s => s.current_level > 30).length

      // Calculate learning streak (consecutive days with learning activity)
      const currentStreak = await this.calculateLearningStreak()

      // Calculate learning velocity (modules completed per week)
      const learningVelocity = await this.calculateLearningVelocity()

      // Get top learning categories
      const topCategories = await this.getTopLearningCategories()

      return {
        total_modules_completed: totalModulesCompleted,
        total_time_spent: totalTimeSpent,
        average_quiz_score: Math.round(averageQuizScore),
        skills_improved: skillsImproved,
        current_streak: currentStreak,
        learning_velocity: learningVelocity,
        top_categories: topCategories
      }
    } catch (error) {
      logError('Error getting learning analytics', { userId: this.userId, error })
      return {
        total_modules_completed: 0,
        total_time_spent: 0,
        average_quiz_score: 0,
        skills_improved: 0,
        current_streak: 0,
        learning_velocity: 0,
        top_categories: []
      }
    }
  }

  /**
   * Calculate learning streak
   */
  private async calculateLearningStreak(): Promise<number> {
    try {
      const sql = getSql()
      const learningDays = await sql`
        SELECT DATE(last_accessed) as learning_date
        FROM user_learning_progress
        WHERE user_id = ${this.userId}
          AND last_accessed >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(last_accessed)
        ORDER BY learning_date DESC
      `

      let streak = 0
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)

      for (const day of learningDays) {
        const learningDate = new Date(day.learning_date)
        learningDate.setHours(0, 0, 0, 0)
        
        const diffTime = currentDate.getTime() - learningDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === streak) {
          streak++
        } else {
          break
        }
        
        currentDate.setDate(currentDate.getDate() - 1)
      }

      return streak
    } catch (error) {
      logError('Error calculating learning streak', { userId: this.userId, error })
      return 0
    }
  }

  /**
   * Calculate learning velocity
   */
  private async calculateLearningVelocity(): Promise<number> {
    try {
      const sql = getSql()
      const recentProgress = await sql`
        SELECT completion_percentage, last_accessed
        FROM user_learning_progress
        WHERE user_id = ${this.userId}
          AND last_accessed >= CURRENT_DATE - INTERVAL '7 days'
          AND completion_percentage >= 100
      `

      return recentProgress.length
    } catch (error) {
      logError('Error calculating learning velocity', { userId: this.userId, error })
      return 0
    }
  }

  /**
   * Get top learning categories
   */
  private async getTopLearningCategories(): Promise<Array<{ category: string; time_spent: number; modules_completed: number }>> {
    try {
      const sql = getSql()
      const categories = await sql`
        SELECT 
          s.category,
          SUM(ulp.time_spent) as time_spent,
          COUNT(CASE WHEN ulp.completion_percentage >= 100 THEN 1 END) as modules_completed
        FROM user_learning_progress ulp
        JOIN learning_modules lm ON ulp.module_id = lm.id
        JOIN skills s ON lm.skill_id = s.id
        WHERE ulp.user_id = ${this.userId}
        GROUP BY s.category
        ORDER BY time_spent DESC
        LIMIT 5
      `

      return categories.map((c: any) => ({
        category: c.category,
        time_spent: c.time_spent || 0,
        modules_completed: c.modules_completed || 0
      }))
    } catch (error) {
      logError('Error getting top learning categories', { userId: this.userId, error })
      return []
    }
  }
}
