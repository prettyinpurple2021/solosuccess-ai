type RateLimitEntry = { count: number; ts: number }
type RateLimitStore = Map<string, Map<string, RateLimitEntry>>

const RATE_LIMIT_STATE_SYMBOL = Symbol.for('solosuccess.rateLimitStore')

function getRateLimitStore(): RateLimitStore {
  const globalState = globalThis as typeof globalThis & {
    [RATE_LIMIT_STATE_SYMBOL]?: RateLimitStore
  }

  if (!globalState[RATE_LIMIT_STATE_SYMBOL]) {
    globalState[RATE_LIMIT_STATE_SYMBOL] = new Map()
  }

  return globalState[RATE_LIMIT_STATE_SYMBOL]!
}

function getBucket(bucketName: string) {
  const store = getRateLimitStore()
  let bucket = store.get(bucketName)
  if (!bucket) {
    bucket = new Map<string, RateLimitEntry>()
    store.set(bucketName, bucket)
  }
  return bucket
}

function getClientIP(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to a default IP for development
  return '127.0.0.1'
}

function handleOriginalPattern(
  bucketName: string,
  ip: string,
  windowMs: number,
  max: number
): { allowed: boolean; remaining: number } {
  const bucket = getBucket(bucketName)
  const now = Date.now()
  const entry = bucket.get(ip)
  if (!entry || now - entry.ts > windowMs) {
    bucket.set(ip, { count: 1, ts: now })
    return { allowed: true, remaining: max - 1 }
  }
  entry.count += 1
  entry.ts = now
  const remaining = Math.max(0, max - entry.count)
  return { allowed: entry.count <= max, remaining }
}

async function handleRequestPattern(
  request: Request,
  options: { requests: number; window: number }
): Promise<{ allowed: boolean; remaining: number; success?: boolean }> {
  // Extract IP from request
  const ip = getClientIP(request)
  const bucketName = request.url || 'default'
  
  // Convert window from seconds to milliseconds
  const windowMs = options.window * 1000
  
  const result = handleOriginalPattern(bucketName, ip, windowMs, options.requests)
  
  return {
    ...result,
    success: result.allowed
  }
}

// Overload for the common API pattern: rateLimitByIp(request, options)
export function rateLimitByIp(
  request: Request,
  options: { requests: number; window: number }
): Promise<{ allowed: boolean; remaining: number; success?: boolean }>

// Original function signature
export function rateLimitByIp(
  bucketName: string,
  ip: string,
  windowMs: number,
  max: number
): { allowed: boolean; remaining: number }

// Implementation that handles both patterns
export function rateLimitByIp(
  requestOrBucket: Request | string,
  optionsOrIp: { requests: number; window: number } | string,
  windowMs?: number,
  max?: number
): Promise<{ allowed: boolean; remaining: number; success?: boolean }> | { allowed: boolean; remaining: number } {
  // New pattern: rateLimitByIp(request, options)
  if (requestOrBucket instanceof Request && typeof optionsOrIp === 'object') {
    return handleRequestPattern(requestOrBucket, optionsOrIp)
  }
  
  // Original pattern: rateLimitByIp(bucket, ip, windowMs, max)
  if (typeof requestOrBucket === 'string' && typeof optionsOrIp === 'string' && windowMs && max) {
    return handleOriginalPattern(requestOrBucket, optionsOrIp, windowMs, max)
  }
  
  throw new Error('Invalid rateLimitByIp arguments')
}
