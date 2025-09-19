"use client"
import { useMemo } from 'react'
import type { AuthenticatedUser } from './auth-utils'
import { useAuth } from '@/hooks/use-auth'

/**
 * Production-ready client auth hook.
 * Bridges the app-wide AuthProvider to a simple `{ user, loading, error }` shape.
 */
export function useUser(): { user: AuthenticatedUser | null; loading: boolean; error: string | null } {
  const { user, loading } = useAuth()

  const mappedUser = useMemo<AuthenticatedUser | null>(() => {
    if (!user) return null
    return {
      id: user.id,
      email: user.email,
      full_name: (user as any).full_name ?? user.name,
      name: user.name ?? (user as any).full_name,
      username: user.username,
      avatar_url: (user as any).avatar_url,
      created_at: (user as any).created_at,
      updated_at: (user as any).updated_at,
      subscription_tier: (user as any).subscription_tier,
      subscription_status: (user as any).subscription_status,
      stripe_customer_id: (user as any).stripe_customer_id,
      stripe_subscription_id: (user as any).stripe_subscription_id,
      current_period_start: (user as any).current_period_start,
      current_period_end: (user as any).current_period_end,
      cancel_at_period_end: (user as any).cancel_at_period_end,
    }
  }, [user])

  return {
    user: mappedUser,
    loading,
    error: null,
  }
}
