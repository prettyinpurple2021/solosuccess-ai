import { generateText } from "ai"
import { getTeamMemberConfig } from "./ai-config"
import { db } from '@/db'
import { intelligenceData, competitorProfiles } from '@/db/schema'
import { eq, and, gte, desc } from 'drizzle-orm'
import type { 
  CompetitorProfile, 
  IntelligenceData, 
  AnalysisResult, 
  Insight, 
  Recommendation 
} from './competitor-intelligence-types'

// Nova-specific product and design intelligence types
export interface ProductIntelligenceAnalysis {
  competitorId: number
  analysisType: 'product_features' | 'ux_trends' | 'design_patterns' | 'product_gaps' | 'roadmap_prediction'
  insights: ProductInsight[]
  recommendations: ProductRecommendation[]
  confidence: number
  analyzedAt: Date
}

// ... [Interfaces unchanged for brevity] ...

/**
 * Nova Product Intelligence Service
 * Provides AI-powered product and design analysis for competitor intelligence
 */
export class NovaProductIntelligence {
  private novaConfig = getTeamMemberConfig('nova')

  /**
   * Analyze competitor product features and updates
   */
  async analyzeProductFeatures(competitorId: number, userId: string, days: number = 60): Promise<ProductFeatureAnalysis> {
    const competitor = await this.getCompetitorProfile(competitorId)
    const websiteData = await this.getWebsiteIntelligence(competitorId, days)
    const appStoreData = await this.getAppStoreIntelligence(competitorId, days)
    const socialMediaData = await this.getSocialMediaIntelligence(competitorId, days)

    const analysisPrompt = this.buildProductFeatureAnalysisPrompt(
      competitor, 
      websiteData, 
      appStoreData, 
      socialMediaData
    )

    const { text } = await generateText({
      model: this.novaConfig.model as any,
      prompt: analysisPrompt,
      temperature: 0.7,
      maxOutputTokens: 2500,
    })

    const analysis = this.parseProductFeatureAnalysis(text, competitorId)
    await this.storeProductIntelligence(competitorId, 'product_features', analysis, userId)

    return analysis
  }

  /**
   * Analyze UX/UI trends from competitor websites and apps
   */
  async analyzeUXTrends(competitorId: number, userId: string, days: number = 90): Promise<UXAnalysis> {
    const competitor = await this.getCompetitorProfile(competitorId)
    const websiteData = await this.getWebsiteIntelligence(competitorId, days)
    const appStoreData = await this.getAppStoreIntelligence(competitorId, days)

    const analysisPrompt = this.buildUXTrendAnalysisPrompt(competitor, websiteData, appStoreData)

    const { text } = await generateText({
      model: this.novaConfig.model as any,
      prompt: analysisPrompt,
      temperature: 0.7,
      maxOutputTokens: 2000,
    })

    const analysis = this.parseUXAnalysis(text, competitorId)
    await this.storeProductIntelligence(competitorId, 'ux_trends', analysis, userId)

    return analysis
  }

  /**
   * Identify product gaps and missing features/markets
   */
  async analyzeProductGaps(competitorIds: number[], userProductData?: any, userId?: string): Promise<ProductGap[]> {
    const competitors = await Promise.all(
      competitorIds.map(id => this.getCompetitorProfile(id))
    )

    const competitorProductData = await Promise.all(
      competitorIds.map(id => this.getWebsiteIntelligence(id, 90))
    )

    const analysisPrompt = this.buildProductGapAnalysisPrompt(
      competitors, 
      competitorProductData, 
      userProductData
    )

    const { text } = await generateText({
      model: this.novaConfig.model as any,
      prompt: analysisPrompt,
      temperature: 0.8,
      maxOutputTokens: 2000,
    })

    const gaps = this.parseProductGapAnalysis(text)

    // Store gap analysis for each competitor
    for (const competitorId of competitorIds) {
      await this.storeProductIntelligence(competitorId, 'product_gaps', gaps, userId || '')
    }

    return gaps
  }

  /**
   * Analyze design patterns for competitive advantage identification
   */
  async analyzeDesignPatterns(competitorIds: number[], userId?: string): Promise<DesignPattern[]> {
    const competitors = await Promise.all(
      competitorIds.map(id => this.getCompetitorProfile(id))
    )

    const designData = await Promise.all(
      competitorIds.map(id => this.getWebsiteIntelligence(id, 60))
    )

    const analysisPrompt = this.buildDesignPatternAnalysisPrompt(competitors, designData)

    const { text } = await generateText({
      model: this.novaConfig.model as any,
      prompt: analysisPrompt,
      temperature: 0.7,
      maxOutputTokens: 1800,
    })

    const patterns = this.parseDesignPatternAnalysis(text)

    // Store design pattern analysis
    for (const competitorId of competitorIds) {
      await this.storeProductIntelligence(competitorId, 'design_patterns', patterns, userId || '')
    }

    return patterns
  }

  /**
   * Predict product roadmap based on competitor development patterns
   */
  async predictProductRoadmap(competitorId: number, userId?: string): Promise<ProductRoadmapPrediction> {
    const competitor = await this.getCompetitorProfile(competitorId)
    const hiringData = await this.getHiringIntelligence(competitorId, 180)
    const productData = await this.getWebsiteIntelligence(competitorId, 180)
    const socialMediaData = await this.getSocialMediaIntelligence(competitorId, 90)

    const analysisPrompt = this.buildRoadmapPredictionPrompt(
      competitor, 
      hiringData, 
      productData, 
      socialMediaData
    )

    const { text } = await generateText({
      model: this.novaConfig.model as any,
      prompt: analysisPrompt,
      temperature: 0.7,
      maxOutputTokens: 2200,
    })

    const prediction = this.parseRoadmapPrediction(text, competitorId)
    await this.storeProductIntelligence(competitorId, 'roadmap_prediction', prediction, userId || '')

    return prediction
  }

  /**
   * Generate product intelligence briefing
   */
  async generateProductBriefing(
    competitorIds: number[], 
    timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<string> {
    const days = timeframe === 'daily' ? 1 : timeframe === 'weekly' ? 7 : 30

    const briefingData = await Promise.all(
      competitorIds.map(async (id) => {
        const competitor = await this.getCompetitorProfile(id)
        const productIntelligence = await this.getWebsiteIntelligence(id, days)
        const appIntelligence = await this.getAppStoreIntelligence(id, days)
        return { competitor, productIntelligence, appIntelligence }
      })
    )

    const briefingPrompt = this.buildProductBriefingPrompt(briefingData, timeframe)

    const { text } = await generateText({
      model: this.novaConfig.model as any,
      prompt: briefingPrompt,
      temperature: 0.7,
      maxOutputTokens: 2800,
    })

    return text
  }

  // ... [Rest of the file unchanged] ...
}