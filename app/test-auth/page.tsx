"use client"


export const dynamic = 'force-dynamic'
import { useState, useEffect} from "react"
import { useRouter} from "next/navigation"
import { Button} from "@/components/ui/button"
import { EmpowermentCard} from "@/components/ui/boss-card"
import { Crown, CheckCircle, XCircle, ArrowRight} from "lucide-react"

export default function TestAuthPage() {
  if (process.env.NODE_ENV === 'production') {
    if (typeof window !== 'undefined') {
      window.location.replace('/not-found')
    }
    return null
  }
  const router = useRouter()
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking')
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        setAuthStatus('unauthenticated')
        return
      }

      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setAuthStatus('authenticated')
      } else {
        localStorage.removeItem('authToken')
        setAuthStatus('unauthenticated')
        setError('Invalid or expired token')
      }
    } catch (err) {
      setAuthStatus('unauthenticated')
      setError('Failed to verify authentication')
    }
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  const goToSignIn = () => {
    router.push('/signin')
  }

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center p-6">
        <EmpowermentCard className="max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Checking authentication status...</p>
        </EmpowermentCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center p-6">
      <EmpowermentCard className="max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold boss-heading mb-2">Authentication Test</h1>
          <p className="text-muted-foreground">Testing your SoloSuccess AI authentication system</p>
        </div>

        {authStatus === 'authenticated' ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Authentication Successful!</span>
              </div>
            </div>
            
            {userData && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h3 className="font-medium text-purple-800 mb-2">User Information:</h3>
                <div className="text-sm text-purple-700 space-y-1">
                  <p><strong>Name:</strong> {userData.full_name}</p>
                  <p><strong>Email:</strong> {userData.email}</p>
                  <p><strong>Username:</strong> {userData.username}</p>
                  <p><strong>ID:</strong> {userData.id}</p>
                </div>
              </div>
            )}

            <Button 
              onClick={goToDashboard} 
              className="w-full punk-button text-white"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Not Authenticated</span>
              </div>
              {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
            </div>

            <Button 
              onClick={goToSignIn} 
              className="w-full punk-button text-white"
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-muted-foreground text-center">
            This page helps verify that your authentication system is working correctly.
          </p>
        </div>
      </EmpowermentCard>
    </div>
  )
}
