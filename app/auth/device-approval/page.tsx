"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock
} from "lucide-react"

interface DeviceApproval {
  id: string
  deviceName: string
  deviceType: string
  ipAddress: string
  userAgent: string
  location?: string
  requestedAt: string
  expiresAt: string
}

export default function DeviceApprovalPage() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceApproval | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadDeviceInfo()
  }, [])

  const loadDeviceInfo = async () => {
    try {
      // Get current device information
      const deviceInfo = {
        id: crypto.randomUUID(),
        deviceName: getDeviceName(),
        deviceType: getDeviceType(),
        ipAddress: "Loading...", // Will be filled by server
        userAgent: navigator.userAgent,
        location: "Loading...", // Will be filled by server
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      }
      
      setDeviceInfo(deviceInfo)
    } catch (err) {
      setError("Failed to load device information")
    } finally {
      setIsLoading(false)
    }
  }

  const getDeviceName = () => {
    const platform = navigator.platform
    const userAgent = navigator.userAgent
    
    if (platform.includes("Mac")) return "MacBook"
    if (platform.includes("Win")) return "Windows PC"
    if (platform.includes("Linux")) return "Linux PC"
    if (userAgent.includes("iPhone")) return "iPhone"
    if (userAgent.includes("iPad")) return "iPad"
    if (userAgent.includes("Android")) return "Android Device"
    
    return "Unknown Device"
  }

  const getDeviceType = () => {
    const userAgent = navigator.userAgent
    
    if (userAgent.includes("Mobile")) return "mobile"
    if (userAgent.includes("Tablet")) return "tablet"
    return "desktop"
  }

  const handleApprove = async () => {
    setIsApproving(true)
    setError("")

    try {
      // Approve the device
      const { data, error: approveError } = await authClient.multiSession.approveDevice({
        deviceFingerprint: crypto.randomUUID(), // In real implementation, this would be generated properly
        deviceName: deviceInfo?.deviceName || "Unknown Device",
        deviceType: deviceInfo?.deviceType || "desktop",
        trustDevice: true,
      })

      if (approveError) {
        setError(approveError.message)
        return
      }

      if (data) {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("Failed to approve device. Please try again.")
    } finally {
      setIsApproving(false)
    }
  }

  const handleDeny = async () => {
    router.push("/signin")
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case "desktop":
        return <Monitor className="w-8 h-8" />
      case "mobile":
        return <Smartphone className="w-8 h-8" />
      case "tablet":
        return <Tablet className="w-8 h-8" />
      default:
        return <Monitor className="w-8 h-8" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">
            Device Approval Required
          </CardTitle>
          <CardDescription className="text-gray-300">
            A new device is trying to access your account. Please review and approve this request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deviceInfo && (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {getDeviceIcon(deviceInfo.deviceType)}
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {deviceInfo.deviceName}
                    </h3>
                    <p className="text-gray-300 capitalize">
                      {deviceInfo.deviceType} Device
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>Location: {deviceInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>Requested: {formatDate(deviceInfo.requestedAt)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <Alert className="bg-red-500/20 border-red-500/50">
                  <AlertDescription className="text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {isApproving ? "Approving..." : "Approve Device"}
                </Button>
                <Button
                  onClick={handleDeny}
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deny Access
                </Button>
              </div>

              <div className="bg-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-200 font-semibold mb-2">Security Notice</h4>
                <p className="text-blue-100 text-sm">
                  Only approve this device if you recognize it and trust the location. 
                  If you don't recognize this device, deny access and consider changing your password.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
