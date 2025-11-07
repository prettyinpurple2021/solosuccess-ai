import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import * as jose from 'jose'
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
 * JWT authentication utility (Edge-compatible with jose)
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
    
    // Use jose for Edge-compatible JWT verification
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    
    // Type guard to ensure payload has required properties
    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
      return { user: null, error: 'Invalid token' }
    }
    
    logAuth('User authenticated successfully', { userId: payload.userId as string })
    
    // Return standardized user object
    return { 
      user: {
        id: payload.userId as string,
        email: (payload.email as string) || '',
        full_name: (payload.full_name as string) || null,
        avatar_url: (payload.avatar_url as string) || null,
        subscription_tier: (payload.subscription_tier as string) || 'free',
        level: (payload.level as number) || 1,
        total_points: (payload.total_points as number) || 0,
        current_streak: (payload.current_streak as number) || 0,
        wellness_score: (payload.wellness_score as number) || 50,
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

/**
 * Verify document ownership utility
 * Eliminates duplication in document access control
 * 
 * Whitelist of allowed fields to prevent SQL injection
 */
const ALLOWED_DOCUMENT_FIELDS = [
  'id', 'name', 'category', 'tags', 'is_favorite', 
  'file_data', 'file_size', 'mime_type', 'user_id',
  'created_at', 'updated_at'
]

export async function verifyDocumentOwnership(
  documentId: string,
  userId: string,
  selectFields: string = 'id'
): Promise<{ document: any | null; error: string | null }> {
  try {
    // Validate selectFields against whitelist to prevent SQL injection
    const requestedFields = selectFields.split(',').map(f => f.trim())
    const invalidFields = requestedFields.filter(
      field => !ALLOWED_DOCUMENT_FIELDS.includes(field)
    )
    
    if (invalidFields.length > 0) {
      logError('Invalid document fields requested:', invalidFields)
      return { 
        document: null, 
        error: 'Invalid field selection' 
      }
    }
    
    const sql = getSql()
    if (!sql) {
      throw new Error('Database connection not available')
    }
    
    // Safe to use fields now that they're validated
    const query = `SELECT ${selectFields} FROM documents WHERE id = $1 AND user_id = $2`
    const result = await sql(query, [documentId, userId])
    
    if (!result || result.length === 0) {
      return { document: null, error: 'Document not found' }
    }
    
    return { document: result[0], error: null }
  } catch (error) {
    logError('Document verification error:', error)
    return { 
      document: null, 
      error: error instanceof Error ? error.message : 'Failed to verify document' 
    }
  }
}

/**
 * Parse document tags safely
 * Centralized tag parsing logic
 */
export function parseDocumentTags(tagsField: any): string[] {
  if (!tagsField) return []
  try {
    return typeof tagsField === 'string' ? JSON.parse(tagsField) : tagsField
  } catch (error) {
    logError('Failed to parse document tags:', error)
    return []
  }
}

/**
 * Protected document route wrapper
 * Combines authentication and document ownership verification
 */
export function withDocumentAuth(
  handler: (
    request: NextRequest,
    user: any,
    documentId: string,
    context?: any
  ) => Promise<NextResponse>,
  selectFields: string = 'id'
) {
  return withAuth(async (request: NextRequest, user: any, context?: any) => {
    const params = await context.params
    const { id: documentId } = params
    
    if (!documentId) {
      return createErrorResponse('Document ID is required', 400)
    }
    
    const { document, error } = await verifyDocumentOwnership(
      documentId,
      user.id,
      selectFields
    )
    
    if (error || !document) {
      return createErrorResponse(error || 'Document not found', 404)
    }
    
    return handler(request, user, documentId, context)
  })
}