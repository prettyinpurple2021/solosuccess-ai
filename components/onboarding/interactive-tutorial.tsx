"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { 
  Crown, 
  Sparkles, 
  Target,
  Users, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Rocket, 
  Brain,
  X,
  Lightbulb,
  Zap,
  TrendingUp,
  FileText,
  Settings,
  Search,
  Plus,
  Star,
  SkipForward
} from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  target: string // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right"
  content: any
  action?: {
    label: string
    onClick: () => void
  }
  optional?: boolean
  estimatedTime?: number // Estimated time to complete this step
  difficulty?: "easy" | "medium" | "hard" // Step difficulty level
  tags?: string[] // Tags for categorization
}

interface InteractiveTutorialProps {
  open: boolean
  onCompleteAction: () => void
  onSkipAction: () => void
  tutorialType: "dashboard" | "ai-agents" | "tasks" | "goals" | "files" | "complete"
  customSteps?: TutorialStep[] // Allow custom tutorial steps
  showProgressBar?: boolean // Toggle progress bar visibility
  allowSkipping?: boolean // Allow users to skip steps
  showTimeEstimates?: boolean // Show estimated completion times
  onStepChange?: (stepIndex: number, stepData: TutorialStep) => void // Callback for step changes
}

export function InteractiveTutorial({ 
  open, 
  onCompleteAction, 
  onSkipAction, 
  tutorialType,
  customSteps,
  showProgressBar = true,
  allowSkipping = true,
  showTimeEstimates = false,
  onStepChange
}: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [showTips, setShowTips] = useState(false)
  const [userPreferences, setUserPreferences] = useState({
    showAnimations: true,
    autoAdvance: false,
    voiceEnabled: false
  })
  const overlayRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  // Tutorial steps for different sections
  const tutorialSteps: Record<string, TutorialStep[]> = {
    dashboard: [
      {
        id: "welcome",
        title: "Welcome to Your Empire! 👑",
        description: "Let's take a quick tour of your SoloBoss AI dashboard",
        target: ".dashboard-header",
        position: "bottom",
        estimatedTime: 30,
        difficulty: "easy",
        tags: ["welcome", "overview"],
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold boss-heading mb-2">Your Command Center</h3>
              <p className="text-muted-foreground">
                This is where you&apos;ll manage your entire business empire. Everything you need is just a click away!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>AI Agents</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-pink-500" />
                <span>Goals & Tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal-500" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-orange-500" />
                <span>Files & Docs</span>
              </div>
            </div>
            {showTimeEstimates && (
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-600">⏱️ Estimated time: 30 seconds</p>
              </div>
            )}
          </div>
        )
      },
      {
        id: "sidebar",
        title: "Your Navigation Hub 🧭",
        description: "The sidebar gives you quick access to all features",
        target: ".sidebar",
        position: "right",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Navigation</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">AI Squad</p>
                  <p className="text-xs text-muted-foreground">Chat with your AI agents</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-pink-50 rounded-lg">
                <Target className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="font-medium text-sm">Goals & Tasks</p>
                  <p className="text-xs text-muted-foreground">Manage your objectives</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-teal-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-medium text-sm">Analytics</p>
                  <p className="text-xs text-muted-foreground">Track your progress</p>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "quick-actions",
        title: "Quick Actions ⚡",
        description: "Get things done fast with these shortcuts",
        target: ".quick-actions",
        position: "bottom",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Speed Up Your Workflow</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                AI Chat
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Set Goal
              </Button>
              <Button size="sm" variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              These buttons let you create tasks, chat with AI agents, set goals, and upload files instantly!
            </p>
          </div>
        )
      },
      {
        id: "stats-overview",
        title: "Your Progress at a Glance 📊",
        description: "See how you're crushing your goals",
        target: ".stats-overview",
        position: "top",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Real-Time Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div>
                  <p className="font-bold text-2xl text-purple-600">87%</p>
                  <p className="text-sm text-muted-foreground">Task Completion</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                <div>
                  <p className="font-bold text-2xl text-teal-600">12</p>
                  <p className="text-sm text-muted-foreground">Goals Active</p>
                </div>
                <Target className="h-8 w-8 text-teal-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your dashboard updates in real-time to show your progress and keep you motivated!
            </p>
          </div>
        )
      }
    ],
    "ai-agents": [
      {
        id: "agents-intro",
        title: "Meet Your AI Squad! 👯‍♀️",
        description: "Your personal team of AI agents ready to help",
        target: ".ai-agents-section",
        position: "bottom",
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold boss-heading mb-2">Your AI Team</h3>
              <p className="text-muted-foreground">
                Each agent has unique skills and personality. They work 24/7 to help you succeed!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Roxy - Executive Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span>Blaze - Growth Strategist</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span>Echo - Marketing Maven</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Lumi - Legal & Docs</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "agent-chat",
        title: "Start a Conversation 💬",
        description: "Click on any agent to start chatting",
        target: ".agent-chat-button",
        position: "left",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Chat with Your AI</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium">Try asking:</p>
                <p className="text-sm text-muted-foreground">&quot;Help me plan my week&quot;</p>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <p className="text-sm font-medium">Or:</p>
                <p className="text-sm text-muted-foreground">&quot;What should I focus on today?&quot;</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI agents remember your preferences and get smarter over time!
            </p>
          </div>
        ),
        action: {
          label: "Start Chat",
          onClick: () => {
            // This would trigger the chat interface
            console.log("Starting AI chat...")
          }
        }
      }
    ],
    tasks: [
      {
        id: "tasks-intro",
        title: "Task Management Made Easy 📋",
        description: "Organize and track your work efficiently",
        target: ".tasks-section",
        position: "bottom",
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold boss-heading mb-2">Smart Task Management</h3>
              <p className="text-muted-foreground">
                Create, organize, and track tasks with AI-powered insights and automation.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-xs font-medium">Create</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-xs font-medium">Organize</p>
              </div>
              <div>
                <div className="w-8 h-8 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-xs font-medium">Track</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: "create-task",
        title: "Create Your First Task ✨",
        description: "Let's create a task together",
        target: ".create-task-button",
        position: "bottom",
        content: (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Task Creation</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm font-medium">Voice Input</p>
                <p className="text-xs text-muted-foreground">Just speak to create tasks!</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                <p className="text-sm font-medium">AI Suggestions</p>
                <p className="text-xs text-muted-foreground">Get smart task recommendations</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Click the + button to start creating tasks with voice, text, or AI assistance!
            </p>
          </div>
        ),
        action: {
          label: "Create Task",
          onClick: () => {
            // This would open the task creation modal
            console.log("Creating task...")
          }
        }
      }
    ],
    goals: [
      {
        id: "goals-intro",
        title: "Goal Setting & Achievement 🎯",
        description: "Turn your dreams into actionable goals",
        target: ".goals-section",
        position: "bottom",
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold boss-heading mb-2">Goal Mastery</h3>
              <p className="text-muted-foreground">
                Set ambitious goals and track your progress with AI-powered insights and motivation.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">SMART goal framework</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm">AI-powered insights</span>
              </div>
            </div>
          </div>
        )
      }
    ],
    files: [
      {
        id: "files-intro",
        title: "Your Digital Briefcase 💼",
        description: "Store and organize all your important files",
        target: ".files-section",
        position: "bottom",
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold boss-heading mb-2">Smart File Management</h3>
              <p className="text-muted-foreground">
                Upload, organize, and analyze documents with AI-powered content extraction.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Document Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-500" />
                <span>AI Search</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>Content Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-orange-500" />
                <span>Smart Organization</span>
              </div>
            </div>
          </div>
        )
      }
    ],
    complete: [
      {
        id: "completion",
        title: "You're All Set! 🚀",
        description: "Your SoloBoss AI platform is ready to help you succeed",
        target: "body",
        position: "bottom",
        content: (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 rounded-full flex items-center justify-center">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold boss-heading mb-2">Welcome to Your Empire!</h3>
              <p className="text-muted-foreground mb-4">
                You&apos;ve completed the tutorial and are ready to start building your business empire with AI-powered productivity tools.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium">Next Steps:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Create your first task</li>
                  <li>• Chat with an AI agent</li>
                  <li>• Set a goal</li>
                </ul>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <p className="font-medium">Pro Tips:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Use voice commands</li>
                  <li>• Explore AI features</li>
                  <li>• Check analytics</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold empowering-text">
              <Sparkles className="h-5 w-5" />
              Ready to dominate your industry!
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        )
      }
    ]
  }

  // Use custom steps if provided, otherwise use default steps
  const finalSteps = useMemo(() => customSteps || tutorialSteps[tutorialType] || [], [customSteps, tutorialType])
  
  // Performance optimizations with useMemo
  const currentSteps = useMemo(() => finalSteps, [finalSteps])
  const totalSteps = useMemo(() => currentSteps.length, [currentSteps])
  const progress = useMemo(() => totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0, [currentStep, totalSteps])

  // Calculate estimated completion time
  const estimatedTotalTime = useMemo(() => {
    return currentSteps.reduce((total, step) => total + (step.estimatedTime || 0), 0)
  }, [currentSteps])

  // Progress persistence with localStorage
  const storageKey = useMemo(() => `tutorial-progress-${tutorialType}`, [tutorialType])
  
  // Load saved progress on mount
  useEffect(() => {
    if (open) {
      try {
        const savedProgress = localStorage.getItem(storageKey)
        if (savedProgress) {
          const { step, completed, startTime: savedStartTime, preferences } = JSON.parse(savedProgress)
          setCurrentStep(step || 0)
          setCompletedSteps(new Set(completed || []))
          if (savedStartTime) {
            setStartTime(new Date(savedStartTime))
          } else {
            setStartTime(new Date())
          }
          if (preferences) {
            setUserPreferences(prev => ({ ...prev, ...preferences }))
          }
        } else {
          setStartTime(new Date())
        }
      } catch (error) {
        console.warn('Failed to load tutorial progress:', error)
        setStartTime(new Date())
      }
    }
  }, [open, storageKey])

  // Save progress on step change
  useEffect(() => {
    if (open && startTime) {
      try {
        const progressData = {
          step: currentStep,
          completed: Array.from(completedSteps),
          startTime: startTime.toISOString(),
          lastUpdated: new Date().toISOString(),
          preferences: userPreferences
        }
        localStorage.setItem(storageKey, JSON.stringify(progressData))
      } catch (error) {
        console.warn('Failed to save tutorial progress:', error)
      }
    }
  }, [open, currentStep, completedSteps, startTime, storageKey, userPreferences])

  // Tutorial analytics tracking
  const trackTutorialEvent = (event: string, data?: any) => {
    try {
      // You can integrate this with your analytics service
      console.log('Tutorial Event:', { event, tutorialType, step: currentStep, data })
      
      // Example: Send to analytics service
      // analytics.track('tutorial_event', { event, tutorialType, step: currentStep, data })
      
      // Example: Send to Google Analytics 4
      // if (typeof gtag !== 'undefined') {
      //   gtag('event', 'tutorial_event', {
      //     event_category: 'tutorial',
      //     event_label: tutorialType,
      //     value: currentStep,
      //     custom_parameters: data
      //   })
      // }
    } catch (error) {
      console.warn('Failed to track tutorial event:', error)
    }
  }

  // Voice command integration hints
  const voiceCommands = useMemo(() => [
    { command: "next", action: "Go to next step" },
    { command: "previous", action: "Go to previous step" },
    { command: "skip", action: "Skip current step" },
    { command: "close", action: "Close tutorial" },
    { command: "tips", action: "Show/hide tips" },
    { command: "help", action: "Show help" }
  ], [])

  // Enhanced error handling and element highlighting
  useEffect(() => {
    if (open && currentSteps.length > 0) {
      const currentStepData = currentSteps[currentStep]
      if (!currentStepData) return

      // Add error handling for missing elements
      const element = document.querySelector(currentStepData.target) as HTMLElement
      if (!element) {
        console.warn(`Tutorial target element not found: ${currentStepData.target}`)
        trackTutorialEvent('element_not_found', { target: currentStepData.target })
        
        // Try to find alternative elements or show helpful message
        const alternativeElements = document.querySelectorAll('[data-tutorial-target]')
        if (alternativeElements.length > 0) {
          console.log('Found alternative tutorial targets:', alternativeElements)
        }
        return
      }
      
      if (highlightRef.current) {
        setHighlightedElement(element)
        
        // Add try-catch for scroll behavior
        try {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        } catch (error) {
          console.warn('Smooth scroll not supported, using fallback')
          element.scrollIntoView()
        }
        
        // Set position with error handling using getBoundingClientRect
        const rect = element.getBoundingClientRect()
        if (highlightRef.current) {
          highlightRef.current.style.setProperty('--highlight-top', `${rect.top - 4}px`)
          highlightRef.current.style.setProperty('--highlight-left', `${rect.left - 4}px`)
          highlightRef.current.style.setProperty('--highlight-width', `${rect.width + 8}px`)
          highlightRef.current.style.setProperty('--highlight-height', `${rect.height + 8}px`)
        }
        
        // Track step view
        trackTutorialEvent('step_viewed', { stepId: currentStepData.id, stepTitle: currentStepData.title })
        
        // Call step change callback
        onStepChange?.(currentStep, currentStepData)
      }
    }
  }, [open, currentStep, currentSteps, onStepChange])

  // Keyboard navigation for better accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          nextStep()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevStep()
          break
        case 'Escape':
          e.preventDefault()
          onSkipAction()
          break
        case 'h':
        case 'H':
          e.preventDefault()
          setShowTips(prev => !prev)
          break
        case '?':
          e.preventDefault()
          setShowTips(true)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, currentStep, totalSteps])

  // Auto-advance functionality
  useEffect(() => {
    if (userPreferences.autoAdvance && !isTransitioning && open) {
      const timer = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          nextStep()
        }
      }, 5000) // Auto-advance after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [userPreferences.autoAdvance, isTransitioning, open, currentStep, totalSteps])

  // Cleanup effect
  useEffect(() => {
    return () => {
      setHighlightedElement(null)
      setCompletedSteps(new Set())
    }
  }, [])

  // Enhanced step management with completion tracking
  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
    trackTutorialEvent('step_completed', { stepId })
  }
  
  const nextStep = async () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    
    // Mark current step as complete
    const currentStepData = currentSteps[currentStep]
    if (currentStepData) {
      markStepComplete(currentStepData.id)
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Track tutorial completion
      const completionTime = startTime ? new Date().getTime() - startTime.getTime() : 0
      trackTutorialEvent('tutorial_completed', { 
        duration: completionTime,
        totalSteps,
        completedSteps: Array.from(completedSteps)
      })
      onCompleteAction()
    }
    
    // Add small delay for smooth transitions
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      trackTutorialEvent('step_previous', { stepId: currentSteps[currentStep]?.id })
    }
  }

  const skipTutorial = () => {
    trackTutorialEvent('tutorial_skipped', { 
      currentStep, 
      completedSteps: Array.from(completedSteps),
      startTime: startTime?.toISOString()
    })
    onSkipAction()
  }

  const skipCurrentStep = () => {
    if (currentStep < totalSteps - 1) {
      nextStep()
    }
  }

  const toggleUserPreference = (key: keyof typeof userPreferences) => {
    setUserPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const resetTutorial = () => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setStartTime(new Date())
    trackTutorialEvent('tutorial_reset')
  }

  const currentStepData = currentSteps[currentStep]

  if (!currentStepData) {
    return null
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto boss-card border-2 border-purple-200 mx-4 sm:mx-auto">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="boss-heading text-xl flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                  Interactive Tutorial
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base">
                  Step {currentStep + 1} of {totalSteps} - {currentStepData.title}
                </DialogDescription>
                {showTimeEstimates && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ⏱️ {currentStepData.estimatedTime || 0}s • Total: ~{Math.round(estimatedTotalTime / 60)}m
                  </p>
                )}
                {currentStepData.difficulty && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Difficulty:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      currentStepData.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      currentStepData.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {currentStepData.difficulty}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {allowSkipping && (
                  <Button variant="ghost" size="sm" onClick={skipTutorial} className="text-sm hover:bg-purple-50 transition-colors">
                    <SkipForward className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Skip</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onSkipAction} className="text-sm hover:bg-purple-50 transition-colors">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {showProgressBar && <Progress value={progress} className="w-full" />}
          </DialogHeader>

          {/* Quick Tips Section */}
          {showTips && (
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 mb-4">
              <h4 className="font-medium text-sm text-purple-800 mb-2">💡 Quick Tips:</h4>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Use arrow keys or spacebar to navigate</li>
                <li>• Press 'H' to toggle this tips panel</li>
                <li>• Press 'Escape' to close tutorial</li>
                <li>• Press '?' for help</li>
                <li>• Voice commands coming soon! 🎤</li>
              </ul>
              
              {/* Voice Commands Preview */}
              <div className="mt-3 pt-3 border-t border-purple-200">
                <h5 className="font-medium text-xs text-purple-800 mb-2">🎤 Voice Commands (Coming Soon):</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {voiceCommands.map((cmd, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-purple-600">"{cmd.command}"</span>
                      <span className="text-purple-700">{cmd.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="py-4">
            {currentStepData.content}
          </div>

          <div className="flex flex-col sm:flex-row justify-between pt-4 border-t gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isTransitioning}
              className="flex items-center gap-2 bg-transparent hover:bg-purple-50 transition-colors order-2 sm:order-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              {currentStepData.optional && allowSkipping && (
                <Button variant="ghost" onClick={skipCurrentStep} className="text-sm hover:bg-purple-50 transition-colors">
                  Skip This
                </Button>
              )}
              <Button
                onClick={currentStepData.action ? currentStepData.action.onClick : nextStep}
                disabled={isTransitioning}
                className="punk-button text-white flex items-center gap-2 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStepData.action ? (
                  <>
                    {currentStepData.action.label}
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : currentStep === totalSteps - 1 ? (
                  <>
                    <Rocket className="h-4 w-4" />
                    Complete Tutorial
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* User Preferences Footer */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleUserPreference('showAnimations')}
                  className={`flex items-center gap-1 ${userPreferences.showAnimations ? 'text-purple-600' : ''}`}
                >
                  <Sparkles className="h-3 w-3" />
                  Animations
                </button>
                <button
                  onClick={() => toggleUserPreference('autoAdvance')}
                  className={`flex items-center gap-1 ${userPreferences.autoAdvance ? 'text-purple-600' : ''}`}
                >
                  <ArrowRight className="h-3 w-3" />
                  Auto-advance
                </button>
                <button
                  onClick={resetTutorial}
                  className="text-muted-foreground hover:text-purple-600 transition-colors"
                  title="Reset tutorial progress"
                >
                  🔄 Reset
                </button>
              </div>
              <button
                onClick={() => setShowTips(prev => !prev)}
                className="text-purple-600 hover:text-purple-800"
              >
                Press 'H' for tips
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Highlight overlay */}
      {highlightedElement && userPreferences.showAnimations && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 pointer-events-none tutorial-overlay"
        >
          <div
            ref={highlightRef}
            className="absolute border-2 border-purple-500 rounded-lg shadow-lg tutorial-highlight tutorial-highlight-position animate-pulse"
          />
        </div>
      )}
    </TooltipProvider>
  )
}
