import { Redis } from '@upstash/redis'
import { Client as QStashClient, Receiver as QStashReceiver } from '@upstash/qstash'
import { logError } from '@/lib/logger'

type RedisClient = Redis

let redisClient: RedisClient | null = null
let qstashClient: QStashClient | null = null
let qstashReceiver: QStashReceiver | null = null

function assertEnvVar(name: string): string {
  const value = process.env[name]
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getRedisClient(): RedisClient {
  if (!redisClient) {
    try {
      redisClient = Redis.fromEnv()
    } catch (error) {
      logError('Failed to initialize Upstash Redis client', error)
      throw error
    }
  }
  return redisClient
}

export function getQStashClient(): QStashClient {
  if (!qstashClient) {
    try {
      qstashClient = new QStashClient({
        token: assertEnvVar('QSTASH_TOKEN'),
      })
    } catch (error) {
      logError('Failed to initialize Upstash QStash client', error)
      throw error
    }
  }
  return qstashClient
}

export function getQStashReceiver(): QStashReceiver {
  if (!qstashReceiver) {
    try {
      const currentSigningKey = assertEnvVar('QSTASH_CURRENT_SIGNING_KEY')
      const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY ?? currentSigningKey

      qstashReceiver = new QStashReceiver({
        currentSigningKey,
        nextSigningKey,
      })
    } catch (error) {
      logError('Failed to initialize Upstash QStash receiver', error)
      throw error
    }
  }
  return qstashReceiver
}

