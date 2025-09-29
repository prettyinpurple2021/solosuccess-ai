import { neon } from '@neondatabase/serverless'
import { logError, logInfo } from '@/lib/logger'

/**
 * Utility function to get Neon database connection
 * Handles build-time scenarios gracefully
 */
export function getNeonConnection(): ReturnType<typeof neon> | null {
  // Prevent accidental DB usage during build
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    throw new Error('Database connection is not available during build time')
  }

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?')
  }
  const conn = neon(url)
  logInfo('Neon connection created')
  return conn
}

/**
 * Safe database query wrapper that handles build-time scenarios
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  try {
    // Run query (no build-time fallbacks)
    return await queryFn()
  } catch (error) {
    logError('Database query failed:', error)
    return fallbackValue
  }
}
