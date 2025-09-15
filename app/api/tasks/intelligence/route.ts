import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { TaskIntelligenceEngine, TaskIntelligenceData, TaskOptimizationResult } from '@/lib/ai-task-intelligence'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
    // Get user from session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
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
    await supabase
      .from('ai_usage_logs')
      .insert({
        user_id: user.id,
        feature: 'task_intelligence',
        request_type: 'optimize_tasks',
        task_count: validatedData.tasks.length,
        created_at: new Date().toISOString()
      })

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
    // Get user from session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user's recent AI usage stats
    const { data: usageStats, error: statsError } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('feature', 'task_intelligence')
      .order('created_at', { ascending: false })
      .limit(10)

    if (statsError) {
      console.error('Error fetching usage stats:', statsError)
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
        recentUsage: usageStats || [],
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