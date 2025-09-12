// lib/auth-server.ts

import { NextRequest, NextResponse } from "next/server"
import type { AuthenticatedUser, AuthResult } from "./auth-utils"
import { headers } from "next/headers"
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

async function getJWTAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    if (!decoded || !decoded.userId) {
      return null
    }

    // Get user from database
    const sql = getSql()
    const users = await sql`
      SELECT id, email, full_name, username, date_of_birth, created_at, updated_at
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return null
    }

    const user = users[0]

    // Map database user to our AuthenticatedUser shape
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      name: user.full_name,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at,
      subscription_tier: undefined,
      subscription_status: undefined,
    }
  } catch (err) {
    console.error('JWT authentication error:', err)
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
    console.error("Authentication error:", authError)
    return { user: null, error: "Authentication failed" }
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