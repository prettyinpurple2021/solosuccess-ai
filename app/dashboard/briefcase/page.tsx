import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Briefcase, 
  FileText, 
  Upload, 
  Download, 
  Search, 
  Folder,
  File,
  Image,
  Video,
  Archive,
  Bot,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  Users,
  Plus,
  Filter,
  Grid,
  List,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react'
import { useState } from 'react'

export default function BriefcasePage() {
  const [activeTab, setActiveTab] = useState('documents')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data - in real app this would come from API
  const documentStats = {
    totalDocuments: 47,
    totalSize: '2.4 GB',
    aiProcessed: 23,
    recentUploads: 5,
    storageUsed: 65
  }

  const documents = [
    {
      id: 1,
      title: 'Q4 Marketing Strategy',
      type: 'document',
      fileType: 'pdf',
      size: '2.3 MB',
      folder: 'Marketing',
      tags: ['strategy', 'marketing', 'q4'],
      isAiProcessed: true,
      aiSummary: 'Comprehensive marketing strategy for Q4 including social media campaigns, email marketing, and content creation.',
      aiInsights: ['Focus on social media engagement', 'Increase email frequency', 'Launch new product campaign'],
      lastModified: '2024-10-18T10:30:00Z',
      createdBy: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Investor Pitch Deck',
      type: 'presentation',
      fileType: 'pptx',
      size: '15.7 MB',
      folder: 'Business',
      tags: ['pitch', 'investor', 'funding'],
      isAiProcessed: true,
      aiSummary: 'Professional pitch deck for Series A funding round with financial projections and growth metrics.',
      aiInsights: ['Strong financial projections', 'Clear market opportunity', 'Experienced team'],
      lastModified: '2024-10-17T14:15:00Z',
      createdBy: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Product Roadmap 2024',
      type: 'document',
      fileType: 'docx',
      size: '1.8 MB',
      folder: 'Product',
      tags: ['roadmap', 'product', 'planning'],
      isAiProcessed: false,
      aiSummary: null,
      aiInsights: [],
      lastModified: '2024-10-16T09:45:00Z',
      createdBy: 'Alex Rodriguez'
    },
    {
      id: 4,
      title: 'Brand Guidelines',
      type: 'document',
      fileType: 'pdf',
      size: '8.2 MB',
      folder: 'Brand',
      tags: ['brand', 'guidelines', 'design'],
      isAiProcessed: true,
      aiSummary: 'Comprehensive brand guidelines including logo usage, color palette, typography, and design principles.',
      aiInsights: ['Consistent color usage', 'Clear typography hierarchy', 'Professional design standards'],
      lastModified: '2024-10-15T16:20:00Z',
      createdBy: 'Emma Wilson'
    },
    {
      id: 5,
      title: 'Customer Feedback Analysis',
      type: 'spreadsheet',
      fileType: 'xlsx',
      size: '3.1 MB',
      folder: 'Analytics',
      tags: ['feedback', 'analysis', 'customers'],
      isAiProcessed: true,
      aiSummary: 'Analysis of customer feedback data with sentiment analysis and key improvement areas.',
      aiInsights: ['Positive sentiment trend', 'Feature requests identified', 'Support improvements needed'],
      lastModified: '2024-10-14T11:30:00Z',
      createdBy: 'David Kim'
    },
    {
      id: 6,
      title: 'Team Photo',
      type: 'image',
      fileType: 'jpg',
      size: '4.5 MB',
      folder: 'Media',
      tags: ['team', 'photo', 'event'],
      isAiProcessed: false,
      aiSummary: null,
      aiInsights: [],
      lastModified: '2024-10-13T13:00:00Z',
      createdBy: 'Lisa Thompson'
    }
  ]

  const folders = [
    { name: 'Marketing', count: 12, color: 'bg-blue-500' },
    { name: 'Business', count: 8, color: 'bg-green-500' },
    { name: 'Product', count: 15, color: 'bg-purple-500' },
    { name: 'Brand', count: 6, color: 'bg-pink-500' },
    { name: 'Analytics', count: 9, color: 'bg-orange-500' },
    { name: 'Media', count: 3, color: 'bg-indigo-500' }
  ]

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />
      case 'presentation': return <FileText className="w-4 h-4" />
      case 'spreadsheet': return <FileText className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'archive': return <Archive className="w-4 h-4" />
      default: return <File className="w-4 h-4" />
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'presentation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'spreadsheet': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'image': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'video': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'archive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatFileSize = (size: string) => {
    return size
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Briefcase</h1>
          <p className="text-gray-600 dark:text-gray-300">Your document management and AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Bot className="w-4 h-4 mr-2" />
            {documentStats.aiProcessed} AI Processed
          </Badge>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {documentStats.recentUploads} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.storageUsed}%</div>
            <p className="text-xs text-muted-foreground">
              {documentStats.totalSize} of 5 GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Processed</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentStats.aiProcessed}</div>
            <p className="text-xs text-muted-foreground">
              Documents analyzed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Folders</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folders.length}</div>
            <p className="text-xs text-muted-foreground">
              Organized categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input placeholder="Search documents..." className="w-full" />
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

          {/* Documents Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded bg-gradient-to-r ${getFileTypeColor(doc.type)} flex items-center justify-center`}>
                          {getFileTypeIcon(doc.type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                          <CardDescription>{doc.folder}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{doc.fileType.toUpperCase()}</span>
                      <span>{doc.size}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {doc.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{doc.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {doc.isAiProcessed && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Bot className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-purple-800 dark:text-purple-200">AI Summary</span>
                        </div>
                        <p className="text-xs text-purple-700 dark:text-purple-300 line-clamp-2">
                          {doc.aiSummary}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Modified {new Date(doc.lastModified).toLocaleDateString()}</span>
                      <span>{doc.createdBy}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-10 h-10 rounded bg-gradient-to-r ${getFileTypeColor(doc.type)} flex items-center justify-center`}>
                          {getFileTypeIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium truncate">{doc.title}</h3>
                            {doc.isAiProcessed && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                <Bot className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {doc.folder} • {doc.fileType.toUpperCase()} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{new Date(doc.lastModified).toLocaleDateString()}</div>
                          <div>{doc.createdBy}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Folders</h3>
              <p className="text-sm text-muted-foreground">Organize your documents by category</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <Card key={folder.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${folder.color} flex items-center justify-center`}>
                      <Folder className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{folder.name}</h3>
                      <p className="text-sm text-muted-foreground">{folder.count} documents</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Processed Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  AI Processed Documents
                </CardTitle>
                <CardDescription>
                  Documents analyzed by AI for insights and summaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.filter(doc => doc.isAiProcessed).map((doc) => (
                  <div key={doc.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{doc.title}</h4>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        <Bot className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{doc.aiSummary}</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.aiInsights.slice(0, 2).map((insight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {insight}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Suggestions for document organization and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Document Organization</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Consider creating a "Contracts" folder for legal documents
                  </p>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Folder
                  </Button>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your marketing documents show strong brand consistency
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Positive Trend
                  </Badge>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Processing Queue</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    3 documents pending AI analysis
                  </p>
                  <Button size="sm" variant="outline">
                    <Bot className="w-4 h-4 mr-2" />
                    Process Now
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