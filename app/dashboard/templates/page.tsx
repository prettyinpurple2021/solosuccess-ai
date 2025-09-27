"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HolographicCard } from "@/components/ui/holographic-card"
import { HolographicButton } from "@/components/ui/holographic-button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import templateData from "@/data/templates.json"
import {
  FileText,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Zap,
  Crown,
  Sparkles,
  Plus,
  Bookmark,
  TrendingUp,
  Target,
  Lightbulb,
  UserCog,
  ArrowRight,
  Lock,
  CheckCircle,
  Loader2,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  Copy
} from "lucide-react"

type Template = {
  id: string
  title: string
  description: string
  slug: string
  isInteractive: boolean
  requiredRole: string
  category: string
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
  popularity: number
  tags: string[]
  isAiPowered: boolean
  lastUpdated: string
}

type SavedTemplate = {
  id: string
  title: string
  template_slug: string
  created_at: string
  updated_at: string
  progress: number
  isFavorite: boolean
}

type UserSubscription = {
  tier: "free_launchpad" | "pro_accelerator" | "empire_dominator"
  hasAccess: boolean
}

const SUBSCRIPTION_TIERS = {
  free_launchpad: { name: "Free Launchpad", color: "bg-blue-500", icon: Target },
  pro_accelerator: { name: "Pro Accelerator", color: "bg-purple-500", icon: Zap },
  empire_dominator: { name: "Empire Dominator", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: Crown }
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500", 
  advanced: "bg-red-500"
}

export default function TemplatesDashboard() {
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedTier, setSelectedTier] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("browse")
  const [userSubscription, setUserSubscription] = useState<UserSubscription>({ tier: "free_launchpad", hasAccess: false })
  const [generating, setGenerating] = useState(false)

  // Flatten template data for easier filtering
  const allTemplates: Template[] = templateData.flatMap(category => 
    category.templates.map(template => ({
      ...template,
      category: category.category,
      estimatedTime: getEstimatedTime(template.slug),
      difficulty: getDifficulty(template.slug),
      popularity: Math.floor(Math.random() * 100),
      tags: getTags(template.slug),
      isAiPowered: template.isInteractive,
      lastUpdated: "2024-01-15"
    }))
  )

  const categories = ["all", ...Array.from(new Set(allTemplates.map(t => t.category)))]

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
      try {
        setLoading(true)
      
      // Load saved templates
      const templatesRes = await fetch("/api/templates", {
          headers: {
            ...(typeof window !== "undefined" && localStorage.getItem("authToken")
              ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
              : {}),
          },
        })
      
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json()
        setSavedTemplates(templatesData.userTemplates || [])
      }

      // Load user subscription (mock for now)
      setUserSubscription({ tier: "pro_accelerator", hasAccess: true })
      
      } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

  const hasAccess = (template: Template) => {
    const tierOrder = { free_launchpad: 1, pro_accelerator: 2, empire_dominator: 3 }
    const userTierLevel = tierOrder[userSubscription.tier]
    const requiredTierLevel = tierOrder[template.requiredRole as keyof typeof tierOrder]
    return userTierLevel >= requiredTierLevel
  }

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase()) ||
                         template.description.toLowerCase().includes(search.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty
    const matchesTier = selectedTier === "all" || template.requiredRole === selectedTier

    return matchesSearch && matchesCategory && matchesDifficulty && matchesTier
  })

  const generateCustomTemplate = async () => {
    setGenerating(true)
    try {
      // Mock AI template generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Custom template generated!", { icon: "✨" })
    } catch (error) {
      toast.error("Failed to generate template", { icon: "❌" })
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-400" />
          <p className="text-purple-200">Loading your template dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md"
              >
                <FileText className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-gradient">Template Studio</h1>
                <p className="text-lg text-purple-200">
                  AI-powered templates to accelerate your business growth
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HolographicButton
              variant="outline"
              size="sm"
              onClick={generateCustomTemplate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Generate Custom
            </HolographicButton>
      </div>
        </motion.div>

        {/* Subscription Status */}
        <HolographicCard>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${SUBSCRIPTION_TIERS[userSubscription.tier].color}`}>
                {React.createElement(SUBSCRIPTION_TIERS[userSubscription.tier].icon, { className: "w-4 h-4 text-white" })}
              </div>
              <div>
                <h3 className="font-semibold text-white">{SUBSCRIPTION_TIERS[userSubscription.tier].name}</h3>
                <p className="text-sm text-purple-200">Access to {userSubscription.tier === "free_launchpad" ? "basic" : userSubscription.tier === "pro_accelerator" ? "premium" : "all"} templates</p>
              </div>
            </div>
            {userSubscription.tier !== "empire_dominator" && (
              <HolographicButton variant="outline" size="sm">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </HolographicButton>
            )}
          </CardContent>
        </HolographicCard>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-purple-900/50 border border-purple-700">
            <TabsTrigger value="browse" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <Eye className="w-4 h-4 mr-2" />
              Browse Templates
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <Bookmark className="w-4 h-4 mr-2" />
              My Templates
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <Star className="w-4 h-4 mr-2" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <HolographicCard>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      placeholder="Search templates..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 bg-white/5 border-purple-700 text-white placeholder:text-purple-300"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/5 border-purple-700 text-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 text-white border-purple-700">
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="bg-white/5 border-purple-700 text-white">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 text-white border-purple-700">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="bg-white/5 border-purple-700 text-white">
                      <SelectValue placeholder="Subscription Tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-900 text-white border-purple-700">
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="free_launchpad">Free Launchpad</SelectItem>
                      <SelectItem value="pro_accelerator">Pro Accelerator</SelectItem>
                      <SelectItem value="empire_dominator">Empire Dominator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </HolographicCard>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <HolographicCard className={`h-full ${!hasAccess(template) ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            {template.title}
                            {template.isAiPowered && (
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-purple-200 text-sm">
                            {template.description}
                          </CardDescription>
                        </div>
                        {!hasAccess(template) && (
                          <Lock className="w-5 h-5 text-yellow-400" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Template Info */}
                      <div className="flex items-center gap-2 text-xs text-purple-300">
                        <Clock className="w-3 h-3" />
                        <span>{template.estimatedTime}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-white ${DIFFICULTY_COLORS[template.difficulty]} border-0`}
                        >
                          {template.difficulty}
                        </Badge>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs text-purple-300 border-purple-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Subscription Tier */}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${SUBSCRIPTION_TIERS[template.requiredRole as keyof typeof SUBSCRIPTION_TIERS].color} text-white border-0 text-xs`}
                        >
                          {SUBSCRIPTION_TIERS[template.requiredRole as keyof typeof SUBSCRIPTION_TIERS].name}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-purple-300">
                          <Star className="w-3 h-3" />
                          <span>{template.popularity}%</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {hasAccess(template) ? (
                          <>
                            <HolographicButton size="sm" className="flex-1" asChild>
                              <Link href={`/templates/${template.slug}`}>
                                <ArrowRight className="w-3 h-3 mr-1" />
                                Use Template
                              </Link>
                            </HolographicButton>
                            <Button variant="outline" size="sm" className="text-purple-200 border-purple-700">
                              <Star className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <HolographicButton size="sm" className="flex-1" variant="outline">
                            <Lock className="w-3 h-3 mr-1" />
                            Upgrade Required
                          </HolographicButton>
                        )}
                      </div>
                    </CardContent>
                  </HolographicCard>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedTemplates.length === 0 ? (
              <HolographicCard>
                <CardContent className="py-16 text-center">
                  <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No saved templates yet</h3>
                  <p className="text-purple-200 mb-6">Start exploring templates and save your favorites for quick access.</p>
                  <HolographicButton asChild>
                    <Link href="/templates">Browse Templates</Link>
                  </HolographicButton>
                </CardContent>
              </HolographicCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <HolographicCard>
              <CardHeader>
                        <CardTitle className="text-lg text-white">{template.title}</CardTitle>
                        <CardDescription className="text-purple-200">
                          Progress: {template.progress}%
                        </CardDescription>
              </CardHeader>
                      <CardContent className="space-y-4">
                        <Progress value={template.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-purple-300">
                          <span>Updated {new Date(template.updated_at).toLocaleDateString()}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-purple-200 hover:text-white">
                              <Trash2 className="w-3 h-3" />
                </Button>
                          </div>
                        </div>
                        <HolographicButton size="sm" className="w-full" asChild>
                          <Link href={`/templates/${template.template_slug}`}>
                            Continue Working
                          </Link>
                        </HolographicButton>
              </CardContent>
                    </HolographicCard>
                  </motion.div>
          ))}
        </div>
      )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <HolographicCard>
              <CardContent className="py-16 text-center">
                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                <p className="text-purple-200 mb-6">Star templates you love to find them quickly here.</p>
                <HolographicButton asChild>
                  <Link href="/templates">Browse Templates</Link>
                </HolographicButton>
              </CardContent>
            </HolographicCard>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HolographicCard>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-300" />
                    Templates Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{savedTemplates.length}</div>
                  <p className="text-sm text-purple-200">This month</p>
                </CardContent>
              </HolographicCard>

              <HolographicCard>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-300" />
                    Time Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">24h</div>
                  <p className="text-sm text-purple-200">Estimated</p>
                </CardContent>
              </HolographicCard>

              <HolographicCard>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-pink-300" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">87%</div>
                  <p className="text-sm text-purple-200">Average</p>
                </CardContent>
              </HolographicCard>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

// Helper functions
function getEstimatedTime(slug: string): string {
  const timeMap: Record<string, string> = {
    "decision-dashboard": "15 min",
    "vision-board-generator": "30 min",
    "quarterly-biz-review": "45 min",
    "delegation-list-builder": "20 min",
    "i-hate-this-tracker": "10 min",
    "freebie-funnel-builder": "60 min",
    "dm-sales-script-generator": "25 min",
    "offer-comparison-matrix": "35 min",
    "live-launch-tracker": "90 min",
    "upsell-flow-builder": "40 min",
    "pre-mortem-template": "30 min",
    "reverse-engineer-role-models": "25 min",
    "big-leap-planner": "50 min",
    "offer-naming-generator": "20 min",
    "founder-feelings-tracker": "15 min",
    "brag-bank-template": "20 min",
    "ai-collab-planner": "35 min",
    "pr-pitch-template": "25 min",
    "viral-hook-generator": "15 min",
    "values-aligned-biz-filter": "20 min"
  }
  return timeMap[slug] || "30 min"
}

function getDifficulty(slug: string): "beginner" | "intermediate" | "advanced" {
  const difficultyMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
    "decision-dashboard": "beginner",
    "vision-board-generator": "beginner",
    "quarterly-biz-review": "intermediate",
    "delegation-list-builder": "intermediate",
    "i-hate-this-tracker": "beginner",
    "freebie-funnel-builder": "advanced",
    "dm-sales-script-generator": "intermediate",
    "offer-comparison-matrix": "intermediate",
    "live-launch-tracker": "advanced",
    "upsell-flow-builder": "advanced",
    "pre-mortem-template": "intermediate",
    "reverse-engineer-role-models": "beginner",
    "big-leap-planner": "advanced",
    "offer-naming-generator": "beginner",
    "founder-feelings-tracker": "beginner",
    "brag-bank-template": "beginner",
    "ai-collab-planner": "intermediate",
    "pr-pitch-template": "intermediate",
    "viral-hook-generator": "beginner",
    "values-aligned-biz-filter": "beginner"
  }
  return difficultyMap[slug] || "intermediate"
}

function getTags(slug: string): string[] {
  const tagMap: Record<string, string[]> = {
    "decision-dashboard": ["decision-making", "planning", "analysis"],
    "vision-board-generator": ["vision", "goals", "visual"],
    "quarterly-biz-review": ["review", "metrics", "reflection"],
    "delegation-list-builder": ["delegation", "productivity", "automation"],
    "i-hate-this-tracker": ["burnout", "productivity", "wellness"],
    "freebie-funnel-builder": ["funnel", "lead-gen", "marketing"],
    "dm-sales-script-generator": ["sales", "scripts", "social-media"],
    "offer-comparison-matrix": ["pricing", "comparison", "packages"],
    "live-launch-tracker": ["launch", "marketing", "campaign"],
    "upsell-flow-builder": ["upsell", "sales", "conversion"],
    "pre-mortem-template": ["planning", "risk", "strategy"],
    "reverse-engineer-role-models": ["learning", "analysis", "role-models"],
    "big-leap-planner": ["planning", "big-decisions", "strategy"],
    "offer-naming-generator": ["naming", "branding", "ai-powered"],
    "founder-feelings-tracker": ["wellness", "tracking", "mental-health"],
    "brag-bank-template": ["testimonials", "social-proof", "content"],
    "ai-collab-planner": ["collaboration", "content", "networking"],
    "pr-pitch-template": ["pr", "media", "pitching"],
    "viral-hook-generator": ["content", "viral", "social-media"],
    "values-aligned-biz-filter": ["values", "decision-making", "alignment"]
  }
  return tagMap[slug] || ["business", "template"]
}