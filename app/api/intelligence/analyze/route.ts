import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { db} from '@/db'
import { intelligenceData, competitorProfiles} from '@/db/schema'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { z} from 'zod'
import { eq, and, inArray, gte, desc} from 'drizzle-orm'

import type { IntelligenceData,
  AnalysisResult,
  ExtractedData,
  SourceType,
  ImportanceLevel
 } from '@/lib/competitor-intelligence-types'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schema for analysis request
const AnalysisRequestSchema = z.object({
  intelligenceIds: z.array(z.number().int().positive()).min(1).max(50),
  analysisType: z.enum(['comprehensive', 'trend', 'sentiment', 'competitive', 'opportunity']).default('comprehensive'),
  agentIds: z.array(z.string()).optional(), // Specific agents to use for analysis
  focusAreas: z.array(z.enum(['marketing', 'strategic', 'product', 'pricing', 'technical', 'opportunity', 'threat'])).optional(),
})

// Production AI analysis service
async function performIntelligenceAnalysis(
  intelligenceEntries: any[],
  analysisType: string,
  agentIds?: string[],
  focusAreas?: string[]
): Promise<AnalysisResult[]> {
  const { getTeamMemberConfig } = await import('@/lib/ai-config')
  const agents = agentIds && agentIds.length ? agentIds : ['echo', 'lexi', 'nova', 'blaze']

  const results: AnalysisResult[] = []
  for (const agentId of agents) {
    const { model, systemPrompt } = getTeamMemberConfig(agentId)
    const prompt = `You are ${agentId}. Analyze the following competitive intelligence entries and return JSON with fields: insights[], recommendations[], confidence (0-1). Focus areas: ${focusAreas?.join(', ') || 'general'}. Analysis type: ${analysisType}. Entries:
${JSON.stringify(intelligenceEntries.slice(0, 20)).slice(0, 12000)}`

    try {
      const ai = await (model as any).generate({
        model: (model as any).modelId || model,
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        maxTokens: 1200,
        temperature: 0.3
      })
      const text = (ai?.outputText || ai?.text || '').toString()
      let parsed: any = {}
      try { parsed = JSON.parse(text) } catch { parsed = {} }

      const insights = Array.isArray(parsed.insights) ? parsed.insights : []
      const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : []
      const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.7

      if (insights.length || recommendations.length) {
        results.push({
          agentId,
          analysisType,
          insights,
          recommendations,
          confidence,
          analyzedAt: new Date(),
        })
      }
    } catch (e) {
      // Skip on provider errors, continue other agents
      continue
    }
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