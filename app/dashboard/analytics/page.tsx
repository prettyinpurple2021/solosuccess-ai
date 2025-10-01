"use client"


export const dynamic = 'force-dynamic'
import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp,
  Activity,
  Target,
  Users,
  DollarSign,
  Clock,
  Zap,
  Sparkles,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Filter,
  Maximize2,
  FileText,
  Table,
  Image,
  Database,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { HolographicButton } from '@/components/ui/holographic-button'
import { HolographicCard } from '@/components/ui/holographic-card'
import { HolographicLoader } from '@/components/ui/holographic-loader'
import AnalyticsDashboard from '@/components/analytics/analytics-dashboard'
import { CustomReportBuilder } from '@/components/analytics/custom-report-builder'
import { AdvancedDataVisualization } from '@/components/analytics/advanced-data-visualization'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { logger, logError, logInfo } from '@/lib/logger'

// Types
interface AnalyticsOverview {
  totalUsers: number
  activeUsers: number
  newUsers: number
  retentionRate: number
  conversionRate: number
  revenue: number
  mrr: number
  engagement: {
    averageSessionDuration: number
    pageViews: number
    bounceRate: number
  }
  features: {
    aiInteractions: number
    goalsCreated: number
    tasksCompleted: number
    filesUploaded: number
  }
}

interface ExportJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  format: string
  createdAt: Date
  progress: number
  filename?: string
  downloadUrl?: string
  error?: string
}

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'visualizations' | 'exports'>('overview')
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load analytics data
  const loadAnalyticsData = useCallback(async () => {
    if (authLoading) return
    
    setLoading(true)
    setError(null)
    
    try {
      const [overviewRes, exportsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/analytics/export')
      ])

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json()
        setOverview(overviewData.data?.businessMetrics || null)
      }

      if (exportsRes.ok) {
        const exportsData = await exportsRes.json()
        setExportJobs(exportsData.data?.exports || [])
      }

    } catch (err) {
      logError('Failed to load analytics data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [authLoading])

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
    
    toast({
      title: 'Data Refreshed',
      description: 'Analytics data has been updated',
      variant: 'success'
    })
  }, [loadAnalyticsData, toast])

  // Load data on mount
  useEffect(() => {
    loadAnalyticsData()
  }, [loadAnalyticsData])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(loadAnalyticsData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [loadAnalyticsData])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-black">
        <HolographicLoader text="Loading Analytics Dashboard..." size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-black">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-300 mb-4">Please sign in to access analytics</p>
          <HolographicButton onClick={() => window.location.href = '/signin'}>
            Sign In
          </HolographicButton>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-black">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Analytics</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <HolographicButton onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </HolographicButton>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold boss-heading">Analytics Dashboard</h1>
              <p className="text-gray-300 mt-1">
                Comprehensive insights into your SoloSuccess AI platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <HolographicButton
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                {refreshing ? (
                  <HolographicLoader size="sm" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </HolographicButton>
              <HolographicButton className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export All
              </HolographicButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="visualizations" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visualizations
            </TabsTrigger>
            <TabsTrigger value="exports" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <CustomReportBuilder
              onSave={(report) => {
                logInfo('Custom report saved:', { reportId: report.id, name: report.name })
                toast({
                  title: 'Report Saved',
                  description: `"${report.name}" has been saved successfully`,
                  variant: 'success'
                })
              }}
              onExport={(report, format) => {
                logInfo('Report export initiated:', { reportId: report.id, format })
                toast({
                  title: 'Export Started',
                  description: `Exporting "${report.name}" as ${format.toUpperCase()}...`,
                  variant: 'success'
                })
              }}
            />
          </TabsContent>

          {/* Visualizations Tab */}
          <TabsContent value="visualizations" className="space-y-6">
            <AdvancedDataVisualization
              onDataUpdate={(data) => {
                logInfo('Visualization data updated:', { count: data.length })
              }}
              onExport={(format, data) => {
                logInfo('Visualization export initiated:', { format, count: data.length })
                toast({
                  title: 'Export Started',
                  description: `Exporting ${data.length} visualizations as ${format.toUpperCase()}...`,
                  variant: 'success'
                })
              }}
            />
          </TabsContent>

          {/* Exports Tab */}
          <TabsContent value="exports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Export Jobs */}
              <div className="lg:col-span-2">
                <HolographicCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Export Jobs
                    </CardTitle>
                    <CardDescription>
                      Track your export requests and download completed files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {exportJobs.length === 0 ? (
                          <div className="text-center py-8">
                            <Download className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No export jobs yet</p>
                            <p className="text-sm text-gray-400">Create reports to generate exports</p>
                          </div>
                        ) : (
                          exportJobs.map(job => (
                            <HolographicCard key={job.id} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <Badge variant="secondary" className="capitalize">
                                    {job.format}
                                  </Badge>
                                  <span className="font-medium text-sm">
                                    Export #{job.id.slice(-8)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={
                                      job.status === 'completed' ? 'default' :
                                      job.status === 'failed' ? 'destructive' :
                                      job.status === 'processing' ? 'secondary' :
                                      'outline'
                                    }
                                  >
                                    {job.status}
                                  </Badge>
                                  {job.status === 'completed' && job.downloadUrl && (
                                    <HolographicButton
                                      size="sm"
                                      onClick={() => window.open(job.downloadUrl, '_blank')}
                                    >
                                      <Download className="h-3 w-3" />
                                    </HolographicButton>
                                  )}
                                </div>
                              </div>
                              
                              {job.status === 'processing' && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Progress</span>
                                    <span>{job.progress}%</span>
                                  </div>
                                  <Progress value={job.progress} className="h-2" />
                                </div>
                              )}
                              
                              {job.status === 'failed' && job.error && (
                                <div className="text-xs text-red-500 mt-2">
                                  Error: {job.error}
                                </div>
                              )}
                              
                              <div className="text-xs text-gray-500 mt-2">
                                Created: {job.createdAt.toLocaleString()}
                              </div>
                            </HolographicCard>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </HolographicCard>
              </div>

              {/* Export Statistics */}
              <div className="space-y-6">
                <HolographicCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Export Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Total Exports</span>
                      <span className="font-semibold">{exportJobs.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Completed</span>
                      <span className="font-semibold text-green-400">
                        {exportJobs.filter(j => j.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">In Progress</span>
                      <span className="font-semibold text-yellow-400">
                        {exportJobs.filter(j => j.status === 'processing').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Failed</span>
                      <span className="font-semibold text-red-400">
                        {exportJobs.filter(j => j.status === 'failed').length}
                      </span>
                    </div>
                  </CardContent>
                </HolographicCard>

                <HolographicCard>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <HolographicButton
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('reports')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Create Report
                    </HolographicButton>
                    <HolographicButton
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab('visualizations')}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      New Visualization
                    </HolographicButton>
                    <HolographicButton
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </HolographicButton>
                  </CardContent>
                </HolographicCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}