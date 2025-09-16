"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@/lib/neon/types"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (_email: string, _password: string) => Promise<{ error: unknown }>
  signUp: (_email: string, _password: string, _metadata?: Record<string, unknown>) => Promise<{ error: unknown }>
  signOut: () => Promise<void>
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem('authToken')
    if (token) {
      // Always let the server verify the token; do not verify on client
      fetchUserData(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const userData = (data && (data.user ?? data)) as User
        const sessionData: Session = {
          user: userData,
          access_token: token,
          refresh_token: token,
          expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        }
        setUser(userData)
        setSession(sessionData)
      } else {
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email.includes('@') ? email : email.toLowerCase(),
          password,
          isEmail: email.includes('@')
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const { user, token } = data
        localStorage.setItem('authToken', token)
        
        const sessionData: Session = {
          user,
          access_token: token,
          refresh_token: token,
          expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }
        
        setUser(user)
        setSession(sessionData)
        return { error: null }
      } else {
        return { error: data.error }
      }
    } catch {
      return { error: 'Network error' }
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, metadata }),
      })

      const data = await response.json()

      if (response.ok) {
        const { user, token } = data
        localStorage.setItem('authToken', token)
        
        const sessionData: Session = {
          user,
          access_token: token,
          refresh_token: token,
          expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000)
        }
        
        setUser(user)
        setSession(sessionData)
        return { error: null }
      } else {
        return { error: data.error }
      }
    } catch {
      return { error: 'Network error' }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setSession(null)
  }

  const getToken = async () => {
    return localStorage.getItem('authToken')
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    getToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
