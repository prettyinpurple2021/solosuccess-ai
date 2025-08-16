import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Search, 
  Download,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Lock,
  Users,
  Settings,
  RefreshCw,
  Plus,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'

export default function GuardianAIPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock data - in real app this would come from API
  const complianceStats = {
    trustScore: 87,
    totalScans: 24,
    issuesFound: 3,
    policiesGenerated: 8,
    lastScan: '2 hours ago'
  }

  const recentScans = [
    {
      id: 1,
      url: 'https://soloboss.ai',
      status: 'passed',
      trustScore: 92,
      issues: 0,
      scannedAt: '2024-10-18T10:30:00Z'
    },
    {
      id: 2,
      url: 'https://app.soloboss.ai',
      status: 'warning',
      trustScore: 78,
      issues: 2,
      scannedAt: '2024-10-17T15:45:00Z'
    },
    {
      id: 3,
      url: 'https://blog.soloboss.ai',
      status: 'failed',
      trustScore: 45,
      issues: 5,
      scannedAt: '2024-10-16T09:15:00Z'
    }
  ]

  const complianceIssues = [
    {
      id: 1,
      type: 'GDPR',
      severity: 'high',
      description: 'Missing cookie consent banner',
      url: 'https://app.soloboss.ai',
      status: 'open',
      createdAt: '2024-10-17T15:45:00Z'
    },
    {
      id: 2,
      type: 'CCPA',
      severity: 'medium',
      description: 'Privacy policy needs update for California residents',
      url: 'https://soloboss.ai/privacy',
      status: 'in_progress',
      createdAt: '2024-10-16T14:20:00Z'
    },
    {
      id: 3,
      type: 'GDPR',
      severity: 'low',
      description: 'Data retention policy not clearly stated',
      url: 'https://soloboss.ai/terms',
      status: 'resolved',
      createdAt: '2024-10-15T11:30:00Z'
    }
  ]

  const policies = [
    {
      id: 1,
      name: 'Privacy Policy',
      type: 'GDPR/CCPA Compliant',
      status: 'active',
      lastUpdated: '2024-10-15T10:00:00Z',
      version: '2.1'
    },
    {
      id: 2,
      name: 'Terms of Service',
      type: 'Standard',
      status: 'active',
      lastUpdated: '2024-10-10T14:30:00Z',
      version: '1.8'
    },
    {
      id: 3,
      name: 'Cookie Policy',
      type: 'GDPR Compliant',
      status: 'draft',
      lastUpdated: '2024-10-18T09:15:00Z',
      version: '1.0'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guardian AI</h1>
          <p className="text-gray-600 dark:text-gray-300">Your compliance and ethics co-pilot</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Shield className="w-4 h-4 mr-2" />
            Trust Score: {complianceStats.trustScore}%
          </Badge>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Search className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.trustScore}%</div>
            <Progress value={complianceStats.trustScore} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.issuesFound}</div>
            <p className="text-xs text-muted-foreground">
              {complianceStats.issuesFound > 0 ? 'Needs attention' : 'All clear'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policies Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceStats.policiesGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Active policies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-green-600" />
                  Recent Scans
                </CardTitle>
                <CardDescription>
                  Latest compliance scan results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {scan.status === 'passed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {scan.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                        {scan.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                        <span className="font-medium">{scan.url}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(scan.status)}>
                        {scan.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {scan.trustScore}%
                      </span>
                    </div>
                  </div>
                ))}
                <Button asChild className="w-full" variant="outline">
                  <div>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run New Scan
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common compliance tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Globe className="w-4 h-4 mr-2" />
                    Scan Website for GDPR Compliance
                  </div>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Privacy Policy
                  </div>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Lock className="w-4 h-4 mr-2" />
                    Create Cookie Policy
                  </div>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <div>
                    <Users className="w-4 h-4 mr-2" />
                    Review Data Processing
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Compliance Scanner</CardTitle>
              <CardDescription>
                Scan your website for GDPR, CCPA, and other compliance issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input placeholder="Enter website URL (e.g., https://example.com)" className="flex-1" />
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Search className="w-4 h-4 mr-2" />
                  Scan
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">GDPR</span>
                  </div>
                  <p className="text-sm text-muted-foreground">European data protection</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">CCPA</span>
                  </div>
                  <p className="text-sm text-muted-foreground">California privacy rights</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Security</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Data security standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Legal Documents</h3>
              <p className="text-sm text-muted-foreground">Manage your compliance policies</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Generate Policy
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <CardDescription>{policy.type}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Version</span>
                    <span className="font-medium">{policy.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span className="font-medium">
                      {new Date(policy.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Compliance Issues</h3>
              <p className="text-sm text-muted-foreground">Track and resolve compliance violations</p>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {complianceIssues.filter(issue => issue.status === 'open').length} Open Issues
            </Badge>
          </div>

          <div className="space-y-4">
            {complianceIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">
                          {issue.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium">{issue.description}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{issue.url}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}