import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query, semantic = false } = await request.json()

    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] })
    }

    const client = await createClient()

    // Get user's documents for context
    const { rows: documents } = await client.query(`
      SELECT name, category, tags, description, file_type
      FROM documents 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 50
    `, [user.id])

    // Get available tags and categories
    const { rows: tags } = await client.query(`
      SELECT DISTINCT jsonb_array_elements_text(tags) as tag
      FROM documents 
      WHERE user_id = $1 AND tags IS NOT NULL
      LIMIT 20
    `, [user.id])

    const { rows: categories } = await client.query(`
      SELECT DISTINCT category
      FROM documents 
      WHERE user_id = $1 AND category IS NOT NULL
      LIMIT 10
    `, [user.id])

    const suggestions = []

    // Basic suggestions based on existing data
    if (!semantic) {
      // Tag suggestions
      tags
        .filter(tag => tag.tag.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach(tag => {
          suggestions.push({
            query: tag.tag,
            label: `Tag: ${tag.tag}`,
            type: 'tag'
          })
        })

      // Category suggestions
      categories
        .filter(cat => cat.category.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach(cat => {
          suggestions.push({
            query: cat.category,
            label: `Category: ${cat.category}`,
            type: 'category'
          })
        })

      // File name suggestions
      documents
        .filter(doc => doc.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach(doc => {
          suggestions.push({
            query: doc.name,
            label: `File: ${doc.name}`,
            type: 'filename'
          })
        })

      return NextResponse.json({ suggestions })
    }

    // AI-powered semantic suggestions
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const context = {
        userDocuments: documents.slice(0, 20).map(doc => ({
          name: doc.name,
          category: doc.category,
          tags: doc.tags,
          description: doc.description,
          fileType: doc.file_type
        })),
        availableTags: tags.map(t => t.tag),
        availableCategories: categories.map(c => c.category)
      }

      const prompt = `
You are an AI assistant helping a user search through their document collection. Based on their search query and their existing documents, suggest 3-5 relevant search queries that might help them find what they're looking for.

User's search query: "${query}"

User's document context:
- Recent documents: ${JSON.stringify(context.userDocuments, null, 2)}
- Available tags: ${context.availableTags.join(', ')}
- Available categories: ${context.availableCategories.join(', ')}

Please suggest 3-5 alternative search queries that:
1. Are semantically related to their query
2. Use terms from their actual document collection
3. Include specific tags, categories, or file types when relevant
4. Are concise and actionable

Return your suggestions as a JSON array with this format:
[
  {
    "query": "suggested search term",
    "label": "Human-readable description of why this suggestion is relevant",
    "type": "semantic"
  }
]

Focus on practical, specific suggestions that will help them find their documents.
`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Try to parse AI response
      try {
        const aiSuggestions = JSON.parse(text)
        if (Array.isArray(aiSuggestions)) {
          suggestions.push(...aiSuggestions)
        }
      } catch (parseError) {
        console.error('Failed to parse AI suggestions:', parseError)
        // Fallback to basic suggestions if AI parsing fails
      }
    } catch (aiError) {
      console.error('AI suggestion generation failed:', aiError)
      // Continue with basic suggestions
    }

    // Add basic suggestions as fallback
    tags
      .filter(tag => tag.tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .forEach(tag => {
        suggestions.push({
          query: tag.tag,
          label: `Tag: ${tag.tag}`,
          type: 'tag'
        })
      })

    return NextResponse.json({ 
      suggestions: suggestions.slice(0, 5) // Limit to 5 suggestions
    })

  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate suggestions' 
    }, { status: 500 })
  }
}
