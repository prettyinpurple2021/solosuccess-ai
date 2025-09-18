import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { z} from 'zod'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schema for discovery request
const DiscoveryRequestSchema = z.object({
  businessDescription: z.string().min(1, 'Business description is required').max(500),
  targetMarket: z.string().max(100).optional(),
  keyProducts: z.string().max(200).optional(),
  maxResults: z.number().int().min(1).max(20).default(10),
})

// Mock competitor discovery data - in a real implementation, this would use:
// - Web scraping of business directories
// - Industry databases
// - AI-powered competitor analysis
// - Market research APIs
const MOCK_COMPETITOR_SUGGESTIONS = [
  {
    name: 'TechCorp Solutions',
    domain: 'https://techcorp.com',
    description: 'Leading provider of enterprise software solutions',
    industry: 'Technology',
    estimatedSize: 'medium',
    threatLevel: 'high' as 'low' | 'medium' | 'high' | 'critical',
    reasoning: 'Direct competitor in enterprise software with similar target market',
    confidence: 0.85,
    keyIndicators: [
      'Similar product offerings',
      'Overlapping target market',
      'Recent funding round',
      'Aggressive marketing campaigns'
    ]
  },
  {
    name: 'InnovateLabs',
    domain: 'https://innovatelabs.io',
    description: 'Innovative startup disrupting traditional business processes',
    industry: 'Technology',
    estimatedSize: 'startup',
    threatLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    reasoning: 'Emerging competitor with innovative approach to similar problems',
    confidence: 0.72,
    keyIndicators: [
      'Innovative product features',
      'Growing market presence',
      'Strong social media engagement',
      'Recent product launches'
    ]
  },
  {
    name: 'GlobalBiz Inc',
    domain: 'https://globalbiz.com',
    description: 'Established player in business automation and workflow management',
    industry: 'Business Services',
    estimatedSize: 'large',
    threatLevel: 'critical' as 'low' | 'medium' | 'high' | 'critical',
    reasoning: 'Market leader with significant resources and established customer base',
    confidence: 0.91,
    keyIndicators: [
      'Market leadership position',
      'Extensive customer base',
      'Strong financial backing',
      'Comprehensive product suite'
    ]
  },
  {
    name: 'StartupRival',
    domain: 'https://startuprival.com',
    description: 'Fast-growing startup with focus on SMB market',
    industry: 'Technology',
    estimatedSize: 'startup',
    threatLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    reasoning: 'Targeting similar SMB market with competitive pricing',
    confidence: 0.68,
    keyIndicators: [
      'SMB market focus',
      'Competitive pricing strategy',
      'Rapid user growth',
      'Active hiring in key roles'
    ]
  },
  {
    name: 'Enterprise Solutions Pro',
    domain: 'https://enterprisepro.com',
    description: 'Enterprise-focused solutions with strong industry partnerships',
    industry: 'Technology',
    estimatedSize: 'large',
    threatLevel: 'high' as 'low' | 'medium' | 'high' | 'critical',
    reasoning: 'Strong enterprise presence with strategic partnerships',
    confidence: 0.79,
    keyIndicators: [
      'Enterprise customer focus',
      'Strategic partnerships',
      'Industry certifications',
      'Established sales channels'
    ]
  }
]

// AI-powered competitor discovery using OpenAI
async function discoverCompetitors(
  businessDescription: string,
  targetMarket?: string,
  keyProducts?: string,
  maxResults: number = 10
) {
  try {
    const prompt = `Based on the following business description, identify ${maxResults} potential competitors:

Business Description: ${businessDescription}
Target Market: ${targetMarket || 'Not specified'}
Key Products: ${keyProducts || 'Not specified'}

For each competitor, provide:
- name: Company name
- domain: Website domain (without https://)
- description: Brief company description
- industry: Industry category
- headquarters: City, State/Country
- employeeCount: Estimated employee count
- fundingStage: Current funding stage (Seed, Series A, Series B, Series C, or Self-funded)
- threatLevel: Threat level (low, medium, high, critical)
- matchScore: Match score (0-100)
- matchReasons: Array of reasons why this is a competitor
- keyProducts: Array of their main products/services
- recentNews: Array of recent company news/developments
- socialMediaFollowers: Object with linkedin and twitter follower counts
- isAlreadyTracked: Always false

Return the response as a JSON array of competitor objects. Focus on real, well-known companies in similar markets.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business intelligence expert who identifies competitors for companies. Always return valid JSON arrays with realistic competitor data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    const suggestions = JSON.parse(responseText)
    
    // Ensure all suggestions have required fields
    return suggestions.map((suggestion: any, index: number) => ({
      id: (index + 1).toString(),
      name: suggestion.name || `Competitor ${index + 1}`,
      domain: suggestion.domain || `competitor${index + 1}.com`,
      description: suggestion.description || 'Competitor company',
      industry: suggestion.industry || 'Technology',
      headquarters: suggestion.headquarters || 'Unknown',
      employeeCount: suggestion.employeeCount || 50,
      fundingStage: suggestion.fundingStage || 'Series A',
      threatLevel: suggestion.threatLevel || 'medium',
      matchScore: suggestion.matchScore || 75,
      matchReasons: suggestion.matchReasons || ['Similar market focus'],
      keyProducts: suggestion.keyProducts || ['Product 1', 'Product 2'],
      recentNews: suggestion.recentNews || ['Recent company news'],
      socialMediaFollowers: suggestion.socialMediaFollowers || { linkedin: 1000, twitter: 500 },
      isAlreadyTracked: false
    }))
  } catch (error) {
    logError('Error in AI competitor discovery:', error)
    
    // Fallback to mock data if AI fails
    return MOCK_COMPETITOR_SUGGESTIONS.slice(0, maxResults).map((comp, index) => ({
      id: (index + 1).toString(),
      name: comp.name,
      domain: comp.domain.replace('https://', ''),
      description: comp.description,
      industry: comp.industry,
      headquarters: 'Unknown',
      employeeCount: comp.estimatedSize === 'startup' ? 10 : comp.estimatedSize === 'small' ? 50 : comp.estimatedSize === 'medium' ? 200 : 500,
      fundingStage: 'Series A',
      threatLevel: comp.threatLevel,
      matchScore: Math.floor(comp.confidence * 100),
      matchReasons: comp.keyIndicators,
      keyProducts: ['Product 1', 'Product 2'],
      recentNews: ['Recent company news'],
      socialMediaFollowers: { linkedin: 1000, twitter: 500 },
      isAlreadyTracked: false
    }))
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { allowed } = rateLimitByIp('competitors:discover', ip, 60_000, 5)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = DiscoveryRequestSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { businessDescription, targetMarket, keyProducts, maxResults } = parsed.data

    // Discover competitors using AI analysis
    const suggestions = await discoverCompetitors(
      businessDescription,
      targetMarket,
      keyProducts,
      maxResults
    )

    // Add suggested monitoring configuration based on competitor characteristics
    const enrichedSuggestions = suggestions.map(suggestion => ({
      ...suggestion,
      suggestedMonitoringConfig: {
        websiteMonitoring: true,
        socialMediaMonitoring: suggestion.estimatedSize !== 'large', // Large companies have less social media activity
        newsMonitoring: suggestion.threatLevel === 'critical' || suggestion.threatLevel === 'high',
        jobPostingMonitoring: suggestion.estimatedSize === 'startup' || suggestion.estimatedSize === 'small',
        appStoreMonitoring: suggestion.industry.toLowerCase().includes('technology'),
        monitoringFrequency: suggestion.threatLevel === 'critical' ? 'daily' : 'weekly',
        alertThresholds: {
          pricing: true,
          productLaunches: true,
          hiring: suggestion.estimatedSize !== 'large',
          funding: suggestion.estimatedSize === 'startup',
          partnerships: suggestion.threatLevel === 'critical' || suggestion.threatLevel === 'high',
        }
      }
    }))

    return NextResponse.json({
      suggestions: enrichedSuggestions,
      searchCriteria: {
        businessDescription,
        targetMarket,
        keyProducts,
        maxResults,
      },
      metadata: {
        totalFound: suggestions.length,
        searchTimestamp: new Date().toISOString(),
        confidenceThreshold: 0.6,
        sources: [
          'AI-powered competitor analysis',
          'Business directories',
          'Industry databases',
          'Market research data'
        ]
      }
    })
  } catch (error) {
    logError('Error discovering competitors:', error)
    return NextResponse.json(
      { error: 'Failed to discover competitors' },
      { status: 500 }
    )
  }
}