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
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const plan = searchParams.get('plan') || 'launch'
  const priceId = searchParams.get('price')
  const billing = searchParams.get('billing') || 'monthly'

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          plan,
          priceId,
          billing,
        }),
      })

      const body = await res.json()
      if (!res.ok) {
        setError(body?.error || 'Sign up failed')
        return
      }

      if (typeof window !== 'undefined') {
        if (body?.token) localStorage.setItem('authToken', body.token)
      }

      router.push('/dashboard')
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
              INITIALIZE_ACCOUNT
            </h1>
            <p className="text-gray-400 font-tech">
              Join the neural network
            </p>
          </div>

          <HudBorder className="p-8">
            <form onSubmit={handleEmailSignUp} className="space-y-6">
              <div>
                <Label className="text-cyber-cyan font-sci text-xs uppercase tracking-widest mb-2 block">
                  FULL_NAME
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-cyber-dark/50 border-cyber-cyan/30 text-white placeholder:text-gray-500 focus:border-cyber-cyan"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm text-gray-400 font-tech cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-cyber-cyan hover:text-cyber-purple">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-cyber-cyan hover:text-cyber-purple">
                    Privacy Policy
                  </Link>
                </Label>
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
                    INITIALIZING...
                  </>
                ) : (
                  'CREATE_ACCOUNT'
                )}
              </CyberButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 font-tech">
                Already have an account?{' '}
                <Link href="/signin" className="text-cyber-cyan hover:text-cyber-purple font-sci">
                  USER_LOGIN
                </Link>
              </p>
            </div>
          </HudBorder>
        </div>
      </div>
    </CyberPageLayout>
  )
}
