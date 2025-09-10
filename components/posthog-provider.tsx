'use client'

import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Prevent double initialization
    if ((window as any).__posthog_initialized__) return

    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

    if (!apiKey) {
      console.warn('PostHog: NEXT_PUBLIC_POSTHOG_KEY is not set')
      return
    }

    console.log('Initializing PostHog with key:', apiKey.substring(0, 10) + '...')

    // Dynamic import to avoid SSR issues
    import('posthog-js').then((posthog) => {
      posthog.default.init(apiKey, {
        api_host: apiHost,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (ph) => {
          console.log('PostHog loaded successfully!')
          ;(window as any).__posthog_initialized__ = true
          ;(window as any).posthog = ph
        },
      })
    }).catch((error) => {
      console.error('Failed to load PostHog:', error)
    })
  }, [])

  return <>{children}</>
}
