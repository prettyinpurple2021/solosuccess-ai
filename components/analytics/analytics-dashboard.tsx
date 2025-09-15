'use client'

import { useState, useEffect} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import { Badge} from '@/components/ui/badge'
import { Button} from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import { Progress} from '@/components/ui/progress'
import { 
  Users, Activity, TrendingUp, Clock, Target, CheckCircle, AlertCircle, BarChart3, PieChart, LineChart} from 'lucide-react'

interface AnalyticsData {
  events: any[]
  userMetrics: any[]
  performanceMetrics: any[]
  businessMetrics: {
    totalUsers: number
    activeUsers: number
    newUsersToday: number
    newUsersThisWeek: number
    newUsersThisMonth: number
    userRetentionRate: number
    featureAdoptionRate: Record<string, number>
    conversionRate: number
    churnRate: number
    revenue: number
    mrr: number
  }
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
        <Button onClick={fetchAnalyticsData} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  const { businessMetrics, performanceMetrics } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your platform's performance and user engagement</p>
        </div>
        <Button onClick={fetchAnalyticsData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessMetrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{businessMetrics.newUsersToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessMetrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {businessMetrics.userRetentionRate.toFixed(1)}% retention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessMetrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Goal completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessMetrics.churnRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Users inactive 30+ days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Adoption</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">User Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Growth
                </CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Today</span>
                  <Badge variant="secondary">{businessMetrics.newUsersToday}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">This Week</span>
                  <Badge variant="secondary">{businessMetrics.newUsersThisWeek}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">This Month</span>
                  <Badge variant="secondary">{businessMetrics.newUsersThisMonth}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Retention Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Retention Metrics
                </CardTitle>
                <CardDescription>User engagement and retention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Retention Rate</span>
                    <span>{businessMetrics.userRetentionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={businessMetrics.userRetentionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span>{businessMetrics.conversionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={businessMetrics.conversionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Churn Rate</span>
                    <span>{businessMetrics.churnRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={businessMetrics.churnRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Feature Adoption Rates
              </CardTitle>
              <CardDescription>Percentage of users who have used each feature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(businessMetrics.featureAdoptionRate).map(([feature, rate]) => (
                <div key={feature} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{feature.replace('_', ' ')}</span>
                    <span>{rate.toFixed(1)}%</span>
                  </div>
                  <Progress value={rate} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>System performance and response times</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceMetrics.length > 0 ? (
                <div className="space-y-4">
                  {(() => {
                    const latest = performanceMetrics[performanceMetrics.length - 1]
                    return (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{latest.pageLoadTime.toFixed(0)}ms</div>
                            <div className="text-sm text-muted-foreground">Page Load Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{latest.apiResponseTime.toFixed(0)}ms</div>
                            <div className="text-sm text-muted-foreground">API Response</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{latest.errorRate.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">Error Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{latest.uptime.toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No performance data available yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                User Activity Summary
              </CardTitle>
              <CardDescription>Recent user activity and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {data.userMetrics.reduce((sum, user) => sum + user.totalSessions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {data.userMetrics.reduce((sum, user) => sum + user.totalAIInteractions, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">AI Interactions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {data.userMetrics.reduce((sum, user) => sum + user.goalsCompleted, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Goals Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
