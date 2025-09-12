"use client"

import { useAuth } from '@/hooks/use-auth'

export function useSafeUser() {
  try {
    const { user } = useAuth()
    return user
  } catch (error) {
    console.warn('Auth not available:', error)
    return null
  }
}

export function useSafeStackApp() {
  // Stack Auth has been removed, return null
  console.warn('Stack Auth has been removed from this application')
  return null
}