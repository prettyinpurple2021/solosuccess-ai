import { NextRequest } from 'next/server'
import * as jose from 'jose'
import { logError } from '@/lib/logger'

/**
 * Authenticated user type
 */
export interface AuthenticatedUser {
  id: string
  email: string
  full_name: string | null
  name: string | null
  username: string | null
  created_at: Date
  updated_at: Date
  subscription_tier: string
  subscription_status: string
}

/**
 * Authentication result type
 */
export interface AuthResult {
  user: AuthenticatedUser | null
  error: string | null
}

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
    
    // Verify and decode JWT using jose (Edge Runtime compatible)
    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload.userId as string || null
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

/**
 * Create JWT token for user authentication
 */
export async function createToken(userId: string, email: string): Promise<string> {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
  }
  
  const secret = new TextEncoder().encode(jwtSecret)
  const token = await new jose.SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
  
  return token
}

/**
 * Verify JWT token (alias for getUserIdFromSession for backward compatibility)
 */
export async function verifyToken(request: NextRequest): Promise<string | null> {
  return await getUserIdFromSession(request)
}

/**
 * Cookie options for authentication
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/'
}
