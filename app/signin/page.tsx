'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CyberPageLayout } from '@/components/cyber/CyberPageLayout'
import { HudBorder } from '@/components/cyber/HudBorder'
import { CyberButton } from '@/components/cyber/CyberButton'
import { SoloSuccessLogo } from '@/components/cyber/SoloSuccessLogo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const isEmail = email.includes('@')
      const identifier = isEmail ? email : email.toLowerCase()
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, isEmail }),
      })
      const contentType = res.headers.get('content-type') || ''
      const body = contentType.includes('application/json') ? await res.json() : null
      if (!res.ok) {
        setError(body?.error || 'Sign in failed')
        return
      }
      if (typeof window !== 'undefined') {
        if (body?.token) localStorage.setItem('authToken', body.token)
      }
      window.location.href = redirectTo
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CyberPageLayout showNav={false}>
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-8">
            <SoloSuccessLogo size={64} animated={true} className="mx-auto mb-4" />
            <h1 className="font-sci text-3xl font-bold text-white mb-2">
              USER_LOGIN
            </h1>
            <p className="text-gray-400 font-tech">
              Access your neural network interface
            </p>
          </div>

          <HudBorder className="p-8">
            <form onSubmit={handleEmailSignIn} className="space-y-6">
              <div>
                <Label className="text-cyber-cyan font-sci text-xs uppercase tracking-widest mb-2 block">
                  EMAIL_ADDRESS
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-cyber-dark/50 border-cyber-cyan/30 text-white placeholder:text-gray-500 focus:border-cyber-cyan"
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-cyber-cyan font-sci text-xs uppercase tracking-widest mb-2 block">
                  PASSWORD
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-400 font-tech cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-cyber-cyan hover:text-cyber-purple font-tech">
                  Forgot password?
                </Link>
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
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    CONNECTING...
                  </>
                ) : (
                  'AUTHENTICATE'
                )}
              </CyberButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 font-tech">
                Don't have an account?{' '}
                <Link href="/signup" className="text-cyber-cyan hover:text-cyber-purple font-sci">
                  INITIALIZE_ACCOUNT
                </Link>
              </p>
            </div>
          </HudBorder>
        </div>
      </div>
    </CyberPageLayout>
  )
}
