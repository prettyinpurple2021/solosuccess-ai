import { PostHog } from 'posthog-node'

let singletonClient: PostHog | null = null

export function getPostHogServer(): PostHog | null {
  // Only run on server
  if (typeof window !== 'undefined') return null

  if (singletonClient) return singletonClient

  const apiKey = process.env.POSTHOG_SERVER_KEY || process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog (server): POSTHOG_SERVER_KEY/POSTHOG_API_KEY not set; server analytics disabled')
    }
    return null
  }

  singletonClient = new PostHog(apiKey, { host })
  return singletonClient
}

export function shutdownPostHogServer(): Promise<void> {
  return new Promise((resolve) => {
    if (!singletonClient) return resolve()
    singletonClient.shutdown()
    singletonClient = null
    resolve()
  })
}

export type { PostHog }


