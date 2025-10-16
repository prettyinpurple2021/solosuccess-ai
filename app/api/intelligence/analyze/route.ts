import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { db} from '@/db'
import { intelligenceData, competitorProfiles} from '@/db/schema'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { z} from 'zod'
import { eq, and, inArray, gte, desc} from 'drizzle-orm'

import type { IntelligenceData,

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'
  AnalysisResult,
  ExtractedData,
  SourceType,
  ImportanceLevel
 } from '@/lib/competitor-intelligence-types'


// Edge Runtime disabled due to Node.js dependency incompatibility

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schema for analysis request
const AnalysisRequestSchema = z.object({
  intelligenceIds: z.array(z.number().int().positive()).min(1).max(50),
  analysisType: z.enum(['comprehensive', 'trend', 'sentiment', 'competitive', 'opportunity']).default('comprehensive'),
  agentIds: z.array(z.string()).optional(), // Specific agents to use for analysis
  focusAreas: z.array(z.enum(['marketing', 'strategic', 'product', 'pricing', 'technical', 'opportunity', 'threat'])).optional(),
})

// Fallback AI analysis service during migration
async function performIntelligenceAnalysis(
  intelligenceEntries: any[],
  analysisType: string,
  agentIds?: string[],
  focusAreas?: string[]
): Promise<AnalysisResult[]> {
  logWarn('Intelligence analysis temporarily using fallback response during migration')
  
  const agents = agentIds && agentIds.length ? agentIds : ['echo', 'lexi', 'nova', 'blaze']
  const results: AnalysisResult[] = []
  
  // Return fallback analysis results
  for (const agentId of agents.slice(0, 2)) { // Limit to 2 agents for fallback
    results.push({
      agentId,
      analysisType,
      insights: [
        {
          id: `fallback-insight-${Date.now()}-${agentId}`,
          type: 'competitive',
          title: `${agentId.charAt(0).toUpperCase() + agentId.slice(1)} Analysis Pending`,
          description: 'Intelligence analysis is temporarily disabled during migration to worker-based system',
          significance: 'medium',
          confidence: 0.5,
          evidence: ['System migration in progress'],
          implications: ['Full analysis will be available after worker integration'],
          relatedCompetitors: [],
          tags: ['fallback', 'migration']
        }
      ],
      recommendations: [
        {
          id: `fallback-rec-${Date.now()}-${agentId}`,
          type: 'strategic',
          title: 'System Migration Notice',
          description: 'Intelligence analysis system is being migrated to worker-based architecture for better performance',
          priority: 'medium',
          estimatedEffort: 'TBD',
          potentialImpact: 'System restoration',
          timeline: 'Migration in progress',
          actionItems: ['Wait for system migration completion'],
          rationale: 'Improving system architecture and performance'
        }
      ],
      confidence: 0.5,
      analyzedAt: new Date(),
    })
  }
  
  return results
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('intelligence:analyze', ip, 60_000, 5)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = AnalysisRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Fetch intelligence entries with competitor info
    const intelligence = await db
      .select({
        intelligence: intelligenceData,
        competitor: {
          id: competitorProfiles.id,
          name: competitorProfiles.name,
          domain: competitorProfiles.domain,
          threatLevel: competitorProfiles.threat_level,
        }
      })
      .from(intelligenceData)
      .leftJoin(competitorProfiles, eq(intelligenceData.competitor_id, competitorProfiles.id))
      .where(
        and(
          inArray(intelligenceData.id, data.intelligenceIds),
          eq(intelligenceData.user_id, user.id)
        )
      )

    if (intelligence.length === 0) {
      return NextResponse.json(
        { error: 'No intelligence entries found or access denied' },
        { status: 404 }
      )
    }

    // Transform intelligence data for analysis
    const intelligenceForAnalysis = intelligence.map(item => ({
      id: item.intelligence.id,
      competitorId: item.intelligence.competitor_id,
      sourceType: item.intelligence.source_type as SourceType,
      sourceUrl: item.intelligence.source_url,
      dataType: item.intelligence.data_type,
      rawContent: item.intelligence.raw_content,
      extractedData: (item.intelligence.extracted_data as ExtractedData) || {},
      analysisResults: (item.intelligence.analysis_results as AnalysisResult[]) || [],
      confidence: item.intelligence.confidence ? parseFloat(item.intelligence.confidence) : 0,
      importance: item.intelligence.importance as ImportanceLevel,
      tags: (item.intelligence.tags as string[]) || [],
      collectedAt: item.intelligence.collected_at!,
      competitor: item.competitor,
    }))

    // Perform AI analysis
    const analysisResults = await performIntelligenceAnalysis(
      intelligenceForAnalysis,
      data.analysisType,
      data.agentIds,
      data.focusAreas
    )

    // Update intelligence entries with new analysis results
    const updatePromises = intelligence.map(async (item) => {
      const existingAnalysisResults = (item.intelligence.analysis_results as AnalysisResult[]) || []
      const newAnalysisResults = analysisResults.filter(_result => 
        // Add analysis results to all entries for now - in production you'd be more selective
        true
      )
      const mergedAnalysisResults = [...existingAnalysisResults, ...newAnalysisResults]

      return db
        .update(intelligenceData)
        .set({
          analysis_results: mergedAnalysisResults,
          processed_at: new Date(),
          updated_at: new Date(),
        })
        .where(eq(intelligenceData.id, item.intelligence.id))
    })

    await Promise.all(updatePromises)

    // Generate analysis summary
    const summary = {
      totalIntelligenceAnalyzed: intelligence.length,
      competitorsAnalyzed: [...new Set(intelligence.map(i => i.intelligence.competitor_id))].length,
      analysisResultsGenerated: analysisResults.length,
      averageConfidence: analysisResults.reduce((sum, r) => sum + r.confidence, 0) / (analysisResults.length || 1),
      insightsByType: analysisResults.reduce((acc, result) => {
        result.insights.forEach(insight => {
          acc[insight.type] = (acc[insight.type] || 0) + 1
        })
        return acc
      }, {} as Record<string, number>),
      recommendationsByType: analysisResults.reduce((acc, result) => {
        result.recommendations.forEach(rec => {
          acc[rec.type] = (acc[rec.type] || 0) + 1
        })
        return acc
      }, {} as Record<string, number>),
      highPriorityRecommendations: analysisResults.reduce((count, result) => 
        count + result.recommendations.filter(r => r.priority === 'high').length, 0
      ),
    }

    return NextResponse.json({
      analysisResults,
      summary,
      intelligenceEntries: intelligenceForAnalysis.map(entry => ({
        id: entry.id,
        competitorId: entry.competitorId,
        sourceType: entry.sourceType,
        dataType: entry.dataType,
        importance: entry.importance,
        collectedAt: entry.collectedAt,
        competitor: entry.competitor,
      })),
    })
  } catch (error) {
    logError('Error analyzing intelligence data:', error)
    return NextResponse.json(
      { error: 'Failed to analyze intelligence data' },
      { status: 500 }
    )
  }
}