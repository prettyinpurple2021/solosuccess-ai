"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { logError } from '@/lib/logger'
import { 
  Download, 
  X, 
  Smartphone, 
  Wifi, 
  Zap,
  Crown,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}
interface PWAInstallPromptProps {
  className?: string
  onInstall?: () => void
  onDismiss?: () => void
}
export default function PWAInstallPrompt({ 
  className = "", 
  onInstall, 
  onDismiss 
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true)
        return
      }
    }
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after a delay for better UX
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }
    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      onInstall?.()
    }
    checkInstalled()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])
  const handleInstall = async () => {
    if (!deferredPrompt) return
    setIsInstalling(true)
    try {
      // Show the install prompt
      await deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setShowPrompt(false)
        onInstall?.()
      } else {
        setShowPrompt(false)
        onDismiss?.()
      }
      // Clear the deferredPrompt
      setDeferredPrompt(null)
    } catch (error) {
      logError('Error during installation:', error)
    } finally {
      setIsInstalling(false)
    }
  }
  const handleDismiss = () => {
    setShowPrompt(false)
    onDismiss?.()
  }
  // Don't show if already installed or no prompt available
  if (isInstalled || !deferredPrompt || !showPrompt) {
    return null
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("fixed bottom-4 left-4 right-4 z-50", className)}
      >
        <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl">
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 opacity-50" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
          {/* Sparkle effects */}
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          </div>
          <CardHeader className="relative pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Install SoloSuccess AI
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Get the full mobile experience
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">Offline access</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Faster loading</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="w-4 h-4 text-purple-500" />
                <span className="text-gray-700">Full features</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">Push notifications</span>
              </div>
            </div>
            {/* Install button */}
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isInstalling ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Installing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Install App
                </div>
              )}
            </Button>
            <div className="text-xs text-gray-500 text-center">
              💡 Get instant access to your AI business platform
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
// Hook to manage PWA install state
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  useEffect(() => {
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }
    checkInstalled()
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])
  const install = async () => {
    if (!deferredPrompt) return false
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      return outcome === 'accepted'
    } catch (error) {
      logError('Installation failed:', error)
      return false
    }
  }
  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    install
  }
}
