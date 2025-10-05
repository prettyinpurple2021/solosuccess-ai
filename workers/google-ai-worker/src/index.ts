/**
 * Google AI Worker - Handles Google Gemini API calls for SoloSuccess AI
 * Endpoints:
 * - POST /analyze-document - Generate AI insights for documents
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  GOOGLE_AI_API_KEY: string
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
    service: 'Google AI Worker', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/analyze-document']
  })
})

// Document analysis endpoint
app.post('/analyze-document', async (c) => {
  try {
    const { content, fileName, mimeType } = await c.req.json()

    if (!content) {
      return c.json({ error: 'Content is required' }, 400)
    }

    const googleApiKey = c.env.GOOGLE_AI_API_KEY
    if (!googleApiKey) {
      return c.json({ error: 'Google AI API key not configured' }, 500)
    }

    // Limit content size for AI processing (50KB max)
    const maxContentLength = 50000
    const truncatedContent = content.length > maxContentLength 
      ? content.substring(0, maxContentLength) + '...'
      : content

    const insights = await generateDocumentInsights(
      googleApiKey, 
      truncatedContent, 
      fileName || 'document', 
      mimeType || 'text/plain'
    )

    return c.json({
      success: true,
      insights,
      contentLength: content.length,
      processingTime: new Date().toISOString()
    })

  } catch (error) {
    console.error('Document analysis error:', error)
    return c.json({ error: 'Failed to analyze document' }, 500)
  }
})

async function generateDocumentInsights(apiKey: string, content: string, fileName: string, mimeType: string) {
  const prompt = `
Analyze the following document and provide comprehensive insights:

Document: ${fileName}
Type: ${mimeType}
Content:
${content}

Please provide a JSON response with the following structure:
{
  "summary": "A concise 2-3 sentence summary of the document",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "topics": [
    {"name": "Topic name", "confidence": 0.95, "relevance": "high/medium/low"}
  ],
  "entities": [
    {"name": "Entity name", "type": "person/organization/location/etc", "relevance": 0.9}
  ],
  "sentiment": {
    "overall": "positive/negative/neutral",
    "score": 0.8,
    "breakdown": {
      "positive": 60,
      "negative": 20,
      "neutral": 20
    },
    "emotions": {
      "joy": 0.3,
      "sadness": 0.1,
      "anger": 0.05,
      "fear": 0.1,
      "surprise": 0.15
    }
  },
  "categories": [
    {"category": "Business", "confidence": 0.9, "reasoning": "Contains business terminology and concepts"}
  ],
  "suggestedTags": [
    {"name": "tag1", "confidence": 0.95},
    {"name": "tag2", "confidence": 0.85}
  ],
  "readingTime": 5,
  "complexity": "low/medium/high",
  "wordCount": 1500
}

Focus on accuracy and provide realistic confidence scores. For sentiment analysis, consider the overall tone and emotional content.
`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.statusText}`)
    }

    const result = await response.json()
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Try to parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    } else {
      // Fallback if JSON parsing fails
      return {
        summary: text.substring(0, 200) + '...',
        keyPoints: ['AI analysis completed'],
        topics: [{ name: 'General', confidence: 0.5, relevance: 'medium' }],
        entities: [],
        sentiment: {
          overall: 'neutral',
          score: 0.5,
          breakdown: { positive: 33, negative: 33, neutral: 34 },
          emotions: { joy: 0.2, sadness: 0.2, anger: 0.1, fear: 0.1, surprise: 0.1 }
        },
        categories: [{ category: 'General', confidence: 0.5, reasoning: 'AI analysis' }],
        suggestedTags: [{ name: 'ai-analyzed', confidence: 1.0 }],
        readingTime: Math.ceil(content.split(' ').length / 200), // Rough estimate
        complexity: 'medium',
        wordCount: content.split(' ').length
      }
    }
  } catch (error) {
    console.error('Google AI API error:', error)
    throw error
  }
}

export default app