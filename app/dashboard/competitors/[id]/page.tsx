'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Settings, Clock, ExternalLink, Brain, Crosshair, Plus, AlertTriangle } from 'lucide-react'

import { BossButton } from '@/components/ui/boss-button'
import { EmpowermentCard } from '@/components/ui/empowerment-card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Types
interface CompetitorProfile {
  id: number
  name: string
  domain: string
  description: string
  industry: string
  foundedYear: number
  threatLevel: 'low' | 'medium' | 'high' | 'critical'
}

interface ActivityItem {
  id: number
  type: string
  title: string
  description: string
  source: string
  importance: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}

interface Alert {
  id: number
  type: string
  severity: 'info' | 'warning' | 'urgent' | 'critical'
  title: string
  description: string
  timestamp: string
  isRead: boolean
}

interface Insight {
  id: number
  type: 'opportunity' | 'threat' | 'trend' | 'recommendation'
  title: string
  description: string
  confidence: string
  timestamp: string
}

export default function CompetitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const competitorId = params.id as string

  // State
  const [loading, setLoading] = useState(true)
  const [competitor, setCompetitor] = useState<CompetitorProfile | null>(null)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [activityFilter, setActivityFilter] = useState<string>('all')
  const [insightFilter, setInsightFilter] = useState<string>('all')

  const fetchCompetitorData = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch real competitor data from API
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/competitors/${competitorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch competitor data')
      }

      const competitor: CompetitorProfile = await response.json()
      setCompetitor(competitor)

      // Fetch related data
      const [activitiesResponse, alertsResponse, insightsResponse] = await Promise.all([
        fetch(`/api/competitors/${competitorId}/activities`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/competitors/${competitorId}/alerts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/competitors/${competitorId}/insights`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      // Process responses
      if (activitiesResponse.ok) {
        const activities = await activitiesResponse.json()
        setActivities(activities)
      }

      if (alertsResponse.ok) {
        const alerts = await alertsResponse.json()
        setAlerts(alerts)
      }

      if (insightsResponse.ok) {
        const insights = await insightsResponse.json()
        setInsights(insights)
      }

    } catch (error) {
      console.error('Error fetching competitor data:', error)
    } finally {
      setLoading(false)
    }
  }, [competitorId])

  useEffect(() => {
    fetchCompetitorData()
  }, [fetchCompetitorData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCompetitorData()
    setRefreshing(false)
  }

  const filteredActivities = activities.filter(activity =>
    activityFilter === 'all' || activity.type === activityFilter
  )

  const filteredInsights = insights.filter(insight =>
    insightFilter === 'all' || insight.type === insightFilter
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-background p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading competitor data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!competitor) {
    return (
      <div className="min-h-screen gradient-background p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Competitor Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The competitor you're looking for doesn't exist.</p>
            <BossButton onClick={() => router.push('/dashboard/competitors')}>
              Back to Competitors
            </BossButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/competitors">
              <BossButton variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Competitors
              </BossButton>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gradient">{competitor?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{competitor?.domain}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BossButton
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </BossButton>
            <BossButton variant="secondary" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </BossButton>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="threat">Threat Assessment</TabsTrigger>
            <TabsTrigger value="actions">Action Plan</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Info */}
              <EmpowermentCard className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gradient mb-4">Company Overview</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Description</h4>
                    <p className="text-gray-600 dark:text-gray-400">{competitor?.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Industry</h4>
                      <p className="text-gray-600 dark:text-gray-400">{competitor?.industry}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Founded</h4>
                      <p className="text-gray-600 dark:text-gray-400">{competitor?.foundedYear}</p>
                    </div>
                  </div>
                </div>
              </EmpowermentCard>

              {/* Threat Level */}
              <EmpowermentCard>
                <h3 className="text-xl font-bold text-gradient mb-4">Threat Assessment</h3>
                <div className="text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-2 ${
                    competitor?.threatLevel === 'high' ? 'bg-red-100 text-red-800' :
                    competitor?.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {competitor?.threatLevel?.toUpperCase()} THREAT
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {competitor?.threatLevel === 'high' ? 'Immediate attention required' :
                     competitor?.threatLevel === 'medium' ? 'Monitor closely' :
                     'Low priority monitoring'}
                  </p>
                </div>
              </EmpowermentCard>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <EmpowermentCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient">Activity Timeline</h3>
                <div className="flex items-center gap-3">
                  <select
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                    aria-label="Filter activities by type"
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                  >
                    <option value="all">All Activities</option>
                    <option value="website_change">Website Changes</option>
                    <option value="social_post">Social Posts</option>
                    <option value="job_posting">Job Postings</option>
                    <option value="funding">Funding</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 glass rounded-lg border-l-4 border-blue-500"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{activity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {activity.source}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </EmpowermentCard>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <EmpowermentCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  AI Insights & Analysis
                </h3>
                <select
                  value={insightFilter}
                  onChange={(e) => setInsightFilter(e.target.value)}
                  aria-label="Filter insights by type"
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
                >
                  <option value="all">All Insights</option>
                  <option value="threat">Threat Analysis</option>
                  <option value="opportunity">Opportunities</option>
                  <option value="trend">Market Trends</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 glass rounded-lg border-l-4 ${
                      insight.type === 'threat' ? 'border-red-500' :
                      insight.type === 'opportunity' ? 'border-green-500' :
                      'border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          insight.type === 'threat' ? 'bg-red-100 text-red-800 border-red-200' :
                          insight.type === 'opportunity' ? 'bg-green-100 text-green-800 border-green-200' :
                          'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        {insight.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            insight.confidence === 'high' ? 'bg-green-100 text-green-800 border-green-200' :
                            insight.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {insight.confidence.toUpperCase()} CONFIDENCE
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(insight.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </EmpowermentCard>
          </TabsContent>

          <TabsContent value="threat" className="space-y-6">
            <EmpowermentCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient flex items-center">
                  <Crosshair className="w-6 h-6 mr-2" />
                  Threat Assessment
                </h3>
                <BossButton variant="secondary" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Analysis
                </BossButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 glass rounded-lg">
                  <h4 className="font-semibold mb-3">Competitive Threats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-sm">Market Share Growth</span>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="text-sm">Pricing Pressure</span>
                      <Badge variant="secondary">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm">Talent Acquisition</span>
                      <Badge variant="outline">Low Risk</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 glass rounded-lg">
                  <h4 className="font-semibold mb-3">Defensive Strategies</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="font-medium text-sm">Strengthen Brand Positioning</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Focus on unique value proposition
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="font-medium text-sm">Customer Retention Program</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Implement loyalty rewards and better support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </EmpowermentCard>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <EmpowermentCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient">Action Plan</h3>
                <BossButton variant="secondary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Action
                </BossButton>
              </div>

              <div className="space-y-4">
                <div className="p-4 glass rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-blue-600">
                        Lexi
                      </span>
                      <div>
                        <h4 className="font-semibold">Monitor competitor activity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Track their latest product releases and marketing campaigns
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">monitoring</Badge>
                      <BossButton variant="secondary" size="sm">
                        Start Action
                      </BossButton>
                    </div>
                  </div>
                </div>
              </div>
            </EmpowermentCard>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <EmpowermentCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient">Active Alerts</h3>
                <BossButton variant="secondary" size="sm">
                  Mark All Read
                </BossButton>
              </div>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 glass rounded-lg border-l-4 ${alert.severity === 'critical' ? 'border-red-500' :
                      alert.severity === 'urgent' ? 'border-orange-500' :
                        alert.severity === 'warning' ? 'border-yellow-500' :
                          'border-blue-500'
                      } ${!alert.isRead ? 'bg-opacity-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge
                            variant="outline"
                            className={getSeverityColor(alert.severity)}
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <BossButton variant="secondary" size="sm">
                        View Details
                      </BossButton>
                    </div>
                  </div>
                ))}
              </div>
            </EmpowermentCard>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
