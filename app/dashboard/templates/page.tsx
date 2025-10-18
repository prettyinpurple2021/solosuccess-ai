"use client"

const React = require("react")
const { useState, useEffect } = React
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  FileText, 
  Search, 
  Clock, 
  Users, 
  Zap, 
  Target, 
  Briefcase, 
  TrendingUp,
  Lightbulb,
  Crown,
  Sparkles,
  Eye,
  Download,
  Copy,
  CheckCircle,
  Star
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { logger, logInfo } from "@/lib/logger"
import { useSmartTips } from "@/hooks/use-smart-tips"

interface Template {
  id: string
  title: string
  description: string
  category: string
  tier: "launch" | "accelerator" | "dominator"
  estimatedTime: string
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  preview: string
  content: any
  usageCount: number
  rating: number
  isPremium: boolean
  isNew: boolean
  isPopular: boolean
}

export default function TemplatesDashboard() {
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTier, setSelectedTier] = useState("all")
  const [usedTemplates, setUsedTemplates] = useState(new Set())

  // Smart tips configuration for templates
  const smartTipsConfig = {
    enabled: true,
    triggers: [
      {
        condition: () => {
          // Show tip if user hasn't used any templates yet
          return usedTemplates.size === 0 && templates.length > 0
        },
        tipId: 'template-discovery',
        delay: 10000,
        cooldown: 15 * 60 * 1000 // 15 minutes
      }
    ]
  }

  useSmartTips(smartTipsConfig)

  // Mock templates data - in production, this would come from your API
  const mockTemplates: Template[] = [
    {
      id: "business-plan",
      title: "Business Plan Template",
      description: "Complete business plan with market analysis, financial projections, and growth strategy",
      category: "business",
      tier: "launch",
      estimatedTime: "2-3 hours",
      difficulty: "intermediate",
      tags: ["business", "planning", "strategy"],
      preview: "Executive Summary, Market Analysis, Financial Projections, Marketing Strategy...",
      content: {},
      usageCount: 1250,
      rating: 4.8,
      isPremium: false,
      isNew: false,
      isPopular: true
    },
    {
      id: "content-calendar",
      title: "Content Calendar Template",
      description: "Social media and content planning calendar with posting schedules",
      category: "marketing",
      tier: "launch",
      estimatedTime: "30 minutes",
      difficulty: "beginner",
      tags: ["content", "social-media", "planning"],
      preview: "Monthly calendar, content themes, posting schedule, engagement tracking...",
      content: {},
      usageCount: 890,
      rating: 4.6,
      isPremium: false,
      isNew: false,
      isPopular: true
    },
    {
      id: "saas-metrics",
      title: "SaaS Metrics Dashboard",
      description: "Comprehensive SaaS KPIs and metrics tracking template",
      category: "analytics",
      tier: "accelerator",
      estimatedTime: "1 hour",
      difficulty: "intermediate",
      tags: ["saas", "metrics", "kpis", "analytics"],
      preview: "MRR, Churn Rate, CAC, LTV, User Growth, Revenue Tracking...",
      content: {},
      usageCount: 450,
      rating: 4.9,
      isPremium: true,
      isNew: false,
      isPopular: false
    },
    {
      id: "product-roadmap",
      title: "Product Roadmap Template",
      description: "Strategic product development roadmap with feature prioritization",
      category: "product",
      tier: "dominator",
      estimatedTime: "3-4 hours",
      difficulty: "advanced",
      tags: ["product", "roadmap", "strategy", "features"],
      preview: "Vision, Goals, Features, Timeline, Resources, Risk Assessment...",
      content: {},
      usageCount: 320,
      rating: 4.7,
      isPremium: true,
      isNew: true,
      isPopular: false
    },
    {
      id: "customer-interview",
      title: "Customer Interview Guide",
      description: "Structured customer interview questions and analysis framework",
      category: "research",
      tier: "launch",
      estimatedTime: "45 minutes",
      difficulty: "beginner",
      tags: ["customer", "research", "interviews", "feedback"],
      preview: "Pre-interview prep, Question framework, Analysis template, Action items...",
      content: {},
      usageCount: 670,
      rating: 4.5,
      isPremium: false,
      isNew: false,
      isPopular: false
    },
    {
      id: "fundraising-pitch",
      title: "Fundraising Pitch Deck",
      description: "Investor pitch deck template with financial models and growth projections",
      category: "fundraising",
      tier: "dominator",
      estimatedTime: "4-5 hours",
      difficulty: "advanced",
      tags: ["fundraising", "pitch", "investors", "financial"],
      preview: "Problem, Solution, Market, Business Model, Financials, Team, Ask...",
      content: {},
      usageCount: 180,
      rating: 4.9,
      isPremium: true,
      isNew: false,
      isPopular: false
    }
  ]

  const categories = [
    { id: "all", label: "All Templates", icon: FileText },
    { id: "business", label: "Business", icon: Briefcase },
    { id: "marketing", label: "Marketing", icon: TrendingUp },
    { id: "product", label: "Product", icon: Target },
    { id: "analytics", label: "Analytics", icon: Zap },
    { id: "research", label: "Research", icon: Lightbulb },
    { id: "fundraising", label: "Fundraising", icon: Crown }
  ]

  const tiers = [
    { id: "all", label: "All Tiers", color: "bg-gray-100" },
    { id: "launch", label: "Launch", color: "bg-green-100 text-green-800" },
    { id: "accelerator", label: "Accelerator", color: "bg-blue-100 text-blue-800" },
    { id: "dominator", label: "Dominator", color: "bg-purple-100 text-purple-800" }
  ]

  useEffect(() => {
    setTemplates(mockTemplates)
    setFilteredTemplates(mockTemplates)
    
    // Load used templates from localStorage
    const used = localStorage.getItem('used-templates')
    if (used) {
      setUsedTemplates(new Set(JSON.parse(used)))
    }
  }, [])

  useEffect(() => {
    let filtered = templates

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((template: Template) =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((template: Template) => template.category === selectedCategory)
    }

    // Filter by tier
    if (selectedTier !== "all") {
      filtered = filtered.filter((template: Template) => template.tier === selectedTier)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, selectedCategory, selectedTier])

  const handleUseTemplate = (template: Template) => {
    logInfo('Using template:', { templateId: template.id })
    
    // Track usage
    const newUsedTemplates = new Set(usedTemplates)
    newUsedTemplates.add(template.id)
    setUsedTemplates(newUsedTemplates)
    localStorage.setItem('used-templates', JSON.stringify(Array.from(newUsedTemplates)))
    
    // In production, this would:
    // 1. Check user's subscription tier
    // 2. Apply template to user's workspace
    // 3. Track usage analytics
    // 4. Redirect to appropriate page
    
    // For now, show success message
    alert(`Template "${template.title}" has been applied to your workspace!`)
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "launch": return <Sparkles className="h-4 w-4" />
      case "accelerator": return <Zap className="h-4 w-4" />
      case "dominator": return <Crown className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const userTier = user?.subscription_tier || "launch"
  const canAccessTemplate = (template: Template) => {
    if (template.tier === "launch") return true
    if (template.tier === "accelerator" && (userTier === "accelerator" || userTier === "dominator")) return true
    if (template.tier === "dominator" && userTier === "dominator") return true
    return false
  }

  return (
    <div className="min-h-screen gradient-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold boss-heading mb-2">
                Template Library 📚
              </h1>
              <p className="text-lg text-muted-foreground">
                Professional templates to accelerate your business growth
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm border border-gray-300">
                {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map(tier => (
                  <SelectItem key={tier.id} value={tier.id}>
                    <div className="flex items-center gap-2">
                      {tier.id !== "all" && getTierIcon(tier.id)}
                      {tier.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: Template) => {
            const hasAccess = canAccessTemplate(template)
            const isUsed = usedTemplates.has(template.id)
            
            return (
              <Card key={template.id} className="boss-card hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTierIcon(template.tier)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {template.isNew && <span className="px-2 py-1 rounded-full text-xs border border-gray-300">New</span>}
                      {template.isPopular && <span className="px-2 py-1 rounded-full text-xs border border-gray-300">Popular</span>}
                      {template.isPremium && <span className="px-2 py-1 rounded-full text-xs border border-gray-300">Premium</span>}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.estimatedTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {template.usageCount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {template.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{template.title}</DialogTitle>
                          <DialogDescription>
                            {template.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Template Preview:</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.preview}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>⏱️ {template.estimatedTime}</span>
                              <span>👥 {template.usageCount.toLocaleString()} uses</span>
                              <span>⭐ {template.rating}</span>
                            </div>
                            <Button
                              onClick={() => handleUseTemplate(template)}
                              disabled={!hasAccess}
                              className="punk-button text-white"
                            >
                              {isUsed ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Used
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  Use Template
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      onClick={() => handleUseTemplate(template)}
                      disabled={!hasAccess}
                      size="sm"
                      className="flex-1"
                    >
                      {isUsed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Used
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Use
                        </>
                      )}
                    </Button>
                  </div>

                  {!hasAccess && (
                    <div className="text-xs text-muted-foreground text-center">
                      Upgrade to {template.tier} plan to access this template
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}