import { SimpleTrainingCollector } from "./simple-training-collector"
import type { TrainingInteraction, TrainingMetrics } from "./simple-training-collector"

export interface PerformanceInsight {
  type: 'success' | 'warning' | 'error' | 'optimization'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  recommendation: string
  metrics: Record<string, any>
}

export interface AgentPerformanceProfile {
  agentId: string
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  improvementAreas: string[]
  recommendations: string[]
  performanceInsights: PerformanceInsight[]
  benchmarkComparison: {
    vsAverage: number
    vsTopPerformer: number
    percentile: number
  }
}

export interface TrainingRecommendation {
  agentId: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  type: 'fine_tuning' | 'prompt_optimization' | 'model_switch' | 'collaboration_improvement'
  title: string
  description: string
  expectedImprovement: string
  effort: 'low' | 'medium' | 'high'
  dataRequirements: string[]
  implementationSteps: string[]
}

export class PerformanceAnalytics {
  private dataCollector: SimpleTrainingCollector

  constructor() {
    this.dataCollector = new SimpleTrainingCollector()
  }

  async analyzeAgentPerformance(agentId: string, userId: string): Promise<AgentPerformanceProfile> {
    const trainingData = await this.dataCollector.getTrainingDataForAgent(agentId, userId)
    const metrics = await this.dataCollector.getTrainingMetrics(userId)

    if (trainingData.length === 0) {
      return {
        agentId,
        overallScore: 0,
        strengths: [],
        weaknesses: ['Insufficient training data'],
        improvementAreas: ['Data collection'],
        recommendations: ['Increase interaction volume to enable analysis'],
        performanceInsights: [],
        benchmarkComparison: {
          vsAverage: 0,
          vsTopPerformer: 0,
          percentile: 0
        }
      }
    }

    const agentMetrics = this.calculateAgentMetrics(trainingData)
    const insights = await this.generatePerformanceInsights(agentId, trainingData, metrics)
    const recommendations = this.generateRecommendations(agentId, agentMetrics, insights)

    return {
      agentId,
      overallScore: this.calculateOverallScore(agentMetrics),
      strengths: this.identifyStrengths(agentMetrics),
      weaknesses: this.identifyWeaknesses(agentMetrics),
      improvementAreas: this.identifyImprovementAreas(agentMetrics, insights),
      recommendations: recommendations.map(r => r.description),
      performanceInsights: insights,
      benchmarkComparison: this.calculateBenchmarkComparison(agentMetrics, metrics)
    }
  }

  private calculateAgentMetrics(data: TrainingInteraction[]) {
    const total = data.length
    const successful = data.filter(d => d.success).length
    const withRating = data.filter(d => d.userRating !== null)
    
    return {
      totalInteractions: total,
      successRate: (successful / total) * 100,
      averageRating: withRating.length > 0 
        ? withRating.reduce((sum, d) => sum + (d.userRating || 0), 0) / withRating.length 
        : 0,
      averageResponseTime: data.reduce((sum, d) => sum + d.responseTime, 0) / total,
      averageConfidence: data.reduce((sum, d) => sum + d.confidence, 0) / total,
      collaborationRate: data.filter(d => d.collaborationRequests.length > 0).length / total * 100,
      followUpRate: data.filter(d => d.followUpTasks.length > 0).length / total * 100,
      ratingDistribution: this.calculateRatingDistribution(withRating),
      responseTimeDistribution: this.calculateResponseTimeDistribution(data),
      confidenceDistribution: this.calculateConfidenceDistribution(data)
    }
  }

  private calculateRatingDistribution(data: TrainingInteraction[]) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    data.forEach(d => {
      if (d.userRating) {
        distribution[d.userRating as keyof typeof distribution]++
      }
    })
    return distribution
  }

  private calculateResponseTimeDistribution(data: TrainingInteraction[]) {
    const sorted = data.map(d => d.responseTime).sort((a, b) => a - b)
    return {
      min: sorted[0] || 0,
      max: sorted[sorted.length - 1] || 0,
      median: sorted[Math.floor(sorted.length / 2)] || 0,
      p95: sorted[Math.floor(sorted.length * 0.95)] || 0
    }
  }

  private calculateConfidenceDistribution(data: TrainingInteraction[]) {
    const sorted = data.map(d => d.confidence).sort((a, b) => a - b)
    return {
      min: sorted[0] || 0,
      max: sorted[sorted.length - 1] || 0,
      median: sorted[Math.floor(sorted.length / 2)] || 0,
      p95: sorted[Math.floor(sorted.length * 0.95)] || 0
    }
  }

  private async generatePerformanceInsights(
    agentId: string, 
    data: TrainingInteraction[], 
    metrics: TrainingMetrics
  ): Promise<PerformanceInsight[]> {
    const insights: PerformanceInsight[] = []
    const agentMetrics = this.calculateAgentMetrics(data)

    // Success rate insights
    if (agentMetrics.successRate < 70) {
      insights.push({
        type: 'error',
        title: 'Low Success Rate',
        description: `Agent has a ${agentMetrics.successRate.toFixed(1)}% success rate, below the 70% threshold`,
        impact: 'high',
        recommendation: 'Review failed interactions and optimize prompts or model parameters',
        metrics: { successRate: agentMetrics.successRate }
      })
    } else if (agentMetrics.successRate > 90) {
      insights.push({
        type: 'success',
        title: 'Excellent Success Rate',
        description: `Agent maintains a ${agentMetrics.successRate.toFixed(1)}% success rate`,
        impact: 'medium',
        recommendation: 'Consider sharing best practices with other agents',
        metrics: { successRate: agentMetrics.successRate }
      })
    }

    // Response time insights
    if (agentMetrics.averageResponseTime > 10000) {
      insights.push({
        type: 'warning',
        title: 'Slow Response Times',
        description: `Average response time is ${(agentMetrics.averageResponseTime / 1000).toFixed(1)}s`,
        impact: 'medium',
        recommendation: 'Optimize model parameters or consider faster models',
        metrics: { averageResponseTime: agentMetrics.averageResponseTime }
      })
    }

    // Rating insights
    if (agentMetrics.averageRating < 3.0) {
      insights.push({
        type: 'error',
        title: 'Low User Satisfaction',
        description: `Average user rating is ${agentMetrics.averageRating.toFixed(1)}/5`,
        impact: 'high',
        recommendation: 'Analyze user feedback and improve response quality',
        metrics: { averageRating: agentMetrics.averageRating }
      })
    }

    // Collaboration insights
    if (agentMetrics.collaborationRate < 10) {
      insights.push({
        type: 'optimization',
        title: 'Low Collaboration Rate',
        description: `Only ${agentMetrics.collaborationRate.toFixed(1)}% of interactions involve collaboration`,
        impact: 'low',
        recommendation: 'Encourage more inter-agent collaboration for complex tasks',
        metrics: { collaborationRate: agentMetrics.collaborationRate }
      })
    }

    return insights
  }

  private generateRecommendations(
    agentId: string, 
    metrics: any, 
    insights: PerformanceInsight[]
  ): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = []

    // Success rate recommendations
    if (metrics.successRate < 70) {
      recommendations.push({
        agentId,
        priority: 'high',
        type: 'fine_tuning',
        title: 'Improve Success Rate',
        description: 'Fine-tune the agent to handle common failure patterns',
        expectedImprovement: 'Increase success rate by 15-25%',
        effort: 'medium',
        dataRequirements: ['Failed interaction examples', 'Success patterns'],
        implementationSteps: [
          'Collect failed interaction data',
          'Identify common failure patterns',
          'Create training dataset',
          'Fine-tune model parameters',
          'Test and validate improvements'
        ]
      })
    }

    // Response time recommendations
    if (metrics.averageResponseTime > 10000) {
      recommendations.push({
        agentId,
        priority: 'medium',
        type: 'model_switch',
        title: 'Optimize Response Speed',
        description: 'Consider switching to a faster model or optimizing parameters',
        expectedImprovement: 'Reduce response time by 30-50%',
        effort: 'low',
        dataRequirements: ['Current model performance data'],
        implementationSteps: [
          'Benchmark current model performance',
          'Test alternative models',
          'Optimize temperature and token limits',
          'Implement response caching',
          'Monitor performance improvements'
        ]
      })
    }

    // Rating recommendations
    if (metrics.averageRating < 3.5) {
      recommendations.push({
        agentId,
        priority: 'high',
        type: 'prompt_optimization',
        title: 'Enhance Response Quality',
        description: 'Optimize prompts to improve user satisfaction',
        expectedImprovement: 'Increase average rating by 0.5-1.0 points',
        effort: 'medium',
        dataRequirements: ['User feedback data', 'Low-rated interactions'],
        implementationSteps: [
          'Analyze user feedback patterns',
          'Identify quality issues',
          'Redesign system prompts',
          'Add personality and context awareness',
          'Test with user groups'
        ]
      })
    }

    return recommendations
  }

  private calculateOverallScore(metrics: any): number {
    const weights = {
      successRate: 0.3,
      averageRating: 0.25,
      responseTime: 0.2,
      confidence: 0.15,
      collaborationRate: 0.1
    }

    const normalizedMetrics = {
      successRate: Math.min(metrics.successRate / 100, 1),
      averageRating: Math.min(metrics.averageRating / 5, 1),
      responseTime: Math.max(0, 1 - (metrics.averageResponseTime / 20000)), // Normalize to 20s max
      confidence: metrics.averageConfidence,
      collaborationRate: Math.min(metrics.collaborationRate / 100, 1)
    }

    return Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (normalizedMetrics[key as keyof typeof normalizedMetrics] * weight)
    }, 0) * 100
  }

  private identifyStrengths(metrics: any): string[] {
    const strengths: string[] = []

    if (metrics.successRate > 85) strengths.push('High success rate')
    if (metrics.averageRating > 4.0) strengths.push('Excellent user satisfaction')
    if (metrics.averageResponseTime < 5000) strengths.push('Fast response times')
    if (metrics.averageConfidence > 0.8) strengths.push('High confidence responses')
    if (metrics.collaborationRate > 20) strengths.push('Good collaboration skills')

    return strengths
  }

  private identifyWeaknesses(metrics: any): string[] {
    const weaknesses: string[] = []

    if (metrics.successRate < 70) weaknesses.push('Low success rate')
    if (metrics.averageRating < 3.0) weaknesses.push('Poor user satisfaction')
    if (metrics.averageResponseTime > 10000) weaknesses.push('Slow response times')
    if (metrics.averageConfidence < 0.6) weaknesses.push('Low confidence responses')
    if (metrics.collaborationRate < 10) weaknesses.push('Limited collaboration')

    return weaknesses
  }

  private identifyImprovementAreas(metrics: any, insights: PerformanceInsight[]): string[] {
    const areas: string[] = []

    insights.forEach(insight => {
      if (insight.type === 'error' || insight.type === 'warning') {
        areas.push(insight.title.toLowerCase())
      }
    })

    return areas
  }

  private calculateBenchmarkComparison(agentMetrics: any, overallMetrics: TrainingMetrics) {
    const vsAverage = {
      successRate: agentMetrics.successRate - overallMetrics.successRate,
      averageRating: agentMetrics.averageRating - overallMetrics.averageRating,
      responseTime: overallMetrics.averageResponseTime - agentMetrics.averageResponseTime
    }

    const topPerformer = overallMetrics.topPerformingAgents[0]
    const vsTopPerformer = topPerformer ? {
      successRate: agentMetrics.successRate - topPerformer.successRate,
      averageRating: agentMetrics.averageRating - topPerformer.averageRating
    } : { successRate: 0, averageRating: 0 }

    // Calculate percentile (simplified)
    const percentile = Math.min(100, Math.max(0, 
      (agentMetrics.successRate + agentMetrics.averageRating * 20) / 2
    ))

    return {
      vsAverage: (vsAverage.successRate + vsAverage.averageRating * 20) / 2,
      vsTopPerformer: (vsTopPerformer.successRate + vsTopPerformer.averageRating * 20) / 2,
      percentile
    }
  }

  async generateTrainingReport(userId: string): Promise<{
    summary: any
    agentProfiles: AgentPerformanceProfile[]
    recommendations: TrainingRecommendation[]
    insights: PerformanceInsight[]
  }> {
    const metrics = await this.dataCollector.getTrainingMetrics(userId)
    const agentIds = ['roxy', 'blaze', 'echo', 'lumi', 'vex', 'lexi', 'nova', 'glitch']
    
    const agentProfiles = await Promise.all(
      agentIds.map(agentId => this.analyzeAgentPerformance(agentId, userId))
    )

    const allRecommendations = agentProfiles.flatMap(profile => 
      this.generateRecommendations(profile.agentId, this.calculateAgentMetrics(
        [] // We'd need to get the data again, but for now use empty array
      ), profile.performanceInsights)
    )

    const allInsights = agentProfiles.flatMap(profile => profile.performanceInsights)

    return {
      summary: {
        totalAgents: agentProfiles.length,
        averageScore: agentProfiles.reduce((sum, p) => sum + p.overallScore, 0) / agentProfiles.length,
        totalRecommendations: allRecommendations.length,
        criticalIssues: allInsights.filter(i => i.type === 'error').length,
        ...metrics
      },
      agentProfiles,
      recommendations: allRecommendations.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }),
      insights: allInsights
    }
  }
}
