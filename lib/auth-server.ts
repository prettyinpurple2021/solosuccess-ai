import { logger, logError } from '@/lib/logger'
import { NextRequest, NextResponse } from "next/server"
import type { AuthenticatedUser, AuthResult } from "./auth-utils"
import { headers } from "next/headers"
import * as jose from 'jose'
import { getDb } from './database-client'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Verify a JWT token and return the payload if valid
 */
export async function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload
  } catch (err) {
    return null
  }
}

async function getJWTAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')

    let token: string | null = null

    // Try to get token from Authorization header first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Fallback to cookie
      const cookieHeader = headersList.get('cookie')
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=')
          acc[name] = value
          return acc
        }, {} as Record<string, string>)

        token = cookies.auth_token || null
      }
    }

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)

    if (!payload || !payload.userId) {
      return null
    }

    // Get user from database using Drizzle ORM
    const db = getDb()
    const userResults = await db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        username: users.username,
        date_of_birth: users.date_of_birth,
        created_at: users.created_at,
        updated_at: users.updated_at,
        subscription_tier: users.subscription_tier,
        subscription_status: users.subscription_status,
        avatar_url: users.avatar_url,
        stripe_customer_id: users.stripe_customer_id
      })
      .from(users)
      .where(eq(users.id, payload.userId as string))
      .limit(1)

    if (userResults.length === 0) {
      return null
    }

    const user = userResults[0]

    // Map database user to our AuthenticatedUser shape
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      name: user.full_name,
      username: user.username,
      avatar_url: user.avatar_url,
      created_at: user.created_at ?? new Date(),
      updated_at: user.updated_at ?? new Date(),
      subscription_tier: (user.subscription_tier ?? 'free') as string,
      subscription_status: (user.subscription_status ?? 'active') as string,
      stripe_customer_id: user.stripe_customer_id,
    }
  } catch (err) {
    logError('JWT authentication error:', err)
    return null
  }
}

/**
 * Server-side authentication utility for API routes.
 * Uses JWT-based authentication.
 */
export async function authenticateRequest(): Promise<AuthResult> {
  try {
    const jwtUser = await getJWTAuthenticatedUser()

    if (jwtUser) {
      return { user: jwtUser, error: null }
    } else {
      return { user: null, error: "No authenticated user session found" }
    }
  } catch (authError) {
    logError("Authentication error:", authError)
    return { user: null, error: "Authentication failed" }
  }
}

/**
 * Alternative authentication function for compatibility with collaboration APIs
 * Returns user and error in a single object
 */
export async function verifyAuth(request?: NextRequest): Promise<{ user?: AuthenticatedUser; error?: string }> {
  try {
    const result = await authenticateRequest()
    return {
      user: result.user || undefined,
      error: result.error || undefined
    }
  } catch (error) {
    logError('verifyAuth error:', error)
    return { error: 'Authentication failed' }
  }
}

/**
 * Middleware-style authentication wrapper for API route handlers
 */
export function withAuth<T>(
  handler: (_req: NextRequest, _user: AuthenticatedUser) => Promise<T>
) {
  return async (req: NextRequest): Promise<T | NextResponse> => {
    const { user, error } = await authenticateRequest()
    if (error) {
      return NextResponse.json({ error }, { status: 401 })
    }
    return handler(req, user!)
  }
}
