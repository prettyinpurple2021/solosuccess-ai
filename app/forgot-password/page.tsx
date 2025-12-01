"use client"

// Force dynamic rendering to avoid static generation issues with StackAuth
export const dynamic = 'force-dynamic'

import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  AlertCircle, 
  CheckCircle, 
  Lock, 
  ArrowLeft,
  Mail,
  Shield,
  Target,
  Crown,
  ArrowRight,
  Eye,
  EyeOff
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-military-midnight flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-military-hot-pink border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Tactical recovery protocol initiated. Check your command center for further instructions.")
      } else {
        setError(data.error || "Mission failed. Please verify your tactical email and try again.")
      }
    } catch (err) {
      setError("Communication error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-military-midnight relative overflow-hidden">
        <CamoBackground opacity={0.1} withGrid>
          <div className="container mx-auto px-4 py-32">
            <GlassCard className="max-w-2xl mx-auto p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <h1 className="font-heading text-4xl font-bold text-white mb-4">
                  Recovery Protocol Initiated
                </h1>
                
                <p className="text-lg text-military-storm-grey mb-8">
                  {success}
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signin">
                    <TacticalButton>
                      Return to Base
                    </TacticalButton>
                  </Link>
                  <Link href="/">
                    <TacticalButton variant="outline">
                      Home Command
                    </TacticalButton>
                  </Link>
                </div>
              </motion.div>
            </GlassCard>
          </div>
        </CamoBackground>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.1} withGrid>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-heading text-xl font-bold text-white">SoloSuccess AI</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <Link href="/signin">
                  <TacticalButton variant="outline" size="sm">
                    Sign In
                  </TacticalButton>
                </Link>
                <Link href="/signup">
                  <TacticalButton size="sm">
                    Get Started
                  </TacticalButton>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <RankStars count={5} size="lg" />
                <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                  Security Protocol
                </span>
              </div>
              
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Password <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Recovery</span>
              </h1>
              
              <p className="text-xl text-military-storm-grey leading-relaxed">
                Initiate tactical recovery protocol to regain access to your command center. 
                We'll send elite recovery instructions to your registered email.
              </p>
            </motion.div>

            <GlassCard className="p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <Label htmlFor="email" className="block text-white font-tactical text-sm uppercase tracking-wider mb-3">
                    Tactical Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-military-storm-grey" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your tactical email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 pr-4 py-4 bg-military-tactical/50 border-military-hot-pink/30 text-white placeholder-military-storm-grey focus:border-military-hot-pink text-lg"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TacticalButton 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="w-full group"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Initiating Protocol...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Initiate Recovery Protocol
                    </>
                  )}
                </TacticalButton>
              </form>
            </GlassCard>

            {/* Security Info */}
            <div className="mt-12">
              <GlassCard className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">
                    Elite Security Protocol
                  </h3>
                  
                  <p className="text-military-storm-grey mb-6 leading-relaxed">
                    Our recovery system uses military-grade encryption and security protocols. 
                    Your tactical credentials are protected with the highest security standards.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-military-hot-pink" />
                      </div>
                      <h4 className="font-heading text-lg font-bold text-white mb-2">Encrypted</h4>
                      <p className="text-military-storm-grey text-sm">Military-grade encryption</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 flex items-center justify-center">
                        <Target className="w-6 h-6 text-military-hot-pink" />
                      </div>
                      <h4 className="font-heading text-lg font-bold text-white mb-2">Secure</h4>
                      <p className="text-military-storm-grey text-sm">Elite security protocols</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-military-hot-pink/20 to-military-blush-pink/20 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-military-hot-pink" />
                      </div>
                      <h4 className="font-heading text-lg font-bold text-white mb-2">Private</h4>
                      <p className="text-military-storm-grey text-sm">Zero-knowledge architecture</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Back to Sign In */}
            <div className="text-center mt-8">
              <Link href="/signin" className="inline-flex items-center gap-2 text-military-storm-grey hover:text-military-hot-pink transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Return to Sign In
              </Link>
            </div>
          </div>
        </div>
      </CamoBackground>
    </div>
  )
}