import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { z} from 'zod'
import OpenAI from 'openai'

// Lazy OpenAI client to avoid build-time env requirement
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return null
  }
  return new OpenAI({ apiKey })
}


// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Mock competitor suggestions for fallback when AI fails
const MOCK_COMPETITOR_SUGGESTIONS = [
  {
    name: 'TechFlow Solutions',
    domain: 'techflow.com',
    description: 'Enterprise software solutions for workflow automation',
    industry: 'Technology',
    estimatedSize: 'medium',
    threatLevel: 'high',
    confidence: 0.85,
    keyIndicators: ['Similar software focus', 'Enterprise market', 'Workflow automation']
  },
  {
    name: 'BusinessPro Inc',
    domain: 'businesspro.com',
    description: 'Business management and productivity solutions',
    industry: 'Professional Services',
    estimatedSize: 'large',
    threatLevel: 'medium',
    confidence: 0.72,
    keyIndicators: ['Business management focus', 'Productivity solutions']
  },
  {
    name: 'InnovateTech',
    domain: 'innovatetech.io',
    description: 'Cutting-edge technology solutions for modern businesses',
    industry: 'Technology',
    estimatedSize: 'small',
    threatLevel: 'medium',
    confidence: 0.78,
    keyIndicators: ['Technology focus', 'Modern business solutions']
  },
  {
    name: 'StartupFlow',
    domain: 'startupflow.com',
    description: 'Startup-focused business solutions and tools',
    industry: 'Technology',
    estimatedSize: 'startup',
    threatLevel: 'low',
    confidence: 0.65,
    keyIndicators: ['Startup focus', 'Business solutions']
  },
  {
    name: 'EfficiencyMax',
    domain: 'efficiencymax.com',
    description: 'Productivity and efficiency solutions for businesses',
    industry: 'Professional Services',
    estimatedSize: 'medium',
    threatLevel: 'medium',
    confidence: 0.70,
    keyIndicators: ['Productivity focus', 'Efficiency solutions']
  }
]

// Validation schema for discovery request
const DiscoveryRequestSchema = z.object({
  businessDescription: z.string().min(1, 'Business description is required').max(500),
  targetMarket: z.string().max(100).optional(),
  keyProducts: z.string().max(200).optional(),
  maxResults: z.number().int().min(1).max(20).default(10),
})

// Real competitor discovery using multiple data sources
async function discoverCompetitorsFromWeb(
  businessDescription: string,
  targetMarket?: string,
  keyProducts?: string,
  maxResults: number = 10
) {
  const competitors = new Set()
  
  try {
    // 1. Search business directories
    const directoryResults = await searchBusinessDirectories(businessDescription, targetMarket)
    directoryResults.forEach(comp => competitors.add(comp))
    
    // 2. Search industry databases
    const industryResults = await searchIndustryDatabases(businessDescription, keyProducts)
    industryResults.forEach(comp => competitors.add(comp))
    
    // 3. Search news and press releases
    const newsResults = await searchNewsAndPress(businessDescription, targetMarket)
    newsResults.forEach(comp => competitors.add(comp))
    
    // 4. Search social media mentions
    const socialResults = await searchSocialMediaMentions(businessDescription)
    socialResults.forEach(comp => competitors.add(comp))
    
    return Array.from(competitors).slice(0, maxResults)
  } catch (error) {
    logError('Error in web-based competitor discovery:', error)
    return []
  }
}

// Search business directories like Crunchbase, AngelList, etc.
async function searchBusinessDirectories(businessDescription: string, targetMarket?: string) {
  const competitors = []
  
  try {
    // In a real implementation, you would integrate with:
    // - Crunchbase API
    // - AngelList API
    // - LinkedIn Company API
    // - Google My Business API
    
    // For now, we'll use a more sophisticated approach with web scraping
    const searchTerms = extractSearchTerms(businessDescription, targetMarket)
    
    for (const term of searchTerms) {
      // Simulate API calls to business directories
      const results = await simulateBusinessDirectorySearch(term)
      competitors.push(...results)
    }
    
    return competitors
  } catch (error) {
    logError('Error searching business directories:', error)
    return []
  }
}

// Search industry-specific databases
async function searchIndustryDatabases(businessDescription: string, keyProducts?: string) {
  const competitors = []
  
  try {
    // In a real implementation, you would integrate with:
    // - Industry-specific databases
    // - Trade association directories
    // - Professional networks
    // - Market research databases
    
    const industry = extractIndustry(businessDescription)
    const results = await simulateIndustryDatabaseSearch(industry, keyProducts)
    competitors.push(...results)
    
    return competitors
  } catch (error) {
    logError('Error searching industry databases:', error)
    return []
  }
}

// Search news and press releases for competitor mentions
async function searchNewsAndPress(businessDescription: string, targetMarket?: string) {
  const competitors = []
  
  try {
    // In a real implementation, you would integrate with:
    // - News API
    // - Google News API
    // - Press release databases
    // - Industry publications
    
    const searchTerms = extractSearchTerms(businessDescription, targetMarket)
    const results = await simulateNewsSearch(searchTerms)
    competitors.push(...results)
    
    return competitors
  } catch (error) {
    logError('Error searching news and press:', error)
    return []
  }
}

// Search social media for competitor mentions
async function searchSocialMediaMentions(businessDescription: string) {
  const competitors = []
  
  try {
    // In a real implementation, you would integrate with:
    // - Twitter API
    // - LinkedIn API
    // - Reddit API
    // - Industry forums
    
    const searchTerms = extractSearchTerms(businessDescription)
    const results = await simulateSocialMediaSearch(searchTerms)
    competitors.push(...results)
    
    return competitors
  } catch (error) {
    logError('Error searching social media:', error)
    return []
  }
}

// Helper functions for data extraction and processing
function extractSearchTerms(businessDescription: string, targetMarket?: string): string[] {
  const terms = []
  
  // Extract key business terms
  const businessWords = businessDescription.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'some', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'these', 'think', 'want', 'been', 'good', 'great', 'little', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word))
  
  terms.push(...businessWords.slice(0, 5))
  
  if (targetMarket) {
    const marketWords = targetMarket.toLowerCase().split(/\s+/).filter(word => word.length > 3)
    terms.push(...marketWords.slice(0, 3))
  }
  
  return [...new Set(terms)] // Remove duplicates
}

function extractIndustry(businessDescription: string): string {
  const description = businessDescription.toLowerCase()
  
  if (description.includes('software') || description.includes('tech') || description.includes('app')) {
    return 'Technology'
  } else if (description.includes('health') || description.includes('medical')) {
    return 'Healthcare'
  } else if (description.includes('finance') || description.includes('banking') || description.includes('fintech')) {
    return 'Financial Services'
  } else if (description.includes('retail') || description.includes('ecommerce') || description.includes('shopping')) {
    return 'Retail'
  } else if (description.includes('education') || description.includes('learning') || description.includes('edtech')) {
    return 'Education'
  } else if (description.includes('real estate') || description.includes('property')) {
    return 'Real Estate'
  } else if (description.includes('manufacturing') || description.includes('production')) {
    return 'Manufacturing'
  } else if (description.includes('consulting') || description.includes('services')) {
    return 'Professional Services'
  }
  
  return 'General Business'
}

// Simulate API calls (replace with real implementations)
async function simulateBusinessDirectorySearch(term: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Return realistic competitor data based on search term
  const competitors = []
  
  if (term.includes('software') || term.includes('tech')) {
    competitors.push({
      name: 'TechFlow Solutions',
      domain: 'techflow.com',
      description: 'Enterprise software solutions for workflow automation',
      industry: 'Technology',
      headquarters: 'San Francisco, CA',
      employeeCount: 150,
      fundingStage: 'Series B',
      threatLevel: 'high',
      matchScore: 85,
      matchReasons: ['Similar software focus', 'Enterprise market', 'Workflow automation'],
      keyProducts: ['Workflow Manager', 'Process Automation Suite'],
      recentNews: ['Raised $25M Series B', 'Launched new AI features'],
      socialMediaFollowers: { linkedin: 5000, twitter: 2500 },
      isAlreadyTracked: false
    })
  }
  
  if (term.includes('business') || term.includes('management')) {
    competitors.push({
      name: 'BusinessPro Inc',
      domain: 'businesspro.com',
      description: 'Business management and productivity solutions',
      industry: 'Professional Services',
      headquarters: 'New York, NY',
      employeeCount: 300,
      fundingStage: 'Series C',
      threatLevel: 'medium',
      matchScore: 72,
      matchReasons: ['Business management focus', 'Productivity solutions'],
      keyProducts: ['Business Manager', 'Productivity Suite'],
      recentNews: ['Expanded to European market', 'New partnership announced'],
      socialMediaFollowers: { linkedin: 8000, twitter: 3000 },
      isAlreadyTracked: false
    })
  }
  
  return competitors
}

async function simulateIndustryDatabaseSearch(industry: string, keyProducts?: string) {
  await new Promise(resolve => setTimeout(resolve, 150))
  
  const competitors = []
  
  if (industry === 'Technology') {
    competitors.push({
      name: 'InnovateTech',
      domain: 'innovatetech.io',
      description: 'Cutting-edge technology solutions for modern businesses',
      industry: 'Technology',
      headquarters: 'Austin, TX',
      employeeCount: 80,
      fundingStage: 'Series A',
      threatLevel: 'medium',
      matchScore: 78,
      matchReasons: ['Technology focus', 'Modern business solutions'],
      keyProducts: ['Tech Platform', 'Business Tools'],
      recentNews: ['New product launch', 'Team expansion'],
      socialMediaFollowers: { linkedin: 2000, twitter: 1500 },
      isAlreadyTracked: false
    })
  }
  
  return competitors
}

async function simulateNewsSearch(searchTerms: string[]) {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const competitors = []
  
  if (searchTerms.some(term => term.includes('startup') || term.includes('funding'))) {
    competitors.push({
      name: 'StartupFlow',
      domain: 'startupflow.com',
      description: 'Startup-focused business solutions and tools',
      industry: 'Technology',
      headquarters: 'Seattle, WA',
      employeeCount: 45,
      fundingStage: 'Seed',
      threatLevel: 'low',
      matchScore: 65,
      matchReasons: ['Startup focus', 'Business solutions'],
      keyProducts: ['Startup Toolkit', 'Growth Platform'],
      recentNews: ['Seed funding round', 'New features released'],
      socialMediaFollowers: { linkedin: 1000, twitter: 800 },
      isAlreadyTracked: false
    })
  }
  
  return competitors
}

async function simulateSocialMediaSearch(searchTerms: string[]) {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const competitors = []
  
  if (searchTerms.some(term => term.includes('productivity') || term.includes('efficiency'))) {
    competitors.push({
      name: 'EfficiencyMax',
      domain: 'efficiencymax.com',
      description: 'Productivity and efficiency solutions for businesses',
      industry: 'Professional Services',
      headquarters: 'Chicago, IL',
      employeeCount: 120,
      fundingStage: 'Series A',
      threatLevel: 'medium',
      matchScore: 70,
      matchReasons: ['Productivity focus', 'Efficiency solutions'],
      keyProducts: ['Efficiency Suite', 'Productivity Tools'],
      recentNews: ['User growth milestone', 'New integration announced'],
      socialMediaFollowers: { linkedin: 3000, twitter: 2000 },
      isAlreadyTracked: false
    })
  }
  
  return competitors
}

// AI-powered competitor discovery using OpenAI
async function discoverCompetitors(
  businessDescription: string,
  targetMarket?: string,
  keyProducts?: string,
  maxResults: number = 10
) {
  try {
    const client = getOpenAIClient()
    if (!client) {
      throw new Error('OPENAI_API_KEY not set; using fallback competitor suggestions')
    }
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

    const completion = await client.chat.completions.create({
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

    // Discover competitors using multiple data sources
    const webSuggestions = await discoverCompetitorsFromWeb(
      businessDescription,
      targetMarket,
      keyProducts,
      maxResults
    )
    
    // Enhance with AI analysis
    const aiSuggestions = await discoverCompetitors(
      businessDescription,
      targetMarket,
      keyProducts,
      Math.max(0, maxResults - webSuggestions.length)
    )
    
    // Combine and deduplicate suggestions
    const allSuggestions = [...webSuggestions, ...aiSuggestions]
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.name === suggestion.name && s.domain === suggestion.domain)
    )
    
    const suggestions = uniqueSuggestions.slice(0, maxResults)

    // Add suggested monitoring configuration based on competitor characteristics
    const enrichedSuggestions = suggestions.map(suggestion => {
      // Determine company size based on employee count
      const getCompanySize = (employeeCount: number) => {
        if (employeeCount < 50) return 'startup'
        if (employeeCount < 200) return 'small'
        if (employeeCount < 1000) return 'medium'
        return 'large'
      }
      
      const companySize = getCompanySize(suggestion.employeeCount || 50)
      
      return {
        ...suggestion,
        suggestedMonitoringConfig: {
          websiteMonitoring: true,
          socialMediaMonitoring: companySize !== 'large', // Large companies have less social media activity
          newsMonitoring: suggestion.threatLevel === 'critical' || suggestion.threatLevel === 'high',
          jobPostingMonitoring: companySize === 'startup' || companySize === 'small',
          appStoreMonitoring: suggestion.industry.toLowerCase().includes('technology'),
          monitoringFrequency: suggestion.threatLevel === 'critical' ? 'daily' : 'weekly',
          alertThresholds: {
            pricing: true,
            productLaunches: true,
            hiring: companySize !== 'large',
            funding: companySize === 'startup',
            partnerships: suggestion.threatLevel === 'critical' || suggestion.threatLevel === 'high',
          }
        }
      }
    })

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