"use client"

import { logInfo } from '@/lib/logger'
import { SimpleOnboarding } from "./simple-onboarding"

interface EnhancedOnboardingProps {
  open: boolean
  onComplete: (data: Record<string, unknown>) => void
  onSkip: () => void
  userData?: Record<string, unknown>
}

export function EnhancedOnboarding({ open, onComplete, onSkip, userData }: EnhancedOnboardingProps) {
  return (
    <SimpleOnboarding
      open={open}
      onComplete={onComplete}
      onSkip={onSkip}
      userData={userData}
    />
  )
}
