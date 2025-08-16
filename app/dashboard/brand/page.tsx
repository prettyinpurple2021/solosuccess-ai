import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Palette, 
  Image, 
  FileText, 
  Download, 
  Upload, 
  Edit, 
  Plus,
  Eye,
  Copy,
  Trash2,
  Star,
  Sparkles,
  Target,
  Users,
  Globe,
  Heart,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'

export default function BrandStudioPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app this would come from API
  const brandProfile = {
    name: 'SoloBoss AI',
    tagline: 'Transform your productivity with AI agents that work 24/7',
    description: 'A comprehensive AI-powered productivity platform designed for solo founders and entrepreneurs.',
    industry: 'SaaS / Productivity',
    targetAudience: 'Solo founders, entrepreneurs, and small business owners',
    brandVoice: 'Bold, confident, and empowering with a punk rock edge',
    colorPalette: [
      { name: 'Primary Purple', hex: '#6d28d9', usage: 'Main brand color' },
      { name: 'Pink Accent', hex: '#ec4899', usage: 'Call-to-action elements' },
      { name: 'Indigo', hex: '#4f46e5', usage: 'Secondary elements' },
      { name: 'Dark Gray', hex: '#1f2937', usage: 'Text and backgrounds' }
    ],
    fonts: {
      primary: 'Inter',
      secondary: 'Poppins',
      accent: 'Montserrat'
    },
    logoUrl: '/logo.svg',
    isPrimary: true
  }

  const brandAssets = [
    {
      id: 1,
      name: 'SoloBoss Logo',
      type: 'logo',
      category: 'Primary',
      fileUrl: '/logo.svg',
      tags: ['logo', 'primary', 'brand'],
      lastUpdated: '2024-10-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Hero Image',
      type: 'image',
      category: 'Marketing',
      fileUrl: '/hero-image.jpg',
      tags: ['hero', 'marketing', 'landing'],
      lastUpdated: '2024-10-10T14:30:00Z'
    },
    {
      id: 3,
      name: 'Social Media Template',
      type: 'template',
      category: 'Social',
      fileUrl: '/social-template.psd',
      tags: ['social', 'template', 'marketing'],
      lastUpdated: '2024-10-08T09:15:00Z'
    },
    {
      id: 4,
      name: 'Brand Guidelines',
      type: 'copy',
      category: 'Documentation',
      fileUrl: '/brand-guidelines.pdf',
      tags: ['guidelines', 'documentation', 'brand'],
      lastUpdated: '2024-10-12T16:45:00Z'
    }
  ]

  const styleGuide = {
    typography: {
      headings: {
        h1: { font: 'Inter', size: '3rem', weight: 'bold' },
        h2: { font: 'Inter', size: '2.25rem', weight: 'semibold' },
        h3: { font: 'Inter', size: '1.875rem', weight: 'medium' }
      },
      body: {
        regular: { font: 'Inter', size: '1rem', weight: 'normal' },
        small: { font: 'Inter', size: '0.875rem', weight: 'normal' }
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '1rem',
      full: '9999px'
    }
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'logo': return <Palette className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'template': return <FileText className="w-4 h-4" />
      case 'copy': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'logo': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'image': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'template': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'copy': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Brand Studio</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your brand identity and assets</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <Star className="w-4 h-4 mr-2" />
            Primary Brand
          </Badge>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            New Asset
          </Button>
        </div>
      </div>

      {/* Brand Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-600" />
            Brand Profile
          </CardTitle>
          <CardDescription>
            Your brand identity and core information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{brandProfile.name}</h3>
              <p className="text-purple-600 font-medium mb-2">{brandProfile.tagline}</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{brandProfile.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{brandProfile.industry}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{brandProfile.targetAudience}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{brandProfile.brandVoice}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Color Palette</h4>
              <div className="grid grid-cols-2 gap-3">
                {brandProfile.colorPalette.map((color, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="text-sm font-medium">{color.name}</p>
                      <p className="text-xs text-muted-foreground">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="styleguide">Style Guide</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{brandAssets.length}</div>
                <p className="text-xs text-muted-foreground">
                  Brand assets created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Asset Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Different asset types
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2 days</div>
                <p className="text-xs text-muted-foreground">
                  Ago
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common brand management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <div>
                    <Upload className="w-6 h-6 text-blue-600" />
                    <span>Upload Asset</span>
                    <span className="text-xs text-muted-foreground">Add new brand assets</span>
                  </div>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <div>
                    <Edit className="w-6 h-6 text-purple-600" />
                    <span>Edit Profile</span>
                    <span className="text-xs text-muted-foreground">Update brand information</span>
                  </div>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <div>
                    <Download className="w-6 h-6 text-green-600" />
                    <span>Export Assets</span>
                    <span className="text-xs text-muted-foreground">Download brand kit</span>
                  </div>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
                  <div>
                    <Eye className="w-6 h-6 text-orange-600" />
                    <span>Preview Brand</span>
                    <span className="text-xs text-muted-foreground">See how it looks</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Brand Assets</h3>
              <p className="text-sm text-muted-foreground">Manage your brand files and resources</p>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Asset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandAssets.map((asset) => (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded bg-gradient-to-r ${getAssetTypeColor(asset.type)} flex items-center justify-center`}>
                        {getAssetTypeIcon(asset.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{asset.name}</CardTitle>
                        <CardDescription>{asset.category}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Updated {new Date(asset.lastUpdated).toLocaleDateString()}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="styleguide" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Typography
                </CardTitle>
                <CardDescription>
                  Font families and text styles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Headings</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <div className="text-2xl font-bold mb-1">Heading 1</div>
                      <p className="text-xs text-muted-foreground">Inter • 3rem • Bold</p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-xl font-semibold mb-1">Heading 2</div>
                      <p className="text-xs text-muted-foreground">Inter • 2.25rem • Semibold</p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-lg font-medium mb-1">Heading 3</div>
                      <p className="text-xs text-muted-foreground">Inter • 1.875rem • Medium</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Body Text</h4>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <p className="mb-1">Regular body text for paragraphs and content.</p>
                      <p className="text-xs text-muted-foreground">Inter • 1rem • Normal</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-sm mb-1">Smaller text for captions and secondary information.</p>
                      <p className="text-xs text-muted-foreground">Inter • 0.875rem • Normal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spacing & Layout */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Spacing & Layout
                </CardTitle>
                <CardDescription>
                  Consistent spacing and border radius
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Spacing Scale</h4>
                  <div className="space-y-2">
                    {Object.entries(styleGuide.spacing).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-medium">{key.toUpperCase()}</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="bg-purple-500 rounded"
                            style={{ width: value, height: '8px' }}
                          />
                          <span className="text-xs text-muted-foreground">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Border Radius</h4>
                  <div className="space-y-2">
                    {Object.entries(styleGuide.borderRadius).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-medium">{key.toUpperCase()}</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-8 h-8 bg-purple-500"
                            style={{ borderRadius: value }}
                          />
                          <span className="text-xs text-muted-foreground">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Brand Templates</h3>
              <p className="text-sm text-muted-foreground">Ready-to-use templates for your brand</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">Social Media Post</CardTitle>
                <CardDescription>Instagram, Twitter, LinkedIn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Preview</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">Email Header</CardTitle>
                <CardDescription>Newsletter and marketing emails</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Preview</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">Presentation Slide</CardTitle>
                <CardDescription>PowerPoint and Keynote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center">
                  <span className="text-white font-medium">Preview</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
