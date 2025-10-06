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
  SERPER_API_KEY: string
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

    const serperApiKey = c.env.SERPER_API_KEY

    if (!serperApiKey) {
      return c.json({ error: 'Serper API key not configured' }, 500)
    }

    const analysis = await analyzeCompetitor(serperApiKey, companyName, industry, websiteUrl)

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

    const serperApiKey = c.env.SERPER_API_KEY
    if (!serperApiKey) {
      return c.json({ error: 'Serper API key not configured' }, 500)
    }

    const research = await conductMarketResearch(serperApiKey, keyword, industry, location, competitors)

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

async function analyzeCompetitor(serperApiKey: string, companyName: string, industry?: string, websiteUrl?: string) {
  console.log(`Starting competitor analysis for: ${companyName}`)
  
  // Step 1: Get foundational data from Wikidata
  const wikidataInfo = await getWikidataCompanyInfo(companyName)
  
  // Step 2: Use website domain for live web analysis
  const targetDomain = websiteUrl || wikidataInfo?.website || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`
  
  // Step 3: Get live web presence using Serper
  const webPresence = await getSerperWebData(serperApiKey, companyName, targetDomain)
  
  const analysis = {
    companyInfo: {
      name: companyName,
      industry: industry || wikidataInfo?.industry || 'Unknown',
      website: targetDomain,
      foundedYear: wikidataInfo?.founded,
      founders: wikidataInfo?.founders,
      description: wikidataInfo?.description,
      headquarters: wikidataInfo?.headquarters,
      dataSource: 'Wikidata + Live Web Data'
    },
    onlinePresence: webPresence.searchResults,
    socialMedia: webPresence.socialMedia,
    seoAnalysis: webPresence.seoData,
    competitiveInsights: generateCompetitiveInsights(companyName, industry, wikidataInfo, webPresence),
    recommendations: generateRecommendations(companyName, industry, webPresence)
  }

  return analysis
}

// Wikidata SPARQL query to get company foundational data
async function getWikidataCompanyInfo(companyName: string) {
  try {
    const sparqlQuery = `
      SELECT DISTINCT ?company ?companyLabel ?website ?industryLabel ?foundedYear ?headquartersLabel ?descriptionLabel ?founderLabel WHERE {
        ?company ?label "${companyName}"@en .
        ?company wdt:P31/wdt:P279* wd:Q4830453 .
        OPTIONAL { ?company wdt:P856 ?website . }
        OPTIONAL { ?company wdt:P452 ?industry . }
        OPTIONAL { ?company wdt:P571 ?founded . BIND(YEAR(?founded) AS ?foundedYear) }
        OPTIONAL { ?company wdt:P159 ?headquarters . }
        OPTIONAL { ?company schema:description ?descriptionLabel . FILTER(LANG(?descriptionLabel) = "en") }
        OPTIONAL { ?company wdt:P112 ?founder . }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }
      LIMIT 5
    `

    const response = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/json',
        'User-Agent': 'SoloSuccess-AI-CompetitorWorker/1.0'
      },
      body: sparqlQuery
    })

    if (!response.ok) {
      throw new Error(`Wikidata API error: ${response.statusText}`)
    }

    const data = await response.json()
    const bindings = data.results?.bindings || []

    if (bindings.length === 0) {
      console.log(`No Wikidata results found for: ${companyName}`)
      return null
    }

    const result = bindings[0]
    const founders = bindings
      .filter(binding => binding.founderLabel?.value)
      .map(binding => binding.founderLabel.value)
      .filter((founder, index, arr) => arr.indexOf(founder) === index) // Remove duplicates

    return {
      website: result.website?.value,
      industry: result.industryLabel?.value,
      founded: result.foundedYear?.value,
      headquarters: result.headquartersLabel?.value,
      description: result.descriptionLabel?.value,
      founders: founders.length > 0 ? founders : null,
      source: 'Wikidata'
    }
  } catch (error) {
    console.error('Wikidata query error:', error)
    return null
  }
}

// Get comprehensive web data using Serper API
async function getSerperWebData(apiKey: string, companyName: string, domain: string) {
  try {
    const searchPromises = [
      // Main search for company
      serperSearch(apiKey, `"${companyName}" company`, 10),
      // Domain-specific search
      serperSearch(apiKey, `site:${domain}`, 5),
      // Social media search
      serperSearch(apiKey, `"${companyName}" site:linkedin.com OR site:twitter.com OR site:facebook.com`, 5)
    ]

    const [mainResults, domainResults, socialResults] = await Promise.allSettled(searchPromises)

    return {
      searchResults: {
        mainSearch: mainResults.status === 'fulfilled' ? mainResults.value : { results: [], error: 'Failed to fetch main search results' },
        domainSearch: domainResults.status === 'fulfilled' ? domainResults.value : { results: [], error: 'Failed to fetch domain results' },
        totalResults: mainResults.status === 'fulfilled' ? mainResults.value.searchInformation?.totalResults || 0 : 0
      },
      socialMedia: {
        results: socialResults.status === 'fulfilled' ? socialResults.value.results : [],
        platforms: extractSocialPlatforms(socialResults.status === 'fulfilled' ? socialResults.value.results : [])
      },
      seoData: {
        domainAuthority: 'estimated',
        backlinks: 'requires additional analysis',
        rankings: domainResults.status === 'fulfilled' ? domainResults.value.results?.length || 0 : 0,
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Serper web data error:', error)
    return {
      searchResults: { mainSearch: { results: [] }, domainSearch: { results: [] }, totalResults: 0 },
      socialMedia: { results: [], platforms: {} },
      seoData: { error: 'Failed to fetch SEO data' }
    }
  }
}

// Helper function for Serper API calls
async function serperSearch(apiKey: string, query: string, num: number = 10) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      num: num,
      location: 'United States'
    })
  })

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.statusText}`)
  }

  return await response.json()
}

// Extract social media platforms from search results
function extractSocialPlatforms(results: any[]) {
  const platforms = {
    linkedin: false,
    twitter: false,
    facebook: false,
    instagram: false
  }

  results.forEach(result => {
    const url = result.link || ''
    if (url.includes('linkedin.com')) platforms.linkedin = true
    if (url.includes('twitter.com') || url.includes('x.com')) platforms.twitter = true
    if (url.includes('facebook.com')) platforms.facebook = true
    if (url.includes('instagram.com')) platforms.instagram = true
  })

  return platforms
}

// Legacy function - keeping for backward compatibility but updated to use Serper
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

function generateCompetitiveInsights(companyName: string, industry?: string, wikidataInfo?: any, webPresence?: any) {
  const hasStrongOnlinePresence = webPresence?.searchResults?.totalResults > 100000
  const hasSocialMedia = Object.values(webPresence?.socialMedia?.platforms || {}).some(Boolean)
  const hasWikidataInfo = !!wikidataInfo
  
  const strengths = []
  const weaknesses = []
  const opportunities = []
  const threats = []

  // Analyze based on available data
  if (hasWikidataInfo) {
    strengths.push('Well-established company with documented history')
    if (wikidataInfo.founders) strengths.push('Known founders and leadership')
  } else {
    weaknesses.push('Limited public information available')
  }

  if (hasStrongOnlinePresence) {
    strengths.push('Strong digital footprint and online visibility')
  } else {
    opportunities.push('Opportunity to improve online presence and SEO')
  }

  if (hasSocialMedia) {
    strengths.push('Active social media presence across platforms')
  } else {
    opportunities.push('Untapped social media marketing potential')
  }

  // Industry-specific insights
  if (industry) {
    opportunities.push(`Industry-specific expansion opportunities in ${industry}`)
    threats.push(`Competitive pressure from other ${industry} companies`)
  }

  // General competitive factors
  threats.push('Digital transformation requirements', 'Market saturation risks')
  opportunities.push('Digital marketing optimization', 'Content marketing potential')

  return {
    strengths: strengths.length > 0 ? strengths : ['Analysis requires more detailed research'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['No significant weaknesses identified'],
    opportunities,
    threats,
    marketPosition: hasStrongOnlinePresence ? 'Strong online presence' : 'Room for digital improvement',
    differentiators: wikidataInfo?.description ? [wikidataInfo.description] : ['Requires competitive analysis'],
    dataQuality: {
      wikidataAvailable: hasWikidataInfo,
      webPresenceStrong: hasStrongOnlinePresence,
      socialMediaActive: hasSocialMedia
    },
    note: 'Analysis based on Wikidata and live web data. More comprehensive insights available with additional research.'
  }
}

function generateRecommendations(companyName: string, industry?: string, webPresence?: any) {
  const recommendations = []
  
  // Data-driven recommendations based on analysis
  if (webPresence?.searchResults?.totalResults < 50000) {
    recommendations.push({
      category: 'SEO Opportunity',
      recommendation: `${companyName} has limited online visibility - opportunity to outrank them with strong SEO`,
      priority: 'High',
      effort: 'Medium',
      reasoning: 'Low search result count indicates weak digital presence'
    })
  }

  if (!Object.values(webPresence?.socialMedia?.platforms || {}).some(Boolean)) {
    recommendations.push({
      category: 'Social Media Gap',
      recommendation: `${companyName} appears to have limited social media presence - opportunity for differentiation`,
      priority: 'Medium',
      effort: 'Low',
      reasoning: 'No strong social media presence detected'
    })
  }

  // Standard competitive analysis recommendations
  recommendations.push(
    {
      category: 'Content Strategy',
      recommendation: 'Analyze their content themes and identify gaps you can fill',
      priority: 'High',
      effort: 'Medium',
      reasoning: 'Content analysis reveals positioning opportunities'
    },
    {
      category: 'Market Positioning',
      recommendation: 'Study their messaging and find unique positioning angles',
      priority: 'High',
      effort: 'Medium',
      reasoning: 'Differentiation through unique value propositions'
    },
    {
      category: 'Technical Analysis',
      recommendation: 'Monitor their website performance and user experience',
      priority: 'Medium',
      effort: 'Low',
      reasoning: 'Technical advantages can provide competitive edge'
    }
  )

  if (industry) {
    recommendations.push({
      category: 'Industry Intelligence',
      recommendation: `Monitor ${industry} trends and see how ${companyName} responds`,
      priority: 'Medium',
      effort: 'Low',
      reasoning: 'Industry trend analysis reveals strategic opportunities'
    })
  }

  return recommendations
}

async function conductMarketResearch(apiKey: string, keyword: string, industry: string, location?: string, competitors?: string[]) {
  try {
    const searchQuery = location 
      ? `${keyword} ${industry} ${location}`
      : `${keyword} ${industry}`

    // Use Serper for market research
    const marketData = await serperSearch(apiKey, searchQuery, 20)
    
    // Additional searches for comprehensive analysis
    const competitorSearches = competitors ? await Promise.allSettled(
      competitors.map(comp => serperSearch(apiKey, `"${comp}" ${industry}`, 5))
    ) : []

    const competitorResults = competitorSearches
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)
    
    return {
      keyword,
      industry,
      location: location || 'Global',
      totalResults: marketData.searchInformation?.totalResults || 0,
      topCompetitors: extractCompetitors(marketData.organic || []),
      marketTrends: analyzeTrends(marketData.organic || []),
      opportunities: identifyOpportunities(marketData.organic || [], keyword, industry),
      competitorAnalysis: competitors ? {
        companiesAnalyzed: competitors,
        results: competitorResults.map((result, index) => ({
          company: competitors[index],
          searchResults: result.organic?.length || 0,
          topResult: result.organic?.[0] || null
        }))
      } : null,
      searchVolume: marketData.searchParameters?.num || 'estimated',
      competitiveDensity: calculateCompetitiveDensity(marketData.organic || []),
      relatedSearches: marketData.relatedSearches || [],
      lastUpdated: new Date().toISOString(),
      dataSource: 'Serper API'
    }
  } catch (error) {
    console.error('Market research error:', error)
    return {
      keyword,
      industry,
      error: 'Failed to conduct market research',
      recommendations: ['Consider manual market research', 'Use alternative data sources'],
      lastUpdated: new Date().toISOString()
    }
  }
}

// Calculate competitive density based on search results
function calculateCompetitiveDensity(results: any[]) {
  const uniqueDomains = new Set(results.map(result => {
    try {
      return new URL(result.link).hostname
    } catch {
      return 'unknown'
    }
  }))
  
  const density = uniqueDomains.size / results.length
  if (density > 0.8) return 'high'
  if (density > 0.5) return 'medium'
  return 'low'
}

function extractCompetitors(results: any[]) {
  return results.slice(0, 10).map((result, index) => {
    let domain = 'unknown'
    try {
      domain = new URL(result.link).hostname
    } catch {
      // Keep default 'unknown' if URL parsing fails
    }
    
    return {
      rank: index + 1,
      company: extractCompanyName(result.title),
      url: result.link,
      title: result.title,
      snippet: result.snippet,
      domain: domain
    }
  })
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