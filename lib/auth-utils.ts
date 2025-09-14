import { sign, verify } from "jsonwebtoken"

export interface AuthenticatedUser {
  id: string
  email: string
  full_name?: string
  name?: string
  username?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
  subscription_tier?: string
  subscription_status?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  current_period_start?: Date
  current_period_end?: Date
  cancel_at_period_end?: boolean
}

export interface AuthResult {
  user: AuthenticatedUser | null
  error: string | null
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * Standard cookie options for authentication tokens
 * Used for consistency across all auth-related routes
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/',
}

/**
 * Creates a JWT token for authentication
 */
export function createToken(userId: string, email: string): string {
  return sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' })
}

/**
 * Verifies a JWT token and returns the decoded payload
 */
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string; email: string }
    return decoded
  } catch {
    return null
  }
}