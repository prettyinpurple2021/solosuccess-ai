/**
 * Intelligence Worker - Handles Anthropic AI calls and document processing for SoloSuccess AI
 * Endpoints:
 * - POST /analyze-text - Analyze text using Claude
 * - POST /process-document - Process and analyze documents with AI
 * - POST /extract-insights - Extract business insights from content
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  ANTHROPIC_API_KEY: string
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
    service: 'Intelligence Worker', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/analyze-text', '/process-document', '/extract-insights']
  })
})

// Text analysis endpoint
app.post('/analyze-text', async (c) => {
  try {
    const { text, analysisType, context } = await c.req.json()

    if (!text) {
      return c.json({ error: 'Text is required for analysis' }, 400)
    }

    const anthropicApiKey = c.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return c.json({ error: 'Anthropic API key not configured' }, 500)
    }

    const analysis = await analyzeTextWithClaude(
      anthropicApiKey, 
      text, 
      analysisType || 'general',
      context
    )

    return c.json({
      success: true,
      analysis,
      analysisType: analysisType || 'general',
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Text analysis error:', error)
    return c.json({ error: 'Failed to analyze text' }, 500)
  }
})

// Document processing endpoint
app.post('/process-document', async (c) => {
  try {
    const { content, fileName, mimeType, processingType } = await c.req.json()

    if (!content) {
      return c.json({ error: 'Document content is required' }, 400)
    }

    const anthropicApiKey = c.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return c.json({ error: 'Anthropic API key not configured' }, 500)
    }

    // Limit content size for processing
    const maxContentLength = 100000 // 100KB
    const processedContent = content.length > maxContentLength 
      ? content.substring(0, maxContentLength) + '\n\n[Content truncated for processing]'
      : content

    const processing = await processDocumentWithClaude(
      anthropicApiKey,
      processedContent,
      fileName || 'document',
      mimeType || 'text/plain',
      processingType || 'summary'
    )

    return c.json({
      success: true,
      document: {
        fileName: fileName || 'document',
        mimeType: mimeType || 'text/plain',
        originalLength: content.length,
        processedLength: processedContent.length,
        truncated: content.length > maxContentLength
      },
      processing,
      processedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Document processing error:', error)
    return c.json({ error: 'Failed to process document' }, 500)
  }
})

// Business insights extraction endpoint
app.post('/extract-insights', async (c) => {
  try {
    const { content, businessContext, insightTypes } = await c.req.json()

    if (!content) {
      return c.json({ error: 'Content is required for insight extraction' }, 400)
    }

    const anthropicApiKey = c.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      return c.json({ error: 'Anthropic API key not configured' }, 500)
    }

    const insights = await extractBusinessInsights(
      anthropicApiKey,
      content,
      businessContext || 'general business',
      insightTypes || ['opportunities', 'risks', 'trends']
    )

    return c.json({
      success: true,
      businessContext: businessContext || 'general business',
      insights,
      extractedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Insight extraction error:', error)
    return c.json({ error: 'Failed to extract business insights' }, 500)
  }
})

async function analyzeTextWithClaude(apiKey: string, text: string, analysisType: string, context?: string) {
  const systemPrompt = getAnalysisPrompt(analysisType, context)
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nText to analyze:\n${text}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Anthropic API error: ${response.statusText} - ${errorData}`)
    }

    const result = await response.json()
    const analysisText = result.content[0].text

    return {
      type: analysisType,
      result: analysisText,
      confidence: 'high',
      model: 'claude-3-sonnet',
      wordCount: text.split(/\s+/).length,
      processingTime: 'real-time'
    }

  } catch (error) {
    console.error('Claude analysis error:', error)
    throw error
  }
}

async function processDocumentWithClaude(apiKey: string, content: string, fileName: string, mimeType: string, processingType: string) {
  const processingPrompt = getProcessingPrompt(processingType, mimeType)
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: `${processingPrompt}\n\nDocument: ${fileName}\nType: ${mimeType}\n\nContent:\n${content}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Anthropic API error: ${response.statusText} - ${errorData}`)
    }

    const result = await response.json()
    const processedResult = result.content[0].text

    // Try to parse structured output
    let structuredResult
    try {
      structuredResult = JSON.parse(processedResult)
    } catch {
      structuredResult = {
        summary: processedResult,
        structured: false,
        rawOutput: true
      }
    }

    return {
      processingType,
      fileName,
      result: structuredResult,
      model: 'claude-3-sonnet',
      confidence: 'high'
    }

  } catch (error) {
    console.error('Document processing error:', error)
    throw error
  }
}

async function extractBusinessInsights(apiKey: string, content: string, businessContext: string, insightTypes: string[]) {
  const insightPrompt = getInsightExtractionPrompt(businessContext, insightTypes)
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: `${insightPrompt}\n\nBusiness Context: ${businessContext}\n\nContent to analyze:\n${content}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Anthropic API error: ${response.statusText} - ${errorData}`)
    }

    const result = await response.json()
    const insightText = result.content[0].text

    // Try to parse JSON insights
    let parsedInsights
    try {
      const jsonMatch = insightText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedInsights = JSON.parse(jsonMatch[0])
      } else {
        parsedInsights = {
          summary: insightText,
          insights: [],
          structured: false
        }
      }
    } catch {
      parsedInsights = {
        summary: insightText,
        insights: [],
        structured: false,
        raw: true
      }
    }

    return {
      businessContext,
      requestedTypes: insightTypes,
      insights: parsedInsights,
      model: 'claude-3-sonnet',
      confidence: 'high'
    }

  } catch (error) {
    console.error('Business insight extraction error:', error)
    throw error
  }
}

function getAnalysisPrompt(analysisType: string, context?: string) {
  const basePrompt = context 
    ? `You are an AI analyst with expertise in ${context}. `
    : 'You are an AI analyst. '

  switch (analysisType) {
    case 'sentiment':
      return `${basePrompt}Analyze the sentiment of the following text. Provide a detailed sentiment analysis including overall sentiment (positive/negative/neutral), emotional tone, and key sentiment indicators.`
    
    case 'summary':
      return `${basePrompt}Provide a concise but comprehensive summary of the following text. Include key points, main themes, and important details.`
    
    case 'keywords':
      return `${basePrompt}Extract and rank the most important keywords and key phrases from the following text. Provide relevance scores and explain their significance.`
    
    case 'classification':
      return `${basePrompt}Classify and categorize the following text. Identify the main topics, themes, and subject areas. Provide confidence scores for your classifications.`
    
    case 'intent':
      return `${basePrompt}Analyze the intent and purpose behind the following text. Identify what the author is trying to achieve, communicate, or persuade.`
    
    default:
      return `${basePrompt}Provide a comprehensive analysis of the following text. Include insights about content, structure, tone, key themes, and any notable characteristics.`
  }
}

function getProcessingPrompt(processingType: string, mimeType: string) {
  const basePrompt = `You are an expert document processor. Process the following ${mimeType} document and provide detailed analysis. `

  switch (processingType) {
    case 'summary':
      return `${basePrompt}Create a comprehensive summary including: main points, key findings, important data, conclusions, and actionable insights. Format as JSON with structured fields.`
    
    case 'extraction':
      return `${basePrompt}Extract and structure all important information including: entities (people, organizations, locations), dates, numbers, key concepts, and relationships. Format as JSON.`
    
    case 'analysis':
      return `${basePrompt}Provide deep analytical insights including: document purpose, target audience, writing style, strengths/weaknesses, implications, and recommendations. Format as JSON.`
    
    case 'questions':
      return `${basePrompt}Generate thoughtful questions that this document raises, answers, or leaves unanswered. Include follow-up research suggestions. Format as JSON.`
    
    default:
      return `${basePrompt}Process this document comprehensively, providing summary, key insights, extracted information, and analysis. Format as structured JSON.`
  }
}

function getInsightExtractionPrompt(businessContext: string, insightTypes: string[]) {
  const typesList = insightTypes.join(', ')
  
  return `You are a business intelligence analyst specializing in ${businessContext}. 

Extract business insights from the following content focusing on: ${typesList}.

Please provide your analysis as a JSON object with the following structure:
{
  "opportunities": [
    {
      "title": "Opportunity title",
      "description": "Detailed description",
      "impact": "high/medium/low",
      "effort": "high/medium/low",
      "timeframe": "short/medium/long-term",
      "confidence": 0.8
    }
  ],
  "risks": [
    {
      "title": "Risk title",
      "description": "Detailed description",
      "severity": "high/medium/low",
      "probability": "high/medium/low",
      "mitigation": "Suggested mitigation strategy",
      "confidence": 0.7
    }
  ],
  "trends": [
    {
      "title": "Trend title",
      "description": "Detailed description",
      "direction": "increasing/decreasing/stable",
      "impact": "high/medium/low",
      "timeframe": "short/medium/long-term",
      "confidence": 0.9
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed recommendation",
      "priority": "high/medium/low",
      "category": "strategic/operational/tactical",
      "expectedOutcome": "Expected result"
    }
  ],
  "keyInsights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "summary": "Overall summary of business insights"
}

Focus on actionable, specific insights relevant to ${businessContext}.`
}

export default app