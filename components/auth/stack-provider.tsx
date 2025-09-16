"use client"

import { ReactNode, useEffect, useState} from "react"

interface StackAuthProviderProps {
  children: ReactNode
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Stack Auth removed - using JWT authentication instead
  // This is now just a wrapper component that ensures SSR compatibility
  // Always render children to avoid hydration mismatches
  return <>{children}</>
}
