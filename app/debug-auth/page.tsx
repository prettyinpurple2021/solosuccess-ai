"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { EmpowermentCard } from "@/components/ui/boss-card"
import { Crown, CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react"

export default function DebugAuthPage() {
  const [token, setToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    setToken(storedToken)
    if (storedToken) {
      testToken(storedToken)
    }
  }, [])

  const testToken = async (testToken: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Test user endpoint
      const userResponse = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${testToken}`
        }
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserData(userData)
        
        // Test dashboard endpoint
        const dashboardResponse = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${testToken}`
          }
        })
        
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json()
          setDashboardData(dashboardData)
        } else {
          console.error('Dashboard API failed:', dashboardResponse.status, await dashboardResponse.text())
        }
      } else {
        console.error('User API failed:', userResponse.status, await userResponse.text())
        setError('Token validation failed')
      }
    } catch (err) {
      console.error('Test failed:', err)
      setError('Test failed: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const clearToken = () => {
    localStorage.removeItem('authToken')
    setToken(null)
    setUserData(null)
    setDashboardData(null)
    setError(null)
  }

  const refreshTest = () => {
    if (token) {
      testToken(token)
    }
  }

  return (
    <div className="min-h-screen gradient-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold boss-heading mb-2">Authentication Debug</h1>
          <p className="text-muted-foreground">Debug your SoloSuccess AI authentication system</p>
        </div>

        <EmpowermentCard>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Token Status</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              {token ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Token Found</span>
                  </div>
                  <p className="text-sm text-gray-600 break-all">{token.substring(0, 50)}...</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span className="font-medium">No Token Found</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={refreshTest} disabled={!token || loading} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Test Token
              </Button>
              <Button onClick={clearToken} variant="outline">
                Clear Token
              </Button>
            </div>
          </div>
        </EmpowermentCard>

        {userData && (
          <EmpowermentCard>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">User Data</h2>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <pre className="text-sm text-green-800 overflow-auto">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            </div>
          </EmpowermentCard>
        )}

        {dashboardData && (
          <EmpowermentCard>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Dashboard Data</h2>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <pre className="text-sm text-blue-800 overflow-auto">
                  {JSON.stringify(dashboardData, null, 2)}
                </pre>
              </div>
            </div>
          </EmpowermentCard>
        )}

        {error && (
          <EmpowermentCard>
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Error</h2>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </EmpowermentCard>
        )}

        {loading && (
          <EmpowermentCard>
            <div className="text-center p-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Testing authentication...</p>
            </div>
          </EmpowermentCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmpowermentCard>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = '/signin'} 
                  className="w-full"
                  variant="outline"
                >
                  Go to Sign In
                </Button>
                <Button 
                  onClick={() => window.location.href = '/signup'} 
                  className="w-full"
                  variant="outline"
                >
                  Go to Sign Up
                </Button>
                <Button 
                  onClick={() => window.location.href = '/dashboard'} 
                  className="w-full"
                  variant="outline"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </EmpowermentCard>

          <EmpowermentCard>
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Test Results</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Token Present:</span>
                  <span className={token ? 'text-green-600' : 'text-red-600'}>
                    {token ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>User API:</span>
                  <span className={userData ? 'text-green-600' : 'text-gray-600'}>
                    {userData ? 'Working' : 'Not Tested'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dashboard API:</span>
                  <span className={dashboardData ? 'text-green-600' : 'text-gray-600'}>
                    {dashboardData ? 'Working' : 'Not Tested'}
                  </span>
                </div>
              </div>
            </div>
          </EmpowermentCard>
        </div>
      </div>
    </div>
  )
}
