import { neon } from '@neondatabase/serverless'

/**
 * Utility function to get Neon database connection
 * Handles build-time scenarios gracefully
 */
export function getNeonConnection(): ReturnType<typeof neon> | null {
  // During build time, return null to prevent build failures
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    console.log('Build time detected, returning mock Neon connection')
    return null
  }

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?')
  }
  return neon(url)
}

/**
 * Safe database query wrapper that handles build-time scenarios
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    // During build time, return fallback value
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return fallbackValue
    }
    
    return await queryFn()
  } catch (error) {
    console.error('Database query failed:', error)
    return fallbackValue
  }
}
