"use client"

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
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
  Star,
  Trash2
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { logger, logInfo } from "@/lib/logger"
import { useSmartTips } from "@/hooks/use-smart-tips"
import { GlassCard, CamoBackground, TacticalGrid } from "@/components/military"
import { useTemplateSave } from "@/hooks/use-templates-swr"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  user_id: string
}

const categories = [
  { id: "all", label: "All Categories", icon: FileText },
  { id: "business", label: "Business Strategy", icon: Target },
  { id: "marketing", label: "Marketing & Sales", icon: TrendingUp },
  { id: "finance", label: "Financial Planning", icon: Briefcase },
  { id: "operations", label: "Operations", icon: Zap },
  { id: "legal", label: "Legal & Compliance", icon: FileText },
  { id: "hr", label: "HR & Team", icon: Users },
  { id: "innovation", label: "Innovation", icon: Lightbulb },
]

const tiers = [
  { id: "all", label: "All Tiers" },
  { id: "launch", label: "Launch Plan" },
  { id: "accelerator", label: "Accelerator Plan" },
  { id: "dominator", label: "Dominator Plan" },
]

export default function TemplatesDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { saveTemplate, isSaving } = useTemplateSave()
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
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

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/templates', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          const mappedTemplates = data.map((t: any) => ({
            ...t,
            tier: t.tier || 'launch',
            estimatedTime: t.estimated_minutes ? `${t.estimated_minutes} min` : '15 min',
            difficulty: t.difficulty || 'beginner',
            tags: t.tags || [],
            preview: t.content ? t.content.substring(0, 100) + '...' : 'No preview available',
            usageCount: t.usage_count || 0,
            rating: t.rating ? Number(t.rating) : 0,
            isPremium: t.is_premium || false,
            isNew: t.created_at ? new Date(t.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 : false,
            isPopular: (t.usage_count || 0) > 50
          }))
          setTemplates(mappedTemplates)
          setFilteredTemplates(mappedTemplates)
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error)
        toast({
          title: "Error",
          description: "Failed to load templates. Please try again.",
          variant: "destructive"
        })
      }
    }

    fetchTemplates()
  }, [toast])

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

  const handleUseTemplate = async (template: Template) => {
    try {
      // Call API to save template to user workspace
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          content: template.content,
          category: template.category,
          is_public: false
        })
      })

      if (response.ok) {
        setUsedTemplates(prev => new Set(prev).add(template.id))
        toast({
          title: "Template Added",
          description: "Template has been added to your workspace.",
        })
        // Optionally redirect to edit page
        // router.push(`/dashboard/templates/${newTemplateId}`)
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      console.error('Error using template:', error)
      toast({
        title: "Error",
        description: "Failed to add template to workspace.",
        variant: "destructive"
      })
    }
  }

  const handleEditTemplate = async (id: string, updates: Partial<Template>) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updated = await response.json()
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
        toast({
          title: "Template Updated",
          description: "Your template has been updated successfully.",
        })
      } else {
        throw new Error('Failed to update template')
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast({
        title: "Error",
        description: "Failed to update template.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setTemplates(prev => prev.filter(t => t.id !== id))
        toast({
          title: "Template Deleted",
          description: "Your template has been deleted.",
        })
      } else {
        throw new Error('Failed to delete template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive"
      })
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "launch": return <Sparkles className="h-4 w-4" />
      case "accelerator": return <Zap className="h-4 w-4" />
      case "dominator": return <Crown className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
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
    <div className="min-h-screen bg-military-midnight relative overflow-hidden p-6">
      <CamoBackground opacity={0.1} withGrid />
      <TacticalGrid />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-heading font-bold text-military-glass-white mb-2">
                Template Library 📚
              </h1>
              <p className="text-lg text-military-storm-grey">
                Professional templates to accelerate your business growth
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm border border-military-storm-grey text-military-glass-white bg-military-tactical-black/50">
                {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-military-storm-grey" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10 bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white placeholder:text-military-storm-grey"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-military-tactical-black border-military-storm-grey">
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id} className="text-military-glass-white hover:bg-military-midnight">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger className="w-full md:w-48 bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent className="bg-military-tactical-black border-military-storm-grey">
                {tiers.map(tier => (
                  <SelectItem key={tier.id} value={tier.id} className="text-military-glass-white hover:bg-military-midnight">
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
              <GlassCard key={template.id} className="p-6 hover:shadow-lg transition-all duration-200" glow>
                <div className="space-y-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTierIcon(template.tier)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.difficulty === "beginner" ? "bg-green-500/20 text-green-400" :
                        template.difficulty === "intermediate" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                        {template.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {template.isNew && <span className="px-2 py-1 rounded-full text-xs border border-military-hot-pink/30 text-military-hot-pink">New</span>}
                      {template.isPopular && <span className="px-2 py-1 rounded-full text-xs border border-military-hot-pink/30 text-military-hot-pink">Popular</span>}
                      {template.isPremium && <span className="px-2 py-1 rounded-full text-xs border border-military-hot-pink/30 text-military-hot-pink">Premium</span>}
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-military-glass-white">{template.title}</h3>
                  <p className="text-sm text-military-storm-grey">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-military-storm-grey">
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
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-military-tactical-black/50 text-military-storm-grey border border-white/10">
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-full text-xs bg-military-tactical-black/50 text-military-storm-grey border border-white/10">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 border-military-storm-grey text-military-glass-white hover:bg-military-tactical-black">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-military-tactical-black border-military-storm-grey">
                        <DialogHeader>
                          <DialogTitle className="text-military-glass-white">{template.title}</DialogTitle>
                          <DialogDescription className="text-military-storm-grey">
                            {template.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 glass-card rounded-lg">
                            <h4 className="font-medium mb-2 text-military-glass-white">Template Preview:</h4>
                            <p className="text-sm text-military-storm-grey">
                              {template.preview}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-military-storm-grey">
                              <span>⏱️ {template.estimatedTime}</span>
                              <span>👥 {template.usageCount.toLocaleString()} uses</span>
                              <span>⭐ {template.rating}</span>
                            </div>
                            <Button
                              onClick={() => handleUseTemplate(template)}
                              disabled={!hasAccess || isSaving}
                              className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90"
                            >
                              {isUsed ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4 mr-2" />
                                  Add to Workspace
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={() => handleUseTemplate(template)}
                      disabled={!hasAccess || isSaving}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90"
                    >
                      {isUsed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Added
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>

                  {template.user_id === user?.id && (
                    <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1 border-military-storm-grey text-military-glass-white hover:bg-military-tactical-black">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-military-tactical-black border-military-storm-grey">
                          <DialogHeader>
                            <DialogTitle className="text-military-glass-white">Edit Template</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm text-military-storm-grey">Title</label>
                              <Input
                                defaultValue={template.title}
                                onChange={(e) => template.title = e.target.value} // Note: This is a quick hack for the dialog, ideally use state
                                className="bg-military-tactical-black/50 border-military-storm-grey text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-military-storm-grey">Description</label>
                              <Input
                                defaultValue={template.description}
                                onChange={(e) => template.description = e.target.value}
                                className="bg-military-tactical-black/50 border-military-storm-grey text-white"
                              />
                            </div>
                            <Button
                              onClick={() => handleEditTemplate(template.id, { title: template.title, description: template.description })}
                              className="w-full bg-military-hot-pink hover:bg-military-hot-pink/90"
                            >
                              Save Changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}

                  {!hasAccess && (
                    <div className="text-xs text-military-storm-grey text-center pt-2">
                      Upgrade to {template.tier} plan to access this template
                    </div>
                  )}
                </div>
              </GlassCard>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-military-storm-grey mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-military-glass-white">No templates found</h3>
            <p className="text-military-storm-grey">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}