import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'
import { logger, logError, logAuth } from '@/lib/logger'

/**
 * Centralized database connection utility
 * Eliminates duplication across API routes
 */
export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

/**
 * Standardized error response utility
 * Eliminates duplication in error handling
 */
export function createErrorResponse(
  message: string, 
  status: number = 500, 
  details?: any
) {
  logError(`API Error (${status}): ${message}`, details)
  return NextResponse.json(
    { 
      error: message,
      ...(details && { details })
    },
    { status }
  )
}

/**
 * Standardized success response utility
 */
export function createSuccessResponse(
  data: any, 
  message?: string, 
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      ...data
    },
    { status }
  )
}

/**
 * JWT authentication utility
 * Eliminates duplication across protected routes
 */
export async function authenticateRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { user: null, error: 'Authorization header required' }
    }

    const token = authHeader.substring(7)
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured')
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Type guard to ensure decoded has required properties
    if (!decoded || typeof decoded !== 'object' || !('userId' in decoded)) {
      return { user: null, error: 'Invalid token' }
    }
    
    logAuth('User authenticated successfully', { userId: (decoded as any).userId })
    
    // Return standardized user object
    return { 
      user: {
        id: (decoded as any).userId,
        email: (decoded as any).email,
        full_name: (decoded as any).full_name || null,
        avatar_url: (decoded as any).avatar_url || null,
        subscription_tier: (decoded as any).subscription_tier || 'free',
        level: (decoded as any).level || 1,
        total_points: (decoded as any).total_points || 0,
        current_streak: (decoded as any).current_streak || 0,
        wellness_score: (decoded as any).wellness_score || 50,
      },
      error: null
    }
  } catch (error) {
    logError('JWT authentication failed:', error)
    return { 
      user: null, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    }
  }
}

/**
 * Validate required fields utility
 * Eliminates duplication in input validation
 */
export function validateRequiredFields(
  data: Record<string, any>, 
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter(field => 
    !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
  )
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Standardized request body parser with validation
 */
export async function parseRequestBody(
  request: NextRequest,
  requiredFields: string[] = []
) {
  try {
    const body = await request.json()
    
    if (requiredFields.length > 0) {
      const validation = validateRequiredFields(body, requiredFields)
      if (!validation.isValid) {
        return {
          data: null,
          error: `Missing required fields: ${validation.missingFields.join(', ')}`
        }
      }
    }
    
    return { data: body, error: null }
  } catch (error) {
    return {
      data: null,
      error: 'Invalid JSON in request body'
    }
  }
}

/**
 * Database query wrapper with error handling
 * Eliminates duplication in database operations
 */
export async function executeQuery<T = any>(
  queryFn: () => Promise<T>,
  errorMessage: string = 'Database query failed'
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await queryFn()
    return { data, error: null }
  } catch (error) {
    logError(errorMessage, error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : errorMessage 
    }
  }
}

/**
 * Generate UUID utility
 * Centralized UUID generation
 */
export function generateUUID(): string {
  return crypto.randomUUID()
}

/**
 * Standardized pagination utility
 */
export function parsePaginationParams(request: NextRequest) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const offset = (page - 1) * limit
  
  return { page, limit, offset }
}

/**
 * Common API route wrapper
 * Eliminates duplication in route structure and error handling
 */
export function withApiHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      logError('Unhandled API error:', error)
      return createErrorResponse(
        'Internal server error',
        500,
        process.env.NODE_ENV === 'development' ? error : undefined
      )
    }
  }
}

/**
 * Protected route wrapper
 * Eliminates duplication in authentication checks
 */
export function withAuth(
  handler: (request: NextRequest, user: any, context?: any) => Promise<NextResponse>
) {
  return withApiHandler(async (request: NextRequest, context?: any) => {
    const { user, error } = await authenticateRequest(request)
    
    if (!user || error) {
      return createErrorResponse(error || 'Authentication required', 401)
    }
    
    return handler(request, user, context)
  })
}