/**
 * Competitor Intelligence Worker - Handles competitor analysis for SoloSuccess AI
 * Endpoints:
 * - POST /analyze-competitor - Analyze competitor information
 * - POST /market-research - Conduct market research
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  SERP_API_KEY: string
  CRUNCHBASE_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*'
    if (origin.includes('solobossai.fun') || origin.includes('localhost')) {
      return origin
    }
    return null
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-forwarded-for'],
  credentials: true,
}))

// Health check
app.get('/', (c) => {
  return c.json({ 
    service: 'Competitor Intelligence Worker', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/analyze-competitor', '/market-research']
  })
})

// Competitor analysis endpoint
app.post('/analyze-competitor', async (c) => {
  try {
    const { companyName, industry, websiteUrl } = await c.req.json()

    if (!companyName) {
      return c.json({ error: 'Company name is required' }, 400)
    }

    const serpApiKey = c.env.SERP_API_KEY
    const crunchbaseApiKey = c.env.CRUNCHBASE_API_KEY

    if (!serpApiKey) {
      return c.json({ error: 'SERP API key not configured' }, 500)
    }

    const analysis = await analyzeCompetitor(serpApiKey, crunchbaseApiKey, companyName, industry, websiteUrl)

    return c.json({
      success: true,
      competitor: companyName,
      analysis,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Competitor analysis error:', error)
    return c.json({ error: 'Failed to analyze competitor' }, 500)
  }
})

// Market research endpoint
app.post('/market-research', async (c) => {
  try {
    const { keyword, industry, location, competitors } = await c.req.json()

    if (!keyword || !industry) {
      return c.json({ error: 'Keyword and industry are required' }, 400)
    }

    const serpApiKey = c.env.SERP_API_KEY
    if (!serpApiKey) {
      return c.json({ error: 'SERP API key not configured' }, 500)
    }

    const research = await conductMarketResearch(serpApiKey, keyword, industry, location, competitors)

    return c.json({
      success: true,
      keyword,
      industry,
      research,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Market research error:', error)
    return c.json({ error: 'Failed to conduct market research' }, 500)
  }
})

async function analyzeCompetitor(serpApiKey: string, crunchbaseApiKey: string | undefined, companyName: string, industry?: string, websiteUrl?: string) {
  const analysis = {
    companyInfo: {
      name: companyName,
      industry: industry || 'Unknown',
      website: websiteUrl || 'Not provided'
    },
    onlinePresence: await searchOnlinePresence(serpApiKey, companyName),
    socialMedia: await analyzeSocialMedia(serpApiKey, companyName),
    businessInfo: crunchbaseApiKey ? await getCrunchbaseData(crunchbaseApiKey, companyName) : null,
    competitiveInsights: generateCompetitiveInsights(companyName, industry),
    recommendations: generateRecommendations(companyName, industry)
  }

  return analysis
}

async function searchOnlinePresence(apiKey: string, companyName: string) {
  try {
    const searchQuery = `"${companyName}" company business`
    const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(searchQuery)}&api_key=${apiKey}&num=10`)
    
    if (!response.ok) {
      throw new Error('SERP API request failed')
    }

    const data = await response.json()
    
    return {
      totalResults: data.search_information?.total_results || 0,
      topResults: data.organic_results?.slice(0, 5).map((result: any) => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet
      })) || [],
      searchVolume: 'estimated',
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Search presence error:', error)
    return {
      totalResults: 0,
      topResults: [],
      error: 'Failed to analyze online presence'
    }
  }
}

async function analyzeSocialMedia(apiKey: string, companyName: string) {
  try {
    const platforms = ['linkedin', 'twitter', 'facebook', 'instagram']
    const socialAnalysis = {
      platforms: {},
      totalFollowers: 0,
      engagement: 'estimated'
    }

    for (const platform of platforms) {
      const query = `site:${platform}.com "${companyName}"`
      try {
        const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=3`)
        if (response.ok) {
          const data = await response.json()
          socialAnalysis.platforms[platform] = {
            found: data.organic_results?.length > 0,
            results: data.organic_results?.slice(0, 2) || []
          }
        }
      } catch (err) {
        console.error(`Error analyzing ${platform}:`, err)
        socialAnalysis.platforms[platform] = { found: false, error: 'Analysis failed' }
      }
    }

    return socialAnalysis
  } catch (error) {
    console.error('Social media analysis error:', error)
    return {
      platforms: {},
      error: 'Failed to analyze social media presence'
    }
  }
}

async function getCrunchbaseData(apiKey: string, companyName: string) {
  try {
    // Note: This would require proper Crunchbase API implementation
    // For now, return a placeholder structure
    return {
      funded: false,
      totalFunding: null,
      lastFundingRound: null,
      employeeCount: 'Unknown',
      founded: null,
      headquarters: 'Unknown',
      note: 'Crunchbase integration placeholder'
    }
  } catch (error) {
    console.error('Crunchbase API error:', error)
    return null
  }
}

function generateCompetitiveInsights(companyName: string, industry?: string) {
  return {
    strengths: [
      'Market presence analysis needed',
      'Brand recognition assessment required'
    ],
    weaknesses: [
      'Further research required for detailed analysis'
    ],
    opportunities: [
      'Digital marketing improvements',
      'Market expansion potential'
    ],
    threats: [
      'Competitive landscape changes',
      'Market saturation risks'
    ],
    marketPosition: 'Requires detailed analysis',
    differentiators: ['To be determined through deeper analysis'],
    note: 'This is a preliminary analysis. Detailed competitive intelligence requires additional data sources and manual research.'
  }
}

function generateRecommendations(companyName: string, industry?: string) {
  return [
    {
      category: 'Market Research',
      recommendation: 'Conduct detailed market analysis using multiple data sources',
      priority: 'High',
      effort: 'Medium'
    },
    {
      category: 'Digital Presence',
      recommendation: 'Analyze competitor\'s digital marketing strategies',
      priority: 'Medium',
      effort: 'Low'
    },
    {
      category: 'Product Analysis',
      recommendation: 'Compare product offerings and pricing strategies',
      priority: 'High',
      effort: 'High'
    },
    {
      category: 'Social Media',
      recommendation: 'Monitor competitor social media engagement and content strategy',
      priority: 'Medium',
      effort: 'Low'
    }
  ]
}

async function conductMarketResearch(apiKey: string, keyword: string, industry: string, location?: string, competitors?: string[]) {
  try {
    const searchQuery = location 
      ? `${keyword} ${industry} ${location}`
      : `${keyword} ${industry}`

    const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(searchQuery)}&api_key=${apiKey}&num=20`)
    
    if (!response.ok) {
      throw new Error('SERP API request failed')
    }

    const data = await response.json()
    
    return {
      keyword,
      industry,
      location: location || 'Global',
      totalResults: data.search_information?.total_results || 0,
      topCompetitors: extractCompetitors(data.organic_results || []),
      marketTrends: analyzeTrends(data.organic_results || []),
      opportunities: identifyOpportunities(data.organic_results || [], keyword, industry),
      searchVolume: 'estimated',
      competitiveDensity: 'medium',
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Market research error:', error)
    return {
      keyword,
      industry,
      error: 'Failed to conduct market research',
      recommendations: ['Consider manual market research', 'Use alternative data sources']
    }
  }
}

function extractCompetitors(results: any[]) {
  return results.slice(0, 10).map((result, index) => ({
    rank: index + 1,
    company: extractCompanyName(result.title),
    url: result.link,
    title: result.title,
    snippet: result.snippet,
    domain: new URL(result.link).hostname
  }))
}

function extractCompanyName(title: string) {
  // Simple extraction - in production, this would be more sophisticated
  const parts = title.split(' - ')[0].split(' | ')[0]
  return parts.length > 50 ? parts.substring(0, 50) + '...' : parts
}

function analyzeTrends(results: any[]) {
  const domains = results.map(result => {
    try {
      return new URL(result.link).hostname
    } catch {
      return 'unknown'
    }
  })

  const domainCounts = domains.reduce((acc, domain) => {
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {})

  return {
    topDomains: Object.entries(domainCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, appearances: count })),
    marketConcentration: Object.keys(domainCounts).length > 15 ? 'Fragmented' : 'Concentrated',
    analysis: 'Market trend analysis based on search result diversity'
  }
}

function identifyOpportunities(results: any[], keyword: string, industry: string) {
  return [
    {
      type: 'Content Gap',
      description: `Limited content addressing "${keyword}" in ${industry}`,
      confidence: 'medium'
    },
    {
      type: 'SEO Opportunity',
      description: 'Potential for ranking improvement in search results',
      confidence: 'low'
    },
    {
      type: 'Market Entry',
      description: `Consider entering ${industry} market with focus on ${keyword}`,
      confidence: 'low'
    }
  ]
}

export default app