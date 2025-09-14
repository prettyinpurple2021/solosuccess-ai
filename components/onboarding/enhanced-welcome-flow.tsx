"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Crown, 
  Sparkles, 
  Target, 
  Users, 
  Rocket, 
  Gift, 
  Star,
  Zap,
  TrendingUp,
  Brain,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  ArrowLeft
} from "lucide-react"

interface WelcomeFlowProps {
  open: boolean
  onComplete: (data: any) => void
  onSkip: () => void
  userData?: any
}

export function EnhancedWelcomeFlow({ open, onComplete, onSkip, userData }: WelcomeFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [userPreferences, setUserPreferences] = useState({
    animations: true,
    sound: true,
    autoAdvance: false,
    voiceGuidance: false
  })

  const welcomeSteps = [
    {
      id: "welcome",
      title: "Welcome to Your Empire! 👑",
      subtitle: "You're about to become unstoppable",
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      content: (
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Crown className="h-12 w-12 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold boss-heading mb-2">
              Ready to Rule Your Industry? 🚀
            </h2>
            <p className="text-lg text-muted-foreground">
              Your AI-powered productivity empire awaits. Let's get you set up for maximum success!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">8 AI Agents</h3>
              <p className="text-xs text-muted-foreground">Your personal team</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl">
              <Target className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Smart Goals</h3>
              <p className="text-xs text-muted-foreground">AI-powered tracking</p>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      id: "personality",
      title: "What's Your Boss Energy? ⚡",
      subtitle: "Let's match your vibe",
      icon: Brain,
      color: "from-pink-500 to-purple-500",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Choose Your Power Style</h3>
            <p className="text-muted-foreground mb-6">
              This helps us customize your AI agents and dashboard experience
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                id: "strategic",
                name: "Strategic Mastermind",
                emoji: "🧠",
                description: "Data-driven, analytical, loves frameworks",
                color: "from-blue-500 to-indigo-500"
              },
              {
                id: "creative",
                name: "Creative Visionary",
                emoji: "🎨",
                description: "Innovative, artistic, thinks outside the box",
                color: "from-pink-500 to-rose-500"
              },
              {
                id: "dynamic",
                name: "Dynamic Leader",
                emoji: "⚡",
                description: "High-energy, action-oriented, gets things done",
                color: "from-yellow-500 to-orange-500"
              },
              {
                id: "balanced",
                name: "Balanced Boss",
                emoji: "⚖️",
                description: "Well-rounded, adaptable, team-focused",
                color: "from-green-500 to-teal-500"
              }
            ].map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-4 border-2 border-transparent hover:border-purple-200 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{style.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{style.name}</h4>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${style.color}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "goals",
      title: "What Are You Crushing? 🎯",
      subtitle: "Your empire objectives",
      icon: Target,
      color: "from-teal-500 to-blue-500",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Select Your Primary Goals</h3>
            <p className="text-muted-foreground mb-6">
              Choose up to 3 main objectives - we'll customize everything around these!
            </p>
          </div>

          <div className="grid gap-3">
            {[
              { id: "productivity", label: "Boost Productivity", emoji: "⚡", desc: "Get more done in less time" },
              { id: "growth", label: "Scale Business", emoji: "📈", desc: "Grow revenue and reach" },
              { id: "automation", label: "Automate Everything", emoji: "🤖", desc: "Reduce manual work" },
              { id: "wellness", label: "Work-Life Balance", emoji: "🧘‍♀️", desc: "Prevent burnout" },
              { id: "creativity", label: "Boost Creativity", emoji: "🎨", desc: "Generate fresh ideas" },
              { id: "organization", label: "Get Organized", emoji: "📋", desc: "Streamline workflows" }
            ].map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 border-2 border-transparent hover:border-teal-200 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{goal.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{goal.label}</h4>
                    <p className="text-sm text-muted-foreground">{goal.desc}</p>
                  </div>
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "ai-team",
      title: "Meet Your AI Squad! 👯‍♀️",
      subtitle: "Your 24/7 productivity team",
      icon: Users,
      color: "from-orange-500 to-red-500",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Choose Your Starting Team</h3>
            <p className="text-muted-foreground mb-6">
              Pick 2-3 agents to start with - you can add more later!
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                id: "roxy",
                name: "Roxy",
                role: "Strategic Decision Architect",
                emoji: "👑",
                description: "Helps with big decisions using SPADE framework",
                specialties: ["Strategy", "Decisions", "Planning"]
              },
              {
                id: "blaze",
                name: "Blaze",
                role: "Growth Strategist",
                emoji: "🔥",
                description: "Drives growth and identifies opportunities",
                specialties: ["Growth", "Sales", "Strategy"]
              },
              {
                id: "echo",
                name: "Echo",
                role: "Marketing Maven",
                emoji: "📢",
                description: "Creates content and builds your brand",
                specialties: ["Content", "Branding", "Social Media"]
              },
              {
                id: "lumi",
                name: "Lumi",
                role: "Guardian AI",
                emoji: "🛡️",
                description: "Handles compliance and legal matters",
                specialties: ["Legal", "Compliance", "Security"]
              }
            ].map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4 border-2 border-transparent hover:border-orange-200 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{agent.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{agent.name}</h4>
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    </div>
                    <p className="text-sm font-medium text-orange-600 mb-2">{agent.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "preferences",
      title: "Customize Your Experience ⚙️",
      subtitle: "Make it uniquely yours",
      icon: Settings,
      color: "from-indigo-500 to-purple-500",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Personalize Your Setup</h3>
            <p className="text-muted-foreground mb-6">
              Choose your preferences for the best experience
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "animations",
                label: "Smooth Animations",
                description: "Beautiful transitions and effects",
                icon: Sparkles,
                enabled: userPreferences.animations
              },
              {
                id: "sound",
                label: "Sound Effects",
                description: "Audio feedback for actions",
                icon: soundEnabled ? Volume2 : VolumeX,
                enabled: userPreferences.sound
              },
              {
                id: "autoAdvance",
                label: "Auto-Advance Tutorials",
                description: "Automatically move through steps",
                icon: Play,
                enabled: userPreferences.autoAdvance
              },
              {
                id: "voiceGuidance",
                label: "Voice Guidance",
                description: "Audio instructions and tips",
                icon: Volume2,
                enabled: userPreferences.voiceGuidance
              }
            ].map((pref, index) => (
              <motion.div
                key={pref.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex items-center justify-between p-4 border-2 border-transparent hover:border-indigo-200 rounded-xl cursor-pointer transition-all duration-200"
                onClick={() => setUserPreferences(prev => ({
                  ...prev,
                  [pref.id]: !(prev as any)[pref.id as keyof typeof prev]
                }))}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    userPreferences[pref.id as keyof typeof userPreferences] 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                      : 'bg-gray-100'
                  }`}>
                    <pref.icon className={`h-5 w-5 ${
                      userPreferences[pref.id as keyof typeof userPreferences] 
                        ? 'text-white' 
                        : 'text-gray-500'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{pref.label}</h4>
                    <p className="text-sm text-muted-foreground">{pref.description}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  userPreferences[pref.id as keyof typeof userPreferences]
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent'
                    : 'border-gray-300'
                }`}>
                  {userPreferences[pref.id as keyof typeof userPreferences] && (
                    <CheckCircle className="h-5 w-5 text-white" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "complete",
      title: "You're Ready to Rule! 🚀",
      subtitle: "Your empire awaits",
      icon: Rocket,
      color: "from-green-500 to-teal-500",
      content: (
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center"
          >
            <Rocket className="h-12 w-12 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold boss-heading mb-2">
              Welcome to Your Empire! 👑
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Your SoloSuccess AI platform is ready to help you dominate your industry!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card className="boss-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  Welcome Bonus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm font-medium">🎉 7-Day Premium Trial</p>
                  <p className="text-xs text-muted-foreground">Access to all features</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                  <p className="text-sm font-medium">🚀 100 AI Credits</p>
                  <p className="text-xs text-muted-foreground">Bonus conversations</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <p className="text-sm font-medium">📚 Premium Templates</p>
                  <p className="text-xs text-muted-foreground">50+ business templates</p>
                </div>
              </CardContent>
            </Card>

            <Card className="boss-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Chat with AI</p>
                    <p className="text-xs text-muted-foreground">Start your first conversation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <Target className="h-5 w-5 text-pink-600" />
                  <div>
                    <p className="text-sm font-medium">Create Goals</p>
                    <p className="text-xs text-muted-foreground">Set your first objectives</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  <div>
                    <p className="text-sm font-medium">Track Progress</p>
                    <p className="text-xs text-muted-foreground">Monitor your success</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-lg font-semibold empowering-text"
          >
            <Sparkles className="h-5 w-5" />
            Ready to dominate your industry!
            <Sparkles className="h-5 w-5" />
          </motion.div>
        </div>
      )
    }
  ]

  const totalSteps = welcomeSteps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete({
        userPreferences,
        completedAt: new Date().toISOString(),
        stepsCompleted: totalSteps
      })
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = welcomeSteps[currentStep]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="boss-card border-2 border-purple-200 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="boss-heading text-2xl flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center`}>
                    <currentStepData.icon className="h-5 w-5 text-white" />
                  </div>
                  {currentStepData.title}
                </CardTitle>
                <p className="text-muted-foreground mt-1">{currentStepData.subtitle}</p>
              </div>
              <Button variant="ghost" onClick={onSkip} className="text-sm">
                Skip Setup
              </Button>
            </div>
            <Progress value={progress} className="w-full mt-4" />
          </CardHeader>

          <CardContent className="py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <div className="flex justify-between items-center p-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < totalSteps - 1 ? (
                <Button
                  onClick={nextStep}
                  className="punk-button text-white flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="punk-button text-white flex items-center gap-2"
                >
                  <Rocket className="h-4 w-4" />
                  Launch Empire!
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
