import { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'
import { logError } from '@/lib/logger'

/**
 * Extract user ID from JWT session token
 */
export async function getUserIdFromSession(request: NextRequest): Promise<string | null> {
  try {
    // Try to get session token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    let token: string | undefined
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Try to get from cookie
      const cookies = request.cookies
      token = cookies.get('session')?.value
    }
    
    if (!token) {
      return null
    }
    
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      logError('JWT_SECRET is not configured')
      return null
    }
    
    // Verify and decode JWT
    const decoded = verify(token, jwtSecret) as { userId: string }
    return decoded.userId || null
  } catch (error) {
    logError('Error extracting user ID from session:', error)
    return null
  }
}

/**
 * Extract user ID from request (supports both JWT and simple user ID header)
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  // First try JWT session
  const userId = await getUserIdFromSession(request)
  if (userId) return userId
  
  // Fallback to user-id header (for development/testing)
  const userIdHeader = request.headers.get('x-user-id')
  if (userIdHeader) return userIdHeader
  
  return null
}
