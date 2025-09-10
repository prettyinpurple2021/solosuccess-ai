// Client-side instrumentation for PostHog (Next.js 15.3+)
// This runs on the client and initializes PostHog early for analytics and feature flags
import posthog from 'posthog-js'

export function register() {
  // Avoid initializing on the server
  if (typeof window === 'undefined') return

  // Prevent double-initialization during HMR or re-renders
  if ((window as any).__posthog_initialized__) return

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog: NEXT_PUBLIC_POSTHOG_KEY is not set; client analytics disabled')
    }
    return
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    // Send feature flag payloads to enable experiments/flags client-side
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    loaded: () => {
      ;(window as any).__posthog_initialized__ = true
    },
  })
}

// Optional helpers for client feature flags (can be imported in components)
export { posthog }