/**
 * OpenAI Worker - Handles OpenAI API calls for SoloSuccess AI
 * Endpoints:
 * - POST /chat - Stream chat responses using OpenAI GPT-4o
 * - POST /generate-logo - Generate logos using DALL-E
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

type Bindings = {
  OPENAI_API_KEY: string
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
    service: 'OpenAI Worker', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/chat', '/generate-logo']
  })
})

// Chat endpoint
app.post('/chat', async (c) => {
  try {
    const { message, agentId, systemPrompt, user } = await c.req.json()

    if (!message || !user) {
      return c.json({ error: 'Missing required fields: message, user' }, 400)
    }

    const openaiApiKey = c.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500)
    }

    // Make request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are a helpful AI assistant for SoloSuccess AI platform.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        stream: true
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      return c.json({ error: 'OpenAI API request failed' }, 500)
    }

    // Return the streaming response
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })

  } catch (error) {
    console.error('Chat error:', error)
    return c.json({ error: 'Failed to process chat request' }, 500)
  }
})

// Logo generation endpoint
app.post('/generate-logo', async (c) => {
  try {
    const { brandName, style } = await c.req.json()

    if (!brandName) {
      return c.json({ error: 'Brand name is required' }, 400)
    }

    const openaiApiKey = c.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return c.json({ error: 'OpenAI API key not configured' }, 500)
    }

    const prompt = `Create a professional logo for "${brandName}" in ${style || 'modern'} style. The logo should be simple, memorable, and suitable for business use. Use clean lines and modern design principles. The logo should work well in both color and black & white.`

    // Generate multiple logo variations
    const logoPromises = [
      generateLogoWithDallE(openaiApiKey, `${prompt} - Modern design`),
      generateLogoWithDallE(openaiApiKey, `${prompt} - Elegant design`),
      generateLogoWithDallE(openaiApiKey, `${prompt} - Bold design`)
    ]

    const logoResults = await Promise.allSettled(logoPromises)
    
    const logos = logoResults
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map((result, index) => ({
        id: index + 1,
        url: result.value.url,
        style: ['modern', 'elegant', 'bold'][index],
        description: ['Modern logo design', 'Elegant logo design', 'Bold logo design'][index],
        generated: true
      }))

    if (logos.length === 0) {
      return c.json({ error: 'Failed to generate any logos' }, 500)
    }

    return c.json({
      logos,
      isFallback: false,
      generatedBy: 'OpenAI DALL-E'
    })

  } catch (error) {
    console.error('Logo generation error:', error)
    return c.json({ error: 'Failed to generate logos' }, 500)
  }
})

// Helper function to generate logo with DALL-E
async function generateLogoWithDallE(apiKey: string, prompt: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    })
  })

  if (!response.ok) {
    throw new Error(`DALL-E API error: ${response.statusText}`)
  }

  const result = await response.json()
  return {
    url: result.data[0].url
  }
}

export default app