'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CyberPageLayout } from '@/components/cyber/CyberPageLayout'
import { HudBorder } from '@/components/cyber/HudBorder'
import { CyberButton } from '@/components/cyber/CyberButton'
import { SoloSuccessLogo } from '@/components/cyber/SoloSuccessLogo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError('Invalid or missing recovery token. Please request a new password reset.')
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Password reset successful. Redirecting to login...')
        setTimeout(() => {
          router.push('/signin')
        }, 2000)
      } else {
        setError(data.error || 'Password reset failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CyberPageLayout showNav={false}>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-8">
            <SoloSuccessLogo size={64} animated={true} className="mx-auto mb-4" />
            <h1 className="font-sci text-3xl font-bold text-white mb-2">
              RESET_PASSWORD
            </h1>
            <p className="text-gray-400 font-tech">
              Establish new neural link credentials
            </p>
          </div>

          <HudBorder className="p-8">
            {message ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-cyber-cyan" />
                </div>
                <h2 className="font-sci text-2xl text-white mb-4">PROTOCOL_COMPLETE</h2>
                <p className="text-gray-400 font-tech">{message}</p>
              </div>
            ) : error && !token ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="font-sci text-2xl text-white mb-4">INVALID_TOKEN</h2>
                <p className="text-gray-400 font-tech mb-6">{error}</p>
                <Link href="/forgot-password">
                  <CyberButton variant="primary" size="md">
                    REQUEST_NEW_LINK
                  </CyberButton>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-cyber-cyan font-sci text-xs uppercase tracking-widest mb-2 block">
                    NEW_PASSWORD
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-cyber-dark/50 border-cyber-cyan/30 text-white placeholder:text-gray-500 focus:border-cyber-cyan"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyber-cyan"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-cyber-cyan font-sci text-xs uppercase tracking-widest mb-2 block">
                    CONFIRM_PASSWORD
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 bg-cyber-dark/50 border-cyber-cyan/30 text-white placeholder:text-gray-500 focus:border-cyber-cyan"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyber-cyan"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-tech text-sm">
                    {error}
                  </div>
                )}

                <CyberButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || !token}
                  className="w-full"
                >
                  {loading ? 'RESETTING...' : 'RESET_PASSWORD'}
                </CyberButton>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/signin" className="text-sm text-cyber-cyan hover:text-cyber-purple font-tech">
                Back to login
              </Link>
            </div>
          </HudBorder>
        </div>
      </div>
    </CyberPageLayout>
  )
}
