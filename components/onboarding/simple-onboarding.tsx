"use client"

import { logInfo } from '@/lib/logger'
import { useState } from "react"
import { motion } from "framer-motion"
import { Button} from "@/components/ui/button"
import { Input} from "@/components/ui/input"
import { Label} from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Crown, Target, Rocket, ArrowRight, CheckCircle} from "lucide-react"
import { GlassCard, CamoBackground, TacticalGrid } from "@/components/military"

interface SimpleOnboardingProps {
  open: boolean
  onCompleteAction: (data: Record<string, unknown>) => void
  onSkipAction: () => void
  userData?: Record<string, unknown>
}

export function SimpleOnboarding({ open, onCompleteAction, onSkipAction, userData }: SimpleOnboardingProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState<string>(
    typeof userData?.full_name === 'string' ? userData.full_name : ""
  )
  const [businessType, setBusinessType] = useState("")
  const [goals, setGoals] = useState<string[]>([])

  const businessTypes = [
    "Freelancer",
    "Consultant",
    "E-commerce Owner",
    "Content Creator",
    "Coach/Trainer",
    "Agency Owner",
    "SaaS Founder",
    "Service Provider",
    "Other",
  ]

  const goalOptions = [
    { id: "productivity", label: "Boost Productivity", emoji: "⚡" },
    { id: "growth", label: "Scale Business", emoji: "📈" },
    { id: "organization", label: "Get Organized", emoji: "📋" },
    { id: "automation", label: "Automate Tasks", emoji: "🤖" },
  ]

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleNext = () => {
    if (step === 1) {
      if (name && businessType) {
        setStep(2)
      }
    }
  }

  const handleComplete = () => {
    const data = {
      personalInfo: { name, businessType },
      goals: { primaryGoals: goals },
      onboardingCompleted: true,
      completionDate: new Date().toISOString()
    }
    
    logInfo('Simple onboarding completed', data)
    
    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding_completed: true, onboarding_data: data })
    }).catch(() => {})
    
    onCompleteAction(data)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-military-midnight/80 backdrop-blur-md">
      <CamoBackground opacity={0.15} withGrid />
      <TacticalGrid />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <GlassCard className="p-8" glow>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-full flex items-center justify-center border border-white/20"
                >
                  <Crown className="h-10 w-10 text-white" />
                </motion.div>
                
                <div>
                  <h2 className="text-3xl font-heading font-bold text-military-glass-white mb-2">
                    Welcome to Your Empire! 👑
                  </h2>
                  <p className="text-lg text-military-storm-grey">
                    Let&apos;s get you set up in 2 simple steps
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-military-glass-white font-semibold">
                    What should we call you?
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name or business name"
                    value={name || ""}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white placeholder:text-military-storm-grey focus-visible:border-military-hot-pink focus-visible:ring-military-hot-pink/20 focus-visible:ring-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-military-glass-white font-semibold">
                    What type of business do you run?
                  </Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger className="bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white focus:ring-military-hot-pink/20 focus:border-military-hot-pink hover:border-military-hot-pink/50 transition-colors">
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent className="bg-military-tactical-black/95 backdrop-blur-xl border-military-storm-grey shadow-2xl">
                      {businessTypes.map((type) => (
                        <SelectItem 
                          key={type} 
                          value={type} 
                          className="text-military-glass-white hover:bg-military-hot-pink/20 focus:bg-military-hot-pink/30 focus:text-white cursor-pointer"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  onClick={onSkipAction}
                  variant="outline"
                  className="border-military-storm-grey/50 text-military-glass-white hover:bg-military-tactical-black hover:border-military-storm-grey transition-colors"
                >
                  Skip for Now
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!name || !businessType}
                  className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90 hover:shadow-lg hover:shadow-military-hot-pink/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-military-hot-pink to-military-blush-pink rounded-full flex items-center justify-center border border-white/20">
                  <Target className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-heading font-bold text-military-glass-white mb-2">
                    What are your main goals? 🎯
                  </h2>
                  <p className="text-military-storm-grey">
                    Select all that apply - we&apos;ll customize your experience!
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {goalOptions.map((goal) => (
                  <motion.button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl glass-card border-2 backdrop-blur-sm transition-all text-left ${
                      goals.includes(goal.id)
                        ? "border-military-hot-pink/60 ring-2 ring-military-hot-pink/40 bg-military-hot-pink/10 shadow-lg shadow-military-hot-pink/20"
                        : "border-military-storm-grey/30 hover:border-military-hot-pink/40 hover:bg-military-tactical-black/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{goal.emoji}</span>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${goals.includes(goal.id) ? "text-military-glass-white" : "text-military-glass-white/90"}`}>
                          {goal.label}
                        </h4>
                      </div>
                      {goals.includes(goal.id) && (
                        <CheckCircle className="h-5 w-5 text-military-hot-pink animate-in fade-in zoom-in duration-200" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-military-storm-grey/50 text-military-glass-white hover:bg-military-tactical-black hover:border-military-storm-grey transition-colors"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90 hover:shadow-lg hover:shadow-military-hot-pink/50 transition-all"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch Your Empire!
                </Button>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}

