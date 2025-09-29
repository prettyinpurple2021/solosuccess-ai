"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Smartphone } from "lucide-react"

export default function TwoFactorPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const router = useRouter()

  const handleVerifyTOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error: verifyError } = await authClient.twoFactor.verifyTOTP({
        code,
        trustDevice: true, // Trust this device for future logins
      })

      if (verifyError) {
        setError(verifyError.message)
        return
      }

      if (data) {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsVerifying(true)
    try {
      // Better Auth will handle resending the code
      await authClient.twoFactor.resendCode()
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-gray-300">
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyTOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-white">
                Verification Code
              </Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
            </div>

            {error && (
              <Alert className="bg-red-500/20 border-red-500/50">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Code
                </>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={isVerifying}
                className="text-gray-300 hover:text-white"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-200">
              <Smartphone className="w-4 h-4" />
              <span className="text-sm">
                Don't have your phone? Use a backup code instead.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
