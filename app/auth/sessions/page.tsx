"use client"


export const dynamic = 'force-dynamic'
import { useState, useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Trash2, 
  Shield, 
  Clock,
  MapPin,
  Wifi
} from "lucide-react"

interface Session {
  id: string
  deviceName: string
  deviceType: string
  ipAddress: string
  userAgent: string
  isCurrent: boolean
  lastActivity: string
  createdAt: string
  location?: string
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      const { data, error: sessionsError } = await authClient.multiSession.getSessions()
      
      if (sessionsError) {
        setError(sessionsError.message)
        return
      }

      if (data) {
        setSessions(data.sessions || [])
      }
    } catch (err) {
      setError("Failed to load sessions")
    } finally {
      setIsLoading(false)
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      const { error: revokeError } = await authClient.multiSession.revokeSession({
        sessionId,
      })

      if (revokeError) {
        setError(revokeError.message)
        return
      }

      // Reload sessions after revoking
      await loadSessions()
    } catch (err) {
      setError("Failed to revoke session")
    }
  }

  const revokeAllOtherSessions = async () => {
    try {
      const { error: revokeError } = await authClient.multiSession.revokeOtherSessions()

      if (revokeError) {
        setError(revokeError.message)
        return
      }

      // Reload sessions after revoking
      await loadSessions()
    } catch (err) {
      setError("Failed to revoke other sessions")
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "desktop":
        return <Monitor className="w-5 h-5" />
      case "mobile":
        return <Smartphone className="w-5 h-5" />
      case "tablet":
        return <Tablet className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Active Sessions</h1>
          <p className="text-gray-300">
            Manage your active sessions and device access
          </p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/50">
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(session.deviceType)}
                    <div>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <span>{session.deviceName}</span>
                        {session.isCurrent && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                            Current
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {session.deviceType} • {session.ipAddress}
                      </CardDescription>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last active: {formatDate(session.lastActivity)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location: {session.location || "Unknown"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4" />
                    <span>IP: {session.ipAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Created: {formatDate(session.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sessions.length > 1 && (
          <Card className="mt-6 bg-red-500/10 backdrop-blur-lg border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-300 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Security Actions</span>
              </CardTitle>
              <CardDescription className="text-red-200">
                Revoke all other sessions to sign out all devices except this one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={revokeAllOtherSessions}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Revoke All Other Sessions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
