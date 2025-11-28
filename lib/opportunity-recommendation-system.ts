import { db } from '@/lib/db'
import { competitiveOpportunities, opportunityActions, opportunityMetrics, competitorProfiles } from '@/db/schema'
import { eq, and, desc, asc, inArray, gte, not, isNull, sql } from 'drizzle-orm'
import { logError } from '@/lib/logger'

export interface OpportunityDetectionResult {
  id: string
  competitorId: string
  opportunityType: 'weakness_exploitation' | 'market_gap' | 'pricing_opportunity' | 'talent_acquisition' | 'partnership_opportunity'
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high' | 'critical'
  effort: 'low' | 'medium' | 'high'
  timing: 'immediate' | 'short-term' | 'medium-term' | 'long-term'
  evidence: string[]
  recommendations: string[]
  detectedAt: Date
}

export interface OpportunityRecommendation {
  id: string
  opportunityId: string
  title: string
  description: string
  actionType: 'marketing' | 'product' | 'sales' | 'strategic' | 'pricing' | 'talent' | 'partnership' | 'research'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedEffort: number // hours
  estimatedCost: number // USD
  expectedROI: number // percentage
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term'
  prerequisites: string[]
  risks: string[]
  successMetrics: string[]
  resources: string[]
  confidence: number
  createdAt: Date
}

export interface OpportunityPrioritization {
  opportunityId: string
  priorityScore: number // 0-100
  impactScore: number // 0-10
  effortScore: number // 0-10
  timingScore: number // 0-10
  confidenceScore: number // 0-10
  riskScore: number // 0-10
  resourceScore: number // 0-10
  strategicAlignmentScore: number // 0-10
  competitiveAdvantageScore: number // 0-10
  marketTimingScore: number // 0-10
}

export class OpportunityRecommendationSystem {
  /**
   * Generate actionable recommendations based on opportunity type
   */
  async generateRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    try {
      const recommendations: OpportunityRecommendation[] = []

      switch (opportunity.opportunityType) {
        case 'weakness_exploitation':
          recommendations.push(...await this.generateWeaknessRecommendations(opportunity))
          break
        case 'market_gap':
          recommendations.push(...await this.generateMarketGapRecommendations(opportunity))
          break
        case 'pricing_opportunity':
          recommendations.push(...await this.generatePricingRecommendations(opportunity))
          break
        case 'talent_acquisition':
          recommendations.push(...await this.generateTalentRecommendations(opportunity))
          break
        case 'partnership_opportunity':
          recommendations.push(...await this.generatePartnershipRecommendations(opportunity))
          break
        default:
          recommendations.push(...await this.generateGenericRecommendations(opportunity))
      }

      // Sort recommendations by priority and expected ROI
      return recommendations.sort((a, b) => {
        const priorityScore = this.getPriorityScore(b.priority) - this.getPriorityScore(a.priority)
        if (priorityScore !== 0) return priorityScore
        return b.expectedROI - a.expectedROI
      })
    } catch (error) {
      logError('Error generating recommendations:', error)
      return []
    }
  }

  /**
   * Calculate priority score for an opportunity based on multiple factors
   */
  async calculatePriorityScore(opportunity: OpportunityDetectionResult): Promise<OpportunityPrioritization> {
    try {
      // Impact scoring (0-10)
      const impactScore = this.calculateImpactScore(opportunity)

      // Effort scoring (0-10, inverted - lower effort = higher score)
      const effortScore = this.calculateEffortScore(opportunity)

      // Timing scoring (0-10)
      const timingScore = this.calculateTimingScore(opportunity)

      // Confidence scoring (0-10)
      const confidenceScore = opportunity.confidence * 10

      // Risk scoring (0-10, inverted - lower risk = higher score)
      const riskScore = await this.calculateRiskScore(opportunity)

      // Resource availability scoring (0-10)
      const resourceScore = await this.calculateResourceScore(opportunity)

      // Strategic alignment scoring (0-10)
      const strategicAlignmentScore = await this.calculateStrategicAlignmentScore(opportunity)

      // Competitive advantage scoring (0-10)
      const competitiveAdvantageScore = this.calculateCompetitiveAdvantageScore(opportunity)

      // Market timing scoring (0-10)
      const marketTimingScore = await this.calculateMarketTimingScore(opportunity)

      // Weighted priority score calculation
      const weights = {
        impact: 0.25,
        effort: 0.15,
        timing: 0.15,
        confidence: 0.10,
        risk: 0.10,
        resource: 0.10,
        strategicAlignment: 0.10,
        competitiveAdvantage: 0.03,
        marketTiming: 0.02
      }

      const priorityScore = (
        impactScore * weights.impact +
        effortScore * weights.effort +
        timingScore * weights.timing +
        confidenceScore * weights.confidence +
        riskScore * weights.risk +
        resourceScore * weights.resource +
        strategicAlignmentScore * weights.strategicAlignment +
        competitiveAdvantageScore * weights.competitiveAdvantage +
        marketTimingScore * weights.marketTiming
      )

      return {
        opportunityId: opportunity.id,
        priorityScore,
        impactScore,
        effortScore,
        timingScore,
        confidenceScore,
        riskScore,
        resourceScore,
        strategicAlignmentScore,
        competitiveAdvantageScore,
        marketTimingScore
      }
    } catch (error) {
      logError('Error calculating priority score:', error)
      return {
        opportunityId: opportunity.id,
        priorityScore: 5,
        impactScore: 5,
        effortScore: 5,
        timingScore: 5,
        confidenceScore: 5,
        riskScore: 5,
        resourceScore: 5,
        strategicAlignmentScore: 5,
        competitiveAdvantageScore: 5,
        marketTimingScore: 5
      }
    }
  }

  /**
   * Store opportunity in database with recommendations and prioritization
   */
  async storeOpportunity(
    userId: string,
    opportunity: OpportunityDetectionResult,
    recommendations: OpportunityRecommendation[],
    prioritization: OpportunityPrioritization
  ): Promise<string> {
    try {
      // Store the main opportunity
      const [storedOpportunity] = await db
        .insert(competitiveOpportunities)
        .values({
          id: opportunity.id,
          user_id: userId,
          competitor_id: opportunity.competitorId,
          opportunity_type: opportunity.opportunityType,
          title: opportunity.title,
          description: opportunity.description,
          confidence: opportunity.confidence.toString(),
          impact: opportunity.impact,
          effort: opportunity.effort,
          timing: opportunity.timing,
          priority_score: prioritization.priorityScore.toString(),
          evidence: opportunity.evidence,
          recommendations: opportunity.recommendations,
          status: 'identified',
          roi_estimate: this.estimateROI(opportunity).toString(),
          success_metrics: this.generateSuccessMetrics(opportunity),
          tags: this.generateTags(opportunity),
          detected_at: opportunity.detectedAt
        } as any)
        .returning()

      // Store recommended actions
      for (const recommendation of recommendations) {
        await db
          .insert(opportunityActions)
          .values({
            opportunity_id: opportunity.id,
            user_id: userId,
            action_type: recommendation.actionType,
            title: recommendation.title,
            description: recommendation.description,
            priority: recommendation.priority,
            estimated_effort_hours: recommendation.estimatedEffort,
            estimated_cost: recommendation.estimatedCost.toString(),
            expected_outcome: `Expected ROI: ${recommendation.expectedROI}%`,
            status: 'pending'
          })
      }

      // Store initial metrics
      const metrics = this.generateInitialMetrics(opportunity)
      for (const metric of metrics) {
        await db
          .insert(opportunityMetrics)
          .values({
            opportunity_id: opportunity.id,
            user_id: userId,
            metric_name: metric.name,
            metric_type: metric.type,
            baseline_value: metric.baselineValue?.toString(),
            target_value: metric.targetValue?.toString(),
            current_value: metric.baselineValue?.toString(),
            unit: metric.unit
          })
      }

      return opportunity.id
    } catch (error) {
      logError('Error storing opportunity:', error)
      throw error
    }
  }

  /**
   * Get opportunities for a user with filtering and sorting
   */
  async getOpportunities(
    userId: string,
    filters: {
      status?: string[]
      opportunityType?: string[]
      impact?: string[]
      competitorId?: string
      minPriorityScore?: number
      isArchived?: boolean
    } = {},
    sorting: {
      field: 'priority_score' | 'detected_at' | 'impact' | 'confidence'
      direction: 'asc' | 'desc'
    } = { field: 'priority_score', direction: 'desc' }
  ) {
    try {
      // Build all conditions first
      const conditions = [eq(competitiveOpportunities.user_id, userId)]

      if (filters.status?.length) {
        conditions.push(inArray(competitiveOpportunities.status, filters.status))
      }

      if (filters.opportunityType?.length) {
        conditions.push(inArray(competitiveOpportunities.opportunity_type, filters.opportunityType))
      }
      if (filters.isArchived !== undefined) {
        conditions.push(eq(competitiveOpportunities.is_archived, filters.isArchived))
      }

      // Apply sorting
      const sortField = competitiveOpportunities[sorting.field]
      const orderByClause = sorting.direction === 'desc'
        ? desc(sortField)
        : asc(sortField)

      // Build the complete query with all conditions and sorting
      const query = db
        .select({
          opportunity: competitiveOpportunities,
          competitor: competitorProfiles
        })
        .from(competitiveOpportunities)
        .leftJoin(competitorProfiles, eq(competitiveOpportunities.competitor_id, competitorProfiles.id))
        .where(conditions.length > 1 ? and(...conditions) : conditions[0])
        .orderBy(orderByClause)

      return await query
    } catch (error) {
      logError('Error getting opportunities:', error)
      return []
    }
  }

  /**
   * Update opportunity status and progress
   */
  async updateOpportunityStatus(
    opportunityId: string,
    userId: string,
    status: string,
    progress?: number,
    notes?: string
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date()
      }

      if (status === 'in_progress' && !progress) {
        updateData.started_at = new Date()
      }

      if (status === 'completed') {
        updateData.completed_at = new Date()
        updateData.progress = 100
      }

      if (notes) {
        updateData.implementation_notes = notes
      }

      await db
        .update(competitiveOpportunities)
        .set(updateData)
        .where(
          and(
            eq(competitiveOpportunities.id, opportunityId),
            eq(competitiveOpportunities.user_id, userId)
          )
        )

      return true
    } catch (error) {
      logError('Error updating opportunity status:', error)
      return false
    }
  }

  /**
   * Track opportunity ROI and success metrics
   */
  async trackOpportunityROI(
    opportunityId: string,
    userId: string,
    actualROI: number,
    actualRevenue?: number,
    actualCosts?: number,
    notes?: string
  ): Promise<boolean> {
    try {
      await db
        .update(competitiveOpportunities)
        .set({
          actual_roi: actualROI.toString(),
          implementation_notes: notes,
          updated_at: new Date()
        })
        .where(
          and(
            eq(competitiveOpportunities.id, opportunityId),
            eq(competitiveOpportunities.user_id, userId)
          )
        )

      // Update revenue and cost metrics if provided
      if (actualRevenue !== undefined) {
        await this.updateMetric(opportunityId, userId, 'revenue', actualRevenue)
      }

      if (actualCosts !== undefined) {
        await this.updateMetric(opportunityId, userId, 'costs', actualCosts)
      }

      return true
    } catch (error) {
      logError('Error tracking opportunity ROI:', error)
      return false
    }
  }

  /**
   * Update a specific metric for an opportunity
   */
  async updateMetric(
    opportunityId: string,
    userId: string,
    metricName: string,
    value: number,
    notes?: string
  ): Promise<boolean> {
    try {
      // Check if metric exists
      const existingMetric = await db
        .select()
        .from(opportunityMetrics)
        .where(
          and(
            eq(opportunityMetrics.opportunity_id, opportunityId),
            eq(opportunityMetrics.user_id, userId),
            eq(opportunityMetrics.metric_name, metricName)
          )
        )
        .limit(1)

      if (existingMetric.length > 0) {
        // Update existing metric
        await db
          .update(opportunityMetrics)
          .set({
            current_value: value.toString(),
            measurement_date: new Date(),
            notes,
            updated_at: new Date()
          })
          .where(eq(opportunityMetrics.id, existingMetric[0].id))
      } else {
        // Create new metric
        await db
          .insert(opportunityMetrics)
          .values({
            opportunity_id: opportunityId,
            user_id: userId,
            metric_name: metricName,
            metric_type: 'custom',
            current_value: value.toString(),
            unit: 'units',
            notes
          })
      }

      return true
    } catch (error) {
      logError('Error updating metric:', error)
      return false
    }
  }

  /**
   * Get opportunity analytics and insights
   */
  async getOpportunityAnalytics(userId: string, timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month') {
    try {
      const timeframeDays = {
        week: 7,
        month: 30,
        quarter: 90,
        year: 365
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - timeframeDays[timeframe])

      // Get opportunity statistics
      const stats = await db
        .select({
          total: sql<number>`count(*)`,
          completed: sql<number>`count(*) filter (where status = 'completed')`,
          in_progress: sql<number>`count(*) filter (where status = 'in_progress')`,
          identified: sql<number>`count(*) filter (where status = 'identified')`,
          avg_priority: sql<number>`avg(cast(priority_score as decimal))`,
          total_estimated_roi: sql<number>`sum(cast(roi_estimate as decimal))`,
          total_actual_roi: sql<number>`sum(cast(actual_roi as decimal))`
        })
        .from(competitiveOpportunities)
        .where(
          and(
            eq(competitiveOpportunities.user_id, userId),
            gte(competitiveOpportunities.detected_at, startDate),
            eq(competitiveOpportunities.is_archived, false)
          )
        )

      // Get opportunities by type
      const byType = await db
        .select({
          opportunity_type: competitiveOpportunities.opportunity_type,
          count: sql<number>`count(*)`,
          avg_priority: sql<number>`avg(cast(priority_score as decimal))`
        })
        .from(competitiveOpportunities)
        .where(
          and(
            eq(competitiveOpportunities.user_id, userId),
            gte(competitiveOpportunities.detected_at, startDate),
            eq(competitiveOpportunities.is_archived, false)
          )
        )
        .groupBy(competitiveOpportunities.opportunity_type)

      // Get top performing opportunities
      const topPerforming = await db
        .select()
        .from(competitiveOpportunities)
        .where(
          and(
            eq(competitiveOpportunities.user_id, userId),
            not(isNull(competitiveOpportunities.actual_roi)),
            eq(competitiveOpportunities.is_archived, false)
          )
        )
        .orderBy(desc(competitiveOpportunities.actual_roi))
        .limit(5)

      return {
        stats: stats[0] || {
          total: 0,
          completed: 0,
          in_progress: 0,
          identified: 0,
          avg_priority: 0,
          total_estimated_roi: 0,
          total_actual_roi: 0
        },
        byType,
        topPerforming,
        timeframe
      }
    } catch (error) {
      logError('Error getting opportunity analytics:', error)
      return null
    }
  }

  // Private helper methods

  private async generateWeaknessRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    return [
      {
        id: `rec_weakness_${Date.now()}_1`,
        opportunityId: opportunity.id,
        title: 'Develop Superior Solution',
        description: 'Create a product/service that directly addresses the competitor weakness',
        actionType: 'product',
        priority: 'high',
        estimatedEffort: 40,
        estimatedCost: 5000,
        expectedROI: 150,
        timeframe: 'medium-term',
        prerequisites: ['Market research', 'Technical feasibility study'],
        risks: ['Development delays', 'Market timing'],
        successMetrics: ['Customer acquisition', 'Market share gain'],
        resources: ['Development team', 'Marketing budget'],
        confidence: opportunity.confidence,
        createdAt: new Date()
      },
      {
        id: `rec_weakness_${Date.now()}_2`,
        opportunityId: opportunity.id,
        title: 'Targeted Marketing Campaign',
        description: 'Launch marketing campaign highlighting your advantages over competitor weakness',
        actionType: 'marketing',
        priority: 'medium',
        estimatedEffort: 20,
        estimatedCost: 2000,
        expectedROI: 80,
        timeframe: 'short-term',
        prerequisites: ['Marketing materials', 'Target audience analysis'],
        risks: ['Competitor response', 'Brand perception'],
        successMetrics: ['Lead generation', 'Brand awareness'],
        resources: ['Marketing team', 'Creative assets'],
        confidence: opportunity.confidence * 0.8,
        createdAt: new Date()
      }
    ]
  }

  private async generateMarketGapRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    return [
      {
        id: `rec_gap_${Date.now()}_1`,
        opportunityId: opportunity.id,
        title: 'Market Entry Strategy',
        description: 'Develop strategy to enter the identified market gap',
        actionType: 'strategic',
        priority: 'high',
        estimatedEffort: 60,
        estimatedCost: 10000,
        expectedROI: 200,
        timeframe: 'long-term',
        prerequisites: ['Market analysis', 'Business plan', 'Funding'],
        risks: ['Market validation', 'Competition entry'],
        successMetrics: ['Market penetration', 'Revenue growth'],
        resources: ['Strategy team', 'Investment capital'],
        confidence: opportunity.confidence,
        createdAt: new Date()
      }
    ]
  }

  private async generatePricingRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    return [
      {
        id: `rec_pricing_${Date.now()}_1`,
        opportunityId: opportunity.id,
        title: 'Pricing Strategy Optimization',
        description: 'Adjust pricing to capitalize on competitor pricing gaps',
        actionType: 'pricing',
        priority: 'high',
        estimatedEffort: 10,
        estimatedCost: 500,
        expectedROI: 120,
        timeframe: 'immediate',
        prerequisites: ['Pricing analysis', 'Customer research'],
        risks: ['Customer reaction', 'Margin impact'],
        successMetrics: ['Revenue increase', 'Market share'],
        resources: ['Pricing team', 'Analytics tools'],
        confidence: opportunity.confidence,
        createdAt: new Date()
      }
    ]
  }

  private async generateTalentRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    return [
      {
        id: `rec_talent_${Date.now()}_1`,
        opportunityId: opportunity.id,
        title: 'Strategic Talent Acquisition',
        description: 'Recruit key talent from competitor during their hiring challenges',
        actionType: 'talent',
        priority: 'medium',
        estimatedEffort: 30,
        estimatedCost: 15000,
        expectedROI: 100,
        timeframe: 'short-term',
        prerequisites: ['Research plan'],
        risks: ['Time investment'],
        successMetrics: ['Research insights', 'Action plan'],
        resources: ['Research team'],
        confidence: opportunity.confidence * 0.5,
        createdAt: new Date()
      }
    ]
  }

  private async generatePartnershipRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    return [
      {
        id: `rec_partner_${Date.now()}_1`,
        opportunityId: opportunity.id,
        title: 'Strategic Partnership Outreach',
        description: 'Initiate partnership discussions with key players',
        actionType: 'partnership',
        priority: 'high',
        estimatedEffort: 40,
        estimatedCost: 2000,
        expectedROI: 150,
        timeframe: 'medium-term',
        prerequisites: ['Partnership proposal', 'Target list'],
        risks: ['Negotiation failure', 'Misaligned goals'],
        successMetrics: ['Partnership agreement', 'Joint revenue'],
        resources: ['BD team', 'Legal counsel'],
        confidence: opportunity.confidence,
        createdAt: new Date()
      }
    ]
  }

  private async generateGenericRecommendations(opportunity: OpportunityDetectionResult): Promise<OpportunityRecommendation[]> {
    return [
      {
        id: `rec_generic_${Date.now()}_1`,
        opportunityId: opportunity.id,
        title: 'Opportunity Assessment',
        description: 'Conduct detailed assessment of the identified opportunity',
        actionType: 'research',
        priority: 'medium',
        estimatedEffort: 20,
        estimatedCost: 1000,
        expectedROI: 50,
        timeframe: 'short-term',
        prerequisites: ['Research plan'],
        risks: ['Time investment'],
        successMetrics: ['Assessment report', 'Action plan'],
        resources: ['Analyst'],
        confidence: opportunity.confidence,
        createdAt: new Date()
      }
    ]
  }

  private getPriorityScore(priority: string): number {
    const scores = { low: 1, medium: 2, high: 3, critical: 4 }
    return scores[priority as keyof typeof scores] || 2
  }

  private calculateImpactScore(opportunity: OpportunityDetectionResult): number {
    const impactScores = { low: 2, medium: 5, high: 8, critical: 10 }
    return impactScores[opportunity.impact] || 5
  }

  private calculateEffortScore(opportunity: OpportunityDetectionResult): number {
    const effortScores = { low: 10, medium: 6, high: 3 }
    return effortScores[opportunity.effort] || 6
  }

  private calculateTimingScore(opportunity: OpportunityDetectionResult): number {
    const timingScores = { immediate: 10, 'short-term': 8, 'medium-term': 5, 'long-term': 3 }
    return timingScores[opportunity.timing] || 5
  }

  private async calculateRiskScore(opportunity: OpportunityDetectionResult): Promise<number> {
    // Simple risk assessment based on opportunity type and evidence
    let riskScore = 7 // Default medium-low risk

    if (opportunity.evidence.length < 3) riskScore -= 2
    if (opportunity.confidence < 0.5) riskScore -= 2
    if (opportunity.opportunityType === 'partnership_opportunity') riskScore -= 1

    return Math.max(1, Math.min(10, riskScore))
  }

  private async calculateResourceScore(opportunity: OpportunityDetectionResult): Promise<number> {
    // Placeholder for resource availability check
    return 7
  }

  private async calculateStrategicAlignmentScore(opportunity: OpportunityDetectionResult): Promise<number> {
    // Placeholder for strategic alignment check
    return 8
  }

  private calculateCompetitiveAdvantageScore(opportunity: OpportunityDetectionResult): number {
    // Placeholder for competitive advantage check
    return 6
  }

  private async calculateMarketTimingScore(opportunity: OpportunityDetectionResult): Promise<number> {
    // Placeholder for market timing check
    return 7
  }

  private estimateROI(opportunity: OpportunityDetectionResult): number {
    // Placeholder for ROI estimation
    return 100
  }

  private generateSuccessMetrics(opportunity: OpportunityDetectionResult): string[] {
    return ['Revenue', 'Market Share']
  }

  private generateTags(opportunity: OpportunityDetectionResult): string[] {
    return [opportunity.opportunityType, opportunity.impact]
  }

  private generateInitialMetrics(opportunity: OpportunityDetectionResult): any[] {
    return [
      { name: 'Revenue', type: 'revenue', baselineValue: 0, targetValue: 10000, unit: 'USD' }
    ]
  }
}

export const opportunityRecommendationSystem = new OpportunityRecommendationSystem()