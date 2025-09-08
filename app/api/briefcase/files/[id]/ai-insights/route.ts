import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = params.id
    const client = await createClient()

    // Get document info with file data
    const { rows: [document] } = await client.query(`
      SELECT id, name, mime_type, file_data, user_id
      FROM documents 
      WHERE id = $1 AND user_id = $2
    `, [documentId, user.id])

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Check if document is text-based for AI analysis
    const textBasedTypes = [
      'text/plain',
      'text/markdown',
      'application/json',
      'text/csv',
      'text/html',
      'text/css',
      'text/javascript',
      'application/javascript',
      'text/typescript',
      'application/typescript',
    ]

    if (!textBasedTypes.includes(document.mime_type)) {
      return NextResponse.json({ 
        error: 'Document type not suitable for AI analysis',
        supportedTypes: textBasedTypes 
      }, { status: 400 })
    }

    // Get file content from database
    const fileBuffer = document.file_data
    const content = fileBuffer.toString('utf-8')

    if (content.length === 0) {
      return NextResponse.json({ 
        error: 'Document is empty' 
      }, { status: 400 })
    }

    // Limit content size for AI processing (50KB max)
    const maxContentLength = 50000
    const truncatedContent = content.length > maxContentLength 
      ? content.substring(0, maxContentLength) + '...'
      : content

    // Generate AI insights
    const insights = await generateDocumentInsights(truncatedContent, document.name, document.mime_type)

    // Save insights to database
    await client.query(`
      UPDATE documents 
      SET ai_insights = $1, updated_at = NOW()
      WHERE id = $2
    `, [JSON.stringify(insights), documentId])

    // Log activity
    await client.query(`
      INSERT INTO document_activity (document_id, user_id, action, details, created_at)
      VALUES ($1, $2, 'ai_analyzed', $3, NOW())
    `, [
      documentId,
      user.id,
      JSON.stringify({
        fileName: document.name,
        fileType: document.mime_type,
        contentLength: content.length,
        insightsGenerated: Object.keys(insights).length,
      })
    ])

    return NextResponse.json({
      success: true,
      insights,
      document: {
        id: document.id,
        name: document.name,
        type: document.file_type,
        size: document.size,
      }
    })

  } catch (error) {
    console.error('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}

async function generateDocumentInsights(content: string, fileName: string, mimeType: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

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
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
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
        readingTime: Math.ceil(content.length / 200),
        complexity: 'medium',
        wordCount: content.split(/\s+/).length
      }
    }
  } catch (error) {
    console.error('AI generation error:', error)
    // Return basic insights if AI fails
    return {
      summary: `Document analysis for ${fileName}`,
      keyPoints: ['Document processed'],
      topics: [{ name: 'General', confidence: 0.5, relevance: 'medium' }],
      entities: [],
      sentiment: {
        overall: 'neutral',
        score: 0.5,
        breakdown: { positive: 33, negative: 33, neutral: 34 },
        emotions: { joy: 0.2, sadness: 0.2, anger: 0.1, fear: 0.1, surprise: 0.1 }
      },
      categories: [{ category: 'General', confidence: 0.5, reasoning: 'Fallback analysis' }],
      suggestedTags: [{ name: 'processed', confidence: 1.0 }],
      readingTime: Math.ceil(content.length / 200),
      complexity: 'medium',
      wordCount: content.split(/\s+/).length
    }
  }
}
