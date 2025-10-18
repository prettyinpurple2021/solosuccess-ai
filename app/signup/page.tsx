"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Github, 
  Target,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  Check,
  AlertTriangle
} from "lucide-react"
import { 
  TacticalButton, 
  GlassCard, 
  RankStars, 
  CamoBackground, 
  SergeantDivider,
  StatsBadge,
  TacticalGrid
} from '@/components/military'

// Disable static generation for auth pages
export const dynamic = 'force-dynamic'

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get plan selection from URL params
  const plan = searchParams.get('plan') || 'launch'
  const priceId = searchParams.get('price')
  const billing = searchParams.get('billing') || 'monthly'

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
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
          billing
        }),
      })
      
      const contentType = res.headers.get('content-type') || ''
      const body = contentType.includes('application/json') ? await res.json() : null
      
      if (!res.ok) {
        setError(body?.error || 'Sign up failed')
        return
      }
      
      if (typeof window !== 'undefined') {
        if (body?.token) localStorage.setItem('authToken', body.token)
      }
      
      // Redirect to dashboard or onboarding
      window.location.href = '/dashboard'
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: "github") => {
    setIsLoading(true)
    setError("")

    try {
      // Redirect to GitHub OAuth with plan info
      const params = new URLSearchParams({
        redirect: '/dashboard',
        plan: plan,
        ...(priceId && { price: priceId }),
        ...(billing && { billing: billing })
      })
      window.location.href = `/api/auth/github?${params.toString()}`
    } catch (err) {
      setError("Failed to sign up with " + provider)
      setIsLoading(false)
    }
  }

  const getPlanDisplay = () => {
    switch (plan) {
      case 'accelerator':
        return { name: 'Accelerator', rank: 'Sergeant', color: 'text-military-hot-pink' }
      case 'dominator':
        return { name: 'Dominator', rank: 'Commander', color: 'text-military-blush-pink' }
      default:
        return { name: 'Launch', rank: 'Private', color: 'text-military-storm-grey' }
    }
  }

  const planInfo = getPlanDisplay()

  return (
    <div className="min-h-screen bg-military-midnight">
      {/* Camo Background */}
      <CamoBackground />
      
      {/* Tactical Grid Overlay */}
      <TacticalGrid />

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-military-tactical/80 border-b border-military-hot-pink/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-military-glass-white">
                SoloSuccess AI
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/signin" 
                className="text-military-glass-white hover:text-military-hot-pink transition-colors"
              >
                Sign In
              </a>
              <a 
                href="/" 
                className="text-military-glass-white hover:text-military-hot-pink transition-colors"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8" glow>
            <div className="text-center mb-8">
              <RankStars rank={planInfo.rank} size="large" className="justify-center mb-4" />
              <h1 className="text-3xl font-heading font-bold text-military-glass-white mb-2">
                Request Clearance
              </h1>
              <p className="text-military-storm-grey mb-4">
                Join the tactical command center
              </p>
              
              {/* Plan Selection Display */}
              {plan !== 'launch' && (
                <div className="bg-military-tactical/50 border border-military-hot-pink/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <StatsBadge variant="warning" size="sm">
                      Selected Plan
                    </StatsBadge>
                  </div>
                  <h3 className={`font-heading font-bold ${planInfo.color}`}>
                    {planInfo.name} Mission
                  </h3>
                  <p className="text-xs text-military-storm-grey">
                    {billing === 'yearly' ? 'Annual billing' : 'Monthly billing'}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleEmailSignUp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-military-glass-white flex items-center gap-2">
                  <User className="w-4 h-4 text-military-hot-pink" />
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-military-tactical/50 border border-military-gunmetal/50 rounded-lg text-military-glass-white placeholder:text-military-storm-grey focus:outline-none focus:ring-2 focus:ring-military-hot-pink/50 focus:border-military-hot-pink/50 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-military-glass-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-military-hot-pink" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-military-tactical/50 border border-military-gunmetal/50 rounded-lg text-military-glass-white placeholder:text-military-storm-grey focus:outline-none focus:ring-2 focus:ring-military-hot-pink/50 focus:border-military-hot-pink/50 transition-all"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-military-glass-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-military-hot-pink" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full px-4 py-3 pr-12 bg-military-tactical/50 border border-military-gunmetal/50 rounded-lg text-military-glass-white placeholder:text-military-storm-grey focus:outline-none focus:ring-2 focus:ring-military-hot-pink/50 focus:border-military-hot-pink/50 transition-all"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-military-storm-grey hover:text-military-hot-pink transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-military-storm-grey">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-military-glass-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-military-hot-pink" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pr-12 bg-military-tactical/50 border border-military-gunmetal/50 rounded-lg text-military-glass-white placeholder:text-military-storm-grey focus:outline-none focus:ring-2 focus:ring-military-hot-pink/50 focus:border-military-hot-pink/50 transition-all"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-military-storm-grey hover:text-military-hot-pink transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-military-gunmetal/50 bg-military-tactical/50 text-military-hot-pink focus:ring-military-hot-pink/50 focus:ring-2 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-military-storm-grey">
                  I agree to the{" "}
                  <a href="/terms" className="text-military-hot-pink hover:text-military-blush-pink transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-military-hot-pink hover:text-military-blush-pink transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}

              <TacticalButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Request...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    Join the Mission
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </TacticalButton>
            </form>

            <div className="mt-8">
              <SergeantDivider />
              
              <div className="mt-6">
                <TacticalButton
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => handleSocialSignUp("github")}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </TacticalButton>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-military-storm-grey text-sm">
                Already have clearance?{" "}
                <a 
                  href="/signin" 
                  className="text-military-hot-pink hover:text-military-blush-pink font-semibold transition-colors"
                >
                  Sign In
                </a>
              </p>
            </div>
          </GlassCard>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6"
          >
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-military-glass-white">
                    Military-Grade Security
                  </h3>
                  <p className="text-xs text-military-storm-grey">
                    Your data is protected with bank-level encryption and SOC 2 compliance.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-military-tactical/30 backdrop-blur-xl border-t border-military-hot-pink/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-military-glass-white">
                SoloSuccess AI
              </span>
            </div>
            
            <div className="flex space-x-6">
              <a href="/privacy" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Privacy</a>
              <a href="/terms" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Terms</a>
              <a href="/security" className="text-military-storm-grey hover:text-military-hot-pink transition-colors text-sm">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}