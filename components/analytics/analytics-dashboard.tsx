"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Brain,
  Lightbulb
} from 'lucide-react'
import { toast } from 'sonner'
import { logger, logInfo } from '@/lib/logger'
import PredictiveInsightsDashboard from './predictive-insights-dashboard'
import CustomReportBuilderEnhanced from './custom-report-builder-enhanced'

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Analytics data refreshed!', { icon: '✅' })
      logInfo('Analytics dashboard refreshed')
    } catch (error) {
      toast.error('Failed to refresh analytics data', { icon: '❌' })
      logger.error('Analytics refresh error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    toast.info(`Exporting analytics as ${format.toUpperCase()}...`, { icon: '📊' })
    logInfo(`Analytics exported as ${format}`)
  }

  const handleSaveReport = (report: any) => {
    toast.success('Report saved successfully!', { icon: '💾' })
    logInfo('Custom report saved:', report.name)
  }

  const handleExportReport = (report: any, format: 'csv' | 'pdf' | 'json') => {
    toast.info(`Exporting "${report.name}" as ${format.toUpperCase()}...`, { icon: '📤' })
    logInfo(`Custom report exported: ${report.name} as ${format}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Analytics Dashboard</h1>
          <p className="text-purple-200 mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-purple-200 hover:text-white border-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="text-purple-200 hover:text-white border-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-purple-900/50 border border-purple-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            Performance
          </TabsTrigger>
          <TabsTrigger value="predictive" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Brain className="w-4 h-4 mr-2" />
            Predictive
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            <Lightbulb className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,350</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+23%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">-2%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly user acquisition and retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">User growth chart will be rendered here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="holographic-card">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly revenue and subscription metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Revenue chart will be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="holographic-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest user interactions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                  <Badge variant="secondary">User</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI task completed</p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                  <Badge variant="secondary">AI</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Goal milestone reached</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                  <Badge variant="secondary">Goal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Page Load Time</span>
                    <span>1.2s</span>
                  </div>
                  <Progress value={80} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span>245ms</span>
                  </div>
                  <Progress value={90} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span>99.9%</span>
                  </div>
                  <Progress value={99} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="holographic-card lg:col-span-2">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>
                  Real-time system metrics and health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Performance charts will be rendered here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <PredictiveInsightsDashboard />
        </TabsContent>

        {/* Custom Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <CustomReportBuilderEnhanced
            onSave={handleSaveReport}
            onExport={handleExportReport}
          />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <Card className="holographic-card">
            <CardHeader>
              <CardTitle>Business Insights</CardTitle>
              <CardDescription>
                AI-powered insights and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Growth Opportunity</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Your user engagement has increased by 23% this month. Consider launching a referral program to capitalize on this momentum.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Performance Insight</h4>
                  <p className="text-green-700 text-sm mt-1">
                    AI task completion rates are highest between 9-11 AM. Consider scheduling important tasks during this peak period.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900">Optimization Suggestion</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Users who complete onboarding within 3 days have 40% higher retention. Consider streamlining the onboarding process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holographic-card">
            <CardHeader>
              <CardTitle>Historical Trends</CardTitle>
              <CardDescription>
                Historical performance data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Performance charts will be rendered here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}