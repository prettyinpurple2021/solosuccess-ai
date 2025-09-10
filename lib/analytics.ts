import { NextRequest } from 'next/server'

// Analytics event types
export type AnalyticsEvent = 
  | 'user_signup'
  | 'user_login'
  | 'user_logout'
  | 'page_view'
  | 'ai_agent_interaction'
  | 'goal_created'
  | 'goal_completed'
  | 'task_created'
  | 'task_completed'
  | 'file_uploaded'
  | 'template_saved'
  | 'dashboard_viewed'
  | 'feature_used'
  | 'error_occurred'
  | 'performance_metric'

export interface AnalyticsEventData {
  event: AnalyticsEvent
  userId?: string
  sessionId?: string
  timestamp: Date
  properties: Record<string, any>
  metadata?: {
    userAgent?: string
    ip?: string
    referrer?: string
    url?: string
  }
}

export interface UserMetrics {
  userId: string
  totalSessions: number
  totalPageViews: number
  totalAIInteractions: number
  goalsCreated: number
  goalsCompleted: number
  tasksCreated: number
  tasksCompleted: number
  filesUploaded: number
  templatesSaved: number
  lastActiveAt: Date
  firstSeenAt: Date
  averageSessionDuration: number
  retentionScore: number
}

export interface PerformanceMetrics {
  pageLoadTime: number
  apiResponseTime: number
  errorRate: number
  uptime: number
  memoryUsage: number
  cpuUsage: number
  databaseQueryTime: number
}

export interface BusinessMetrics {
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

class AnalyticsService {
  private events: AnalyticsEventData[] = []
  private userMetrics: Map<string, UserMetrics> = new Map()
  private performanceMetrics: PerformanceMetrics[] = []
  private businessMetrics: BusinessMetrics | null = null

  /**
   * Track an analytics event
   */
  async trackEvent(
    event: AnalyticsEvent,
    properties: Record<string, any> = {},
    request?: NextRequest
  ): Promise<void> {
    const eventData: AnalyticsEventData = {
      event,
      timestamp: new Date(),
      properties,
      metadata: request ? {
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        referrer: request.headers.get('referer') || undefined,
        url: request.url
      } : undefined
    }

    // Store event
    this.events.push(eventData)

    // Update user metrics if userId is provided
    if (properties.userId) {
      await this.updateUserMetrics(properties.userId, event, properties)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event, properties)
    }

    // Note: PostHog integration was removed. Events are only stored internally now.
  }

  /**
   * Update user metrics based on events
   */
  private async updateUserMetrics(
    userId: string,
    event: AnalyticsEvent,
    properties: Record<string, any>
  ): Promise<void> {
    let metrics = this.userMetrics.get(userId)
    
    if (!metrics) {
      metrics = {
        userId,
        totalSessions: 0,
        totalPageViews: 0,
        totalAIInteractions: 0,
        goalsCreated: 0,
        goalsCompleted: 0,
        tasksCreated: 0,
        tasksCompleted: 0,
        filesUploaded: 0,
        templatesSaved: 0,
        lastActiveAt: new Date(),
        firstSeenAt: new Date(),
        averageSessionDuration: 0,
        retentionScore: 0
      }
    }

    // Update metrics based on event type
    switch (event) {
      case 'user_signup':
        metrics.firstSeenAt = new Date()
        break
      case 'user_login':
        metrics.totalSessions++
        break
      case 'page_view':
        metrics.totalPageViews++
        break
      case 'ai_agent_interaction':
        metrics.totalAIInteractions++
        break
      case 'goal_created':
        metrics.goalsCreated++
        break
      case 'goal_completed':
        metrics.goalsCompleted++
        break
      case 'task_created':
        metrics.tasksCreated++
        break
      case 'task_completed':
        metrics.tasksCompleted++
        break
      case 'file_uploaded':
        metrics.filesUploaded++
        break
      case 'template_saved':
        metrics.templatesSaved++
        break
    }

    metrics.lastActiveAt = new Date()
    this.userMetrics.set(userId, metrics)
  }

  /**
   * Track performance metrics
   */
  async trackPerformance(metrics: Partial<PerformanceMetrics>): Promise<void> {
    const performanceData: PerformanceMetrics = {
      pageLoadTime: metrics.pageLoadTime || 0,
      apiResponseTime: metrics.apiResponseTime || 0,
      errorRate: metrics.errorRate || 0,
      uptime: metrics.uptime || 100,
      memoryUsage: metrics.memoryUsage || 0,
      cpuUsage: metrics.cpuUsage || 0,
      databaseQueryTime: metrics.databaseQueryTime || 0,
      ...metrics
    }

    this.performanceMetrics.push(performanceData)

    // Keep only last 1000 performance metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000)
    }
  }

  /**
   * Get user metrics
   */
  getUserMetrics(userId: string): UserMetrics | null {
    return this.userMetrics.get(userId) || null
  }

  /**
   * Get all user metrics
   */
  getAllUserMetrics(): UserMetrics[] {
    return Array.from(this.userMetrics.values())
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics[] {
    return this.performanceMetrics
  }

  /**
   * Get business metrics
   */
  getBusinessMetrics(): BusinessMetrics | null {
    return this.businessMetrics
  }

  /**
   * Calculate business metrics
   */
  async calculateBusinessMetrics(): Promise<BusinessMetrics> {
    const allUserMetrics = this.getAllUserMetrics()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalUsers = allUserMetrics.length
    const activeUsers = allUserMetrics.filter(
      user => user.lastActiveAt > weekAgo
    ).length

    const newUsersToday = allUserMetrics.filter(
      user => user.firstSeenAt >= today
    ).length

    const newUsersThisWeek = allUserMetrics.filter(
      user => user.firstSeenAt >= weekAgo
    ).length

    const newUsersThisMonth = allUserMetrics.filter(
      user => user.firstSeenAt >= monthAgo
    ).length

    // Calculate retention rate (users active in last 7 days / total users)
    const userRetentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0

    // Calculate feature adoption rates
    const featureAdoptionRate: Record<string, number> = {
      ai_agents: (allUserMetrics.filter(user => user.totalAIInteractions > 0).length / totalUsers) * 100,
      goals: (allUserMetrics.filter(user => user.goalsCreated > 0).length / totalUsers) * 100,
      tasks: (allUserMetrics.filter(user => user.tasksCreated > 0).length / totalUsers) * 100,
      files: (allUserMetrics.filter(user => user.filesUploaded > 0).length / totalUsers) * 100,
      templates: (allUserMetrics.filter(user => user.templatesSaved > 0).length / totalUsers) * 100
    }

    // Calculate conversion rate (users who completed at least one goal / total users)
    const conversionRate = totalUsers > 0 ? 
      (allUserMetrics.filter(user => user.goalsCompleted > 0).length / totalUsers) * 100 : 0

    // Calculate churn rate (users inactive for 30+ days / total users)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const churnedUsers = allUserMetrics.filter(
      user => user.lastActiveAt < thirtyDaysAgo
    ).length
    const churnRate = totalUsers > 0 ? (churnedUsers / totalUsers) * 100 : 0

    const businessMetrics: BusinessMetrics = {
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      userRetentionRate,
      featureAdoptionRate,
      conversionRate,
      churnRate,
      revenue: 0, // TODO: Implement revenue tracking
      mrr: 0 // TODO: Implement MRR tracking
    }

    this.businessMetrics = businessMetrics
    return businessMetrics
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboardData(): Promise<{
    events: AnalyticsEventData[]
    userMetrics: UserMetrics[]
    performanceMetrics: PerformanceMetrics[]
    businessMetrics: BusinessMetrics
  }> {
    const businessMetrics = await this.calculateBusinessMetrics()
    
    return {
      events: this.events.slice(-100), // Last 100 events
      userMetrics: this.getAllUserMetrics(),
      performanceMetrics: this.getPerformanceMetrics().slice(-50), // Last 50 performance metrics
      businessMetrics
    }
  }

  /**
   * Clear old data (for memory management)
   */
  clearOldData(): void {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    // Keep only events from last week
    this.events = this.events.filter(event => event.timestamp > oneWeekAgo)
    
    // Keep only performance metrics from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    this.performanceMetrics = this.performanceMetrics.filter(
      metric => new Date() > oneDayAgo
    )
  }
}

// Export singleton instance
export const analytics = new AnalyticsService()

// Helper functions for common tracking scenarios
export const trackUserSignup = (userId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('user_signup', { userId, ...properties })

export const trackUserLogin = (userId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('user_login', { userId, ...properties })

export const trackPageView = (userId: string, page: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('page_view', { userId, page, ...properties })

export const trackAIAgentInteraction = (userId: string, agentName: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('ai_agent_interaction', { userId, agentName, ...properties })

export const trackGoalCreated = (userId: string, goalId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('goal_created', { userId, goalId, ...properties })

export const trackGoalCompleted = (userId: string, goalId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('goal_completed', { userId, goalId, ...properties })

export const trackTaskCreated = (userId: string, taskId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('task_created', { userId, taskId, ...properties })

export const trackTaskCompleted = (userId: string, taskId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('task_completed', { userId, taskId, ...properties })

export const trackFileUpload = (userId: string, fileId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('file_uploaded', { userId, fileId, ...properties })

export const trackTemplateSaved = (userId: string, templateId: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('template_saved', { userId, templateId, ...properties })

export const trackError = (userId: string, error: string, properties: Record<string, any> = {}) =>
  analytics.trackEvent('error_occurred', { userId, error, ...properties })

export const trackPerformance = (metrics: Partial<PerformanceMetrics>) =>
  analytics.trackPerformance(metrics)
