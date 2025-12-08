'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CyberPageLayout } from '@/components/cyber/CyberPageLayout'
import { HudBorder } from '@/components/cyber/HudBorder'
import { CyberButton } from '@/components/cyber/CyberButton'
import { SoloSuccessLogo } from '@/components/cyber/SoloSuccessLogo'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <CyberPageLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </CyberPageLayout>
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
        setSuccess('Recovery protocol initiated. Check your neural link for further instructions.')
      } else {
        setError(data.error || 'Protocol failed. Please verify your email and try again.')
      }
    } catch (err) {
      setError('Communication error. Please try again.')
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
              PASSWORD_RECOVERY
            </h1>
            <p className="text-gray-400 font-tech">
              Reset your neural link access
            </p>
          </div>

          <HudBorder className="p-8">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyber-cyan/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-cyber-cyan" />
                </div>
                <h2 className="font-sci text-2xl text-white mb-4">PROTOCOL_INITIATED</h2>
                <p className="text-gray-400 font-tech mb-6">{success}</p>
                <Link href="/signin">
                  <CyberButton variant="primary" size="md">
                    RETURN_TO_LOGIN
                  </CyberButton>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-tech text-sm">
                    {error}
                  </div>
                )}

                <CyberButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'INITIATING...' : 'SEND_RECOVERY_LINK'}
                </CyberButton>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/signin" className="text-sm text-cyber-cyan hover:text-cyber-purple font-tech inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </HudBorder>
        </div>
      </div>
    </CyberPageLayout>
  )
}
