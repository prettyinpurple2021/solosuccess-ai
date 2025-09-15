import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/neon/client'
import { authenticateRequest } from '@/lib/auth-server'
import { TaskIntelligenceEngine, TaskIntelligenceData, TaskOptimizationResult } from '@/lib/ai-task-intelligence'
import { z } from 'zod'

// Input validation schema
const TaskIntelligenceRequestSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    due_date: z.string().optional(),
    estimated_minutes: z.number().optional(),
    goal_id: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']),
    created_at: z.string(),
    updated_at: z.string(),
  })),
  userContext: z.object({
    workStyle: z.enum(['focused', 'collaborative', 'flexible']).optional(),
    preferredWorkHours: z.object({
      start: z.string(),
      end: z.string()
    }).optional(),
    energyPatterns: z.object({
      morning: z.number(),
      afternoon: z.number(),
      evening: z.number()
    }).optional(),
    currentWorkload: z.number().optional(),
    goals: z.array(z.string()).optional()
  }).optional()
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = TaskIntelligenceRequestSchema.parse(body)
    
    // Initialize AI task intelligence engine
    const engine = new TaskIntelligenceEngine(validatedData.userContext)
    
    // Optimize task list using AI
    const optimizationResult: TaskOptimizationResult = await engine.optimizeTaskList(
      validatedData.tasks as TaskIntelligenceData[]
    )

    // Log usage for analytics
    try {
      // Create ai_usage_logs table if it doesn't exist
      await query(`
        CREATE TABLE IF NOT EXISTS ai_usage_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          feature VARCHAR(255) NOT NULL,
          request_type VARCHAR(255) NOT NULL,
          task_count INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `)
      
      await query(`
        INSERT INTO ai_usage_logs (user_id, feature, request_type, task_count, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `, [user.id, 'task_intelligence', 'optimize_tasks', validatedData.tasks.length, new Date()])
    } catch (logError) {
      console.error('Error logging AI usage:', logError)
      // Continue execution even if logging fails
    }

    return NextResponse.json({
      success: true,
      data: optimizationResult,
      meta: {
        tasksAnalyzed: validatedData.tasks.length,
        optimizedAt: new Date().toISOString(),
        confidence: calculateOverallConfidence(optimizationResult.suggestions)
      }
    })

  } catch (error) {
    console.error('Task intelligence error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: error.errors 
        }, 
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process task intelligence request' 
      }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error: authError } = await authenticateRequest()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's recent AI usage stats
    let usageStats = []
    try {
      const result = await query(`
        SELECT * FROM ai_usage_logs
        WHERE user_id = $1 AND feature = $2
        ORDER BY created_at DESC
        LIMIT 10
      `, [user.id, 'task_intelligence'])
      usageStats = result.rows
    } catch (statsError) {
      console.error('Error fetching usage stats:', statsError)
      // Continue execution even if stats fetching fails
    }

    return NextResponse.json({
      success: true,
      data: {
        availableFeatures: [
          'task_prioritization',
          'smart_deadlines', 
          'category_suggestions',
          'workload_analysis',
          'productivity_tips',
          'schedule_optimization'
        ],
        recentUsage: usageStats,
        limits: {
          requestsPerDay: 100,
          tasksPerRequest: 50
        }
      }
    })

  } catch (error) {
    console.error('Task intelligence info error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve task intelligence info' }, 
      { status: 500 }
    )
  }
}

/**
 * Calculate overall confidence score from suggestions
 */
function calculateOverallConfidence(suggestions: TaskOptimizationResult['suggestions']): number {
  if (suggestions.length === 0) return 0
  
  const totalConfidence = suggestions.reduce((sum, suggestion) => sum + suggestion.confidence, 0)
  return Math.round((totalConfidence / suggestions.length) * 100) / 100
}