"use client"

export const dynamic = 'force-dynamic'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, PieChart, LineChart, TrendingUp, Activity, Target, Users, DollarSign, Clock, Zap, Sparkles, Download, RefreshCw, Settings, Eye, Filter, Maximize2, Crown, Shield, Trophy, Star, ArrowRight, ArrowUp, ArrowDown, Calendar, TrendingDown
} from 'lucide-react'
import {
  TacticalButton, GlassCard, RankStars, CamoBackground, SergeantDivider, StatsBadge, TacticalGrid, TacticalGridItem
} from '@/components/military'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useAuth } from "@/hooks/use-auth"

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { user } = useAuth()

  const [analyticsData, setAnalyticsData] = useState<any>({
    overview: { totalRevenue: 0, revenueGrowth: 0, activeUsers: 0, userGrowth: 0, conversionRate: 0, conversionGrowth: 0, avgSessionTime: 0, sessionGrowth: 0 },
    metrics: [],
    topPages: [],
    recentActivity: []
  })

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const { data } = await response.json()
        const mappedData = {
          overview: {
            totalRevenue: data.businessMetrics.revenue || 0,
            revenueGrowth: 0,
            activeUsers: data.businessMetrics.activeUsers || 0,
            userGrowth: 0,
            conversionRate: data.businessMetrics.conversionRate || 0,
            conversionGrowth: 0,
            avgSessionTime: 0,
            sessionGrowth: 0
          },
          metrics: [
            { title: "Revenue Generated", value: `$${data.businessMetrics.revenue || 0}`, change: "+0%", trend: "up", icon: DollarSign, color: "text-green-400" },
            { title: "Active Users", value: (data.businessMetrics.activeUsers || 0).toLocaleString(), change: "+0%", trend: "up", icon: Users, color: "text-blue-400" },
            { title: "Conversion Rate", value: `${data.businessMetrics.conversionRate || 0}%`, change: "+0%", trend: "up", icon: Target, color: "text-purple-400" },
            { title: "Total Events", value: (data.events?.length || 0).toLocaleString(), change: "+0%", trend: "up", icon: Activity, color: "text-orange-400" }
          ],
          topPages: [
            { page: "/dashboard", views: 0, growth: 0 },
            { page: "/analytics", views: 0, growth: 0 }
          ],
          recentActivity: data.events?.slice(0, 10).map((e: any) => ({
            action: e.event.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            time: new Date(e.timestamp).toLocaleString(),
            type: e.event.includes('user') ? 'user' : 'system'
          })) || []
        }
        setAnalyticsData(mappedData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleRefresh = useCallback(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return (
    <div className="min-h-screen bg-military-midnight relative overflow-hidden">
      <CamoBackground opacity={0.1} withGrid>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel-strong border-b border-military-hot-pink/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/dashboard" className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
                <span className="font-heading text-xl font-bold text-white">SoloSuccess AI</span>
              </Link>

              <div className="flex items-center gap-4">
                <TacticalButton variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </TacticalButton>
                <TacticalButton size="sm">
                  Export Report
                </TacticalButton>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <RankStars count={5} size="lg" />
                    <span className="text-military-hot-pink font-tactical text-sm uppercase tracking-wider">
                      Elite Intelligence Center
                    </span>
                  </div>

                  <h1 className="font-heading text-5xl font-bold text-white mb-4">
                    Tactical <span className="text-transparent bg-clip-text bg-gradient-to-r from-military-hot-pink to-military-blush-pink">Analytics</span>
                  </h1>

                  <p className="text-xl text-military-storm-grey max-w-2xl">
                    Monitor your business performance with elite intelligence and tactical insights.
                    Track every metric that matters for domination.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="bg-military-tactical/50 border-military-hot-pink/30 text-white rounded-lg px-4 py-2 focus:border-military-hot-pink focus:outline-none"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <div className="mb-12">
              <TacticalGrid className="max-w-7xl mx-auto">
                {analyticsData.metrics.map((metric: any, index: number) => (
                  <TacticalGridItem key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <GlassCard className="h-full p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                            <metric.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            {metric.trend === 'up' ? (
                              <ArrowUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`text-sm font-tactical ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                              {metric.change}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-heading text-3xl font-bold text-white mb-2">
                          {metric.value}
                        </h3>

                        <p className="text-military-storm-grey text-sm uppercase tracking-wider">
                          {metric.title}
                        </p>
                      </GlassCard>
                    </motion.div>
                  </TacticalGridItem>
                ))}
              </TacticalGrid>
            </div>

            {/* Analytics Tabs */}
            <div className="max-w-7xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="glass-panel-strong border border-military-hot-pink/30">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="revenue" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="data-[state=active]:bg-military-hot-pink/20 data-[state=active]:text-white">
                    <Activity className="w-4 h-4 mr-2" />
                    Performance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <GlassCard className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading text-2xl font-bold text-white">Revenue Trends</h3>
                        <TacticalButton variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </TacticalButton>
                      </div>

                      <div className="h-64 flex items-center justify-center bg-military-tactical/20 rounded-lg">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 text-military-hot-pink mx-auto mb-4" />
                          <p className="text-military-storm-grey">Revenue chart visualization</p>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Top Pages */}
                    <GlassCard className="p-8">
                      <h3 className="font-heading text-2xl font-bold text-white mb-6">Top Performing Pages</h3>

                      <div className="space-y-4">
                        {analyticsData.topPages.map((page: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-military-hot-pink/20 flex items-center justify-center">
                                <span className="text-military-hot-pink font-bold text-sm">{index + 1}</span>
                              </div>
                              <span className="text-white font-medium">{page.page}</span>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-military-storm-grey">{page.views} views</span>
                              <div className="flex items-center gap-1">
                                {page.growth > 0 ? (
                                  <ArrowUp className="w-3 h-3 text-green-400" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-red-400" />
                                )}
                                <span className={`text-sm ${page.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {page.growth}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>

                  {/* Recent Activity */}
                  <GlassCard className="p-8">
                    <h3 className="font-heading text-2xl font-bold text-white mb-6">Recent Activity</h3>

                    <div className="space-y-4">
                      {analyticsData.recentActivity.map((activity: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-military-tactical/20 rounded-lg"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-military-hot-pink to-military-blush-pink flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                          </div>

                          <div className="flex-1">
                            <p className="text-white font-medium">{activity.action}</p>
                            <p className="text-military-storm-grey text-sm">{activity.time}</p>
                          </div>

                          <div className="px-3 py-1 bg-military-hot-pink/20 text-military-hot-pink text-xs rounded-full uppercase tracking-wider">
                            {activity.type}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-8">
                  <GlassCard className="p-8">
                    <h3 className="font-heading text-2xl font-bold text-white mb-6">Revenue Analysis</h3>
                    <div className="h-64 flex items-center justify-center bg-military-tactical/20 rounded-lg">
                      <div className="text-center">
                        <DollarSign className="w-16 h-16 text-military-hot-pink mx-auto mb-4" />
                        <p className="text-military-storm-grey">Revenue analytics visualization</p>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="users" className="space-y-8">
                  <GlassCard className="p-8">
                    <h3 className="font-heading text-2xl font-bold text-white mb-6">User Analytics</h3>
                    <div className="h-64 flex items-center justify-center bg-military-tactical/20 rounded-lg">
                      <div className="text-center">
                        <Users className="w-16 h-16 text-military-hot-pink mx-auto mb-4" />
                        <p className="text-military-storm-grey">User analytics visualization</p>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>

                <TabsContent value="performance" className="space-y-8">
                  <GlassCard className="p-8">
                    <h3 className="font-heading text-2xl font-bold text-white mb-6">Performance Metrics</h3>
                    <div className="h-64 flex items-center justify-center bg-military-tactical/20 rounded-lg">
                      <div className="text-center">
                        <Activity className="w-16 h-16 text-military-hot-pink mx-auto mb-4" />
                        <p className="text-military-storm-grey">Performance metrics visualization</p>
                      </div>
                    </div>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </CamoBackground>
    </div>
  )
}