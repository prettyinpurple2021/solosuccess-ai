import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { Pool, PoolClient } from 'pg'


let pool: Pool | null = null

export const createClient = () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('Missing Neon database environment variables. Please set DATABASE_URL')
    }
    
    // Prevent usage in the browser
    if (typeof window !== 'undefined') {
      throw new Error('Database client must not be created in the browser')
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Handle pool errors
    pool.on('error', (err: Error) => {
      logError('Unexpected error on idle client', err)
    })
  }
  
  return pool
}

// Helper function to get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  const pool = createClient()
  return await pool.connect()
}

// Helper function for single queries
export const query = async (text: string, params?: any[]) => {
  const client = await getClient()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

// Default export for backward compatibility
export default createClient
