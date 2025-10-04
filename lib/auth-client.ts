/**
 * Client-side authentication utilities
 * JWT-based authentication for SoloSuccess AI
 */
import * as React from 'react'

export interface User {
  id: string
  email: string
  name: string | null
  full_name: string | null
  username: string | null
  image: string | null
  emailVerified: boolean
  createdAt: Date | string
  updatedAt: Date | string
  subscription_tier?: string
  subscription_status?: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  current_period_start?: Date | string | null
  current_period_end?: Date | string | null
  cancel_at_period_end?: boolean
}

export interface Session {
  token: string
  userId: string
  expiresAt: string
}

export interface AuthResponse {
  user: User | null
  session: Session | null
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: email,
      password,
      isEmail: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Sign in failed')
  }

  const data = await response.json()
  
  // Store token in localStorage for client-side access
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('auth_token', data.token)
  }

  return {
    user: data.user,
    session: {
      token: data.token,
      userId: data.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, metadata?: {
  full_name?: string
  username?: string
  date_of_birth?: string
}): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      metadata,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Sign up failed')
  }

  const data = await response.json()
  
  // Store token in localStorage for client-side access
  if (typeof window !== 'undefined' && data.token) {
    localStorage.setItem('auth_token', data.token)
  }

  return {
    user: data.user,
    session: {
      token: data.token,
      userId: data.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
  
  await fetch('/api/auth/logout', {
    method: 'POST',
  })
}

/**
 * Get current session
 */
export async function getSession(): Promise<AuthResponse> {
  let token: string | null = null
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token')
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch('/api/auth/session', {
    method: 'GET',
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    return { user: null, session: null }
  }

  return await response.json()
}

/**
 * React hook for authentication
 */
export function useSession() {
  const [session, setSession] = React.useState<AuthResponse | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    getSession()
      .then(setSession)
      .finally(() => setLoading(false))
  }, [])

  return {
    data: session,
    status: loading ? 'loading' : session?.user ? 'authenticated' : 'unauthenticated',
    update: async () => {
      const newSession = await getSession()
      setSession(newSession)
    },
  }
}

/**
 * React hook for getting current user
 */
export function useUser() {
  const { data, status } = useSession()
  return {
    data: data?.user || null,
    isLoading: status === 'loading',
    error: status === 'unauthenticated' ? 'Not authenticated' : null,
  }
}

// Export for compatibility
export const authClient = {
  signIn,
  signUp,
  signOut,
  getSession,
  useSession,
  useUser,
}
