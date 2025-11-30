"use client"

import { useState } from "react"
import { useTemplates } from "@/hooks/use-templates-swr"
import { GlassCard, CamoBackground, TacticalGrid } from "@/components/military"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Search, 
  Trash2, 
  Download, 
  Eye,
  FolderOpen,
  Calendar,
  ArrowLeft
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TemplateRenderer } from "@/components/templates/template-renderer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function WorkspacePage() {
  const router = useRouter()
  const { templates, isLoading, deleteTemplate, exportTemplate } = useTemplates()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const filteredTemplates = templates.filter(template =>
    template.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.template_slug?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getTemplateIcon = (slug: string) => {
    const iconMap: Record<string, string> = {
      'decision-dashboard': '🎯',
      'delegation-list-builder': '📋',
      'i-hate-this-tracker': '⚠️',
      'quarterly-biz-review': '📊',
      'business-plan': '📈',
      'content-calendar': '📅',
      'saas-metrics': '📊',
      'product-roadmap': '🗺️',
      'customer-interview': '💬',
      'fundraising-pitch': '💰',
    }
    return iconMap[slug] || '📄'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-military-midnight relative overflow-hidden p-6">
        <CamoBackground opacity={0.1} withGrid />
        <TacticalGrid />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center py-12">
            <div className="animate-pulse text-military-storm-grey">Loading workspace...</div>
          </div>
        </div>
      </div>
    )
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
              <div className="flex items-center gap-4 mb-2">
                <Link href="/dashboard/templates">
                  <Button variant="ghost" size="sm" className="text-military-storm-grey hover:text-military-glass-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Templates
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl font-heading font-bold text-military-glass-white mb-2">
                My Workspace 📁
              </h1>
              <p className="text-lg text-military-storm-grey">
                View and manage your saved templates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm border border-military-storm-grey text-military-glass-white bg-military-tactical-black/50">
                {templates.length} {templates.length === 1 ? 'template' : 'templates'}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-military-storm-grey" />
            <Input
              placeholder="Search your templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-military-tactical-black/50 border-military-storm-grey text-military-glass-white placeholder:text-military-storm-grey"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-16 w-16 text-military-storm-grey mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-military-glass-white mb-2">
              {searchQuery ? "No templates found" : "Your workspace is empty"}
            </h3>
            <p className="text-military-storm-grey mb-6">
              {searchQuery 
                ? "Try adjusting your search query"
                : "Start by adding templates from the template library"
              }
            </p>
            {!searchQuery && (
              <Link href="/dashboard/templates">
                <Button className="bg-gradient-to-r from-military-hot-pink to-military-blush-pink text-white hover:opacity-90">
                  Browse Templates
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <GlassCard key={template.id} className="p-6 hover:shadow-lg transition-all duration-200" glow>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getTemplateIcon(template.template_slug)}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-bold text-military-glass-white mb-1">
                          {template.title}
                        </h3>
                        <p className="text-xs text-military-storm-grey flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(template.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {template.description && (
                    <p className="text-sm text-military-storm-grey line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-military-storm-grey text-military-glass-white hover:bg-military-tactical-black"
                          onClick={() => setSelectedTemplate(template.template_slug)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-military-tactical-black border-military-storm-grey">
                        <DialogHeader>
                          <DialogTitle className="text-military-glass-white">{template.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          {selectedTemplate && (
                            <TemplateRenderer slug={selectedTemplate} />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportTemplate(template)}
                      className="border-military-storm-grey text-military-glass-white hover:bg-military-tactical-black"
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${template.title}"?`)) {
                          deleteTemplate(template.id)
                        }
                      }}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

