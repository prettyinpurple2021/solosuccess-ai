import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Edit, 
  Copy,
  Star,
  Clock,
  Users,
  Zap,
  Target,
  MessageSquare,
  Mail,
  Calendar,
  Briefcase,
  Palette,
  TrendingUp,
  Shield,
  Heart,
  ArrowRight,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { useState } from 'react'

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data - in real app this would come from API
  const templateStats = {
    totalTemplates: 24,
    categories: 8,
    mostUsed: 'Email Templates',
    recentlyAdded: 3
  }

  const templates = [
    {
      id: 1,
      title: 'Welcome Email Series',
      category: 'Email Marketing',
      description: 'A 3-part welcome email sequence to onboard new customers and build engagement.',
      tags: ['email', 'onboarding', 'automation'],
      usage: 156,
      rating: 4.8,
      isAiGenerated: true,
      lastUpdated: '2024-10-18T10:30:00Z',
      author: 'Echo (AI)',
      preview: 'Welcome to SoloBoss AI! We\'re excited to help you transform your productivity...'
    },
    {
      id: 2,
      title: 'Investor Pitch Deck',
      category: 'Business',
      description: 'Professional pitch deck template for fundraising with customizable sections.',
      tags: ['pitch', 'investor', 'funding'],
      usage: 89,
      rating: 4.9,
      isAiGenerated: true,
      lastUpdated: '2024-10-17T14:15:00Z',
      author: 'Roxy (AI)',
      preview: 'Executive Summary: SoloBoss AI is revolutionizing productivity for solo founders...'
    },
    {
      id: 3,
      title: 'Social Media Content Calendar',
      category: 'Marketing',
      description: 'Monthly content calendar template with post ideas and scheduling guidelines.',
      tags: ['social', 'content', 'calendar'],
      usage: 234,
      rating: 4.7,
      isAiGenerated: true,
      lastUpdated: '2024-10-16T09:45:00Z',
      author: 'Echo (AI)',
      preview: 'Week 1: Product Spotlight - Highlight key features and benefits...'
    },
    {
      id: 4,
      title: 'Customer Feedback Survey',
      category: 'Analytics',
      description: 'Comprehensive survey template to gather customer insights and feedback.',
      tags: ['survey', 'feedback', 'customers'],
      usage: 67,
      rating: 4.6,
      isAiGenerated: true,
      lastUpdated: '2024-10-15T16:20:00Z',
      author: 'Lexi (AI)',
      preview: 'We value your feedback! Please take a moment to share your experience...'
    },
    {
      id: 5,
      title: 'Product Launch Checklist',
      category: 'Product',
      description: 'Complete checklist for launching new products or features successfully.',
      tags: ['launch', 'checklist', 'product'],
      usage: 123,
      rating: 4.8,
      isAiGenerated: true,
      lastUpdated: '2024-10-14T11:30:00Z',
      author: 'Nova (AI)',
      preview: 'Pre-Launch Phase: Market research, competitor analysis, MVP development...'
    },
    {
      id: 6,
      title: 'Weekly Team Meeting Agenda',
      category: 'Collaboration',
      description: 'Structured agenda template for productive team meetings and standups.',
      tags: ['meeting', 'agenda', 'team'],
      usage: 189,
      rating: 4.5,
      isAiGenerated: false,
      lastUpdated: '2024-10-13T13:00:00Z',
      author: 'Human',
      preview: '1. Team Updates (5 min) 2. Project Status (10 min) 3. Blockers & Solutions (10 min)...'
    }
  ]

  const categories = [
    { name: 'All', count: 24, icon: FileText, color: 'bg-gray-500' },
    { name: 'Email Marketing', count: 6, icon: Mail, color: 'bg-blue-500' },
    { name: 'Business', count: 4, icon: Briefcase, color: 'bg-green-500' },
    { name: 'Marketing', count: 5, icon: TrendingUp, color: 'bg-purple-500' },
    { name: 'Analytics', count: 3, icon: Target, color: 'bg-orange-500' },
    { name: 'Product', count: 3, icon: Zap, color: 'bg-pink-500' },
    { name: 'Collaboration', count: 2, icon: Users, color: 'bg-indigo-500' },
    { name: 'Legal', count: 1, icon: Shield, color: 'bg-red-500' }
  ]

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name === category)
    return cat ? cat.color : 'bg-gray-500'
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category)
    return cat ? cat.icon : FileText
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Templates</h1>
          <p className="text-gray-600 dark:text-gray-300">AI-powered templates for your business needs</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Zap className="w-4 h-4 mr-2" />
            {templateStats.totalTemplates} Templates
          </Badge>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templateStats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              {templateStats.recentlyAdded} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templateStats.categories}</div>
            <p className="text-xs text-muted-foreground">
              Different types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templateStats.mostUsed}</div>
            <p className="text-xs text-muted-foreground">
              Popular category
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Generated</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.isAiGenerated).length}
            </div>
            <p className="text-xs text-muted-foreground">
              AI-created templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          {categories.map((category) => (
            <TabsTrigger key={category.name} value={category.name.toLowerCase().replace(' ', '-')}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input placeholder="Search templates..." className="w-full" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Templates Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category)
                return (
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded bg-gradient-to-r ${getCategoryColor(template.category)} flex items-center justify-center`}>
                            <CategoryIcon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{template.title}</CardTitle>
                            <CardDescription>{template.category}</CardDescription>
                          </div>
                        </div>
                        {template.isAiGenerated && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <Zap className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{template.usage} uses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{template.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {template.author}</span>
                        <span>{new Date(template.lastUpdated).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Copy className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category)
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className={`w-10 h-10 rounded bg-gradient-to-r ${getCategoryColor(template.category)} flex items-center justify-center`}>
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium truncate">{template.title}</h3>
                              {template.isAiGenerated && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                  <Zap className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{template.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {template.category} • {template.usage} uses • {template.rating}★
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm text-muted-foreground">
                            <div>By {template.author}</div>
                            <div>{new Date(template.lastUpdated).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Category-specific tabs would be similar but filtered */}
        <TabsContent value="email-marketing" className="space-y-6">
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Marketing Templates</h3>
            <p className="text-muted-foreground">Email templates for onboarding, campaigns, and automation</p>
          </div>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Business Templates</h3>
            <p className="text-muted-foreground">Templates for pitches, proposals, and business documents</p>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Marketing Templates</h3>
            <p className="text-muted-foreground">Templates for campaigns, content, and social media</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics Templates</h3>
            <p className="text-muted-foreground">Templates for surveys, reports, and data analysis</p>
          </div>
        </TabsContent>

        <TabsContent value="product" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product Templates</h3>
            <p className="text-muted-foreground">Templates for product launches, roadmaps, and feature planning</p>
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Collaboration Templates</h3>
            <p className="text-muted-foreground">Templates for meetings, team coordination, and project management</p>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Legal Templates</h3>
            <p className="text-muted-foreground">Templates for contracts, policies, and legal documents</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common template tasks and AI-powered creation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <div>
                <Mail className="w-6 h-6 text-blue-600" />
                <span>Email Template</span>
                <span className="text-xs text-muted-foreground">Create with AI</span>
              </div>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <div>
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <span>Social Post</span>
                <span className="text-xs text-muted-foreground">Generate content</span>
              </div>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <div>
                <Calendar className="w-6 h-6 text-green-600" />
                <span>Meeting Agenda</span>
                <span className="text-xs text-muted-foreground">Structure meetings</span>
              </div>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <div>
                <Heart className="w-6 h-6 text-pink-600" />
                <span>Survey</span>
                <span className="text-xs text-muted-foreground">Gather feedback</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}