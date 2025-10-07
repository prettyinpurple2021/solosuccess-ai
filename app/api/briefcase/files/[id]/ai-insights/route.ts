import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'
import { NextRequest, NextResponse} from 'next/server'
import { authenticateRequest} from '@/lib/auth-server'
import { createClient} from '@/lib/neon/server'

// Type for Cloudflare service bindings
interface Env {
  GOOGLE_AI_WORKER: {
    fetch: (request: Request) => Promise<Response>
  }
}


// Removed Edge Runtime due to Node.js dependencies (JWT, auth, fs, crypto, etc.)
// Edge Runtime disabled due to Node.js dependency incompatibility

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const { id } = params
    
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const documentId = id
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

    // Generate AI insights using Google AI Worker
    const env = process.env as unknown as Env
    const googleAiWorker = env.GOOGLE_AI_WORKER

    if (!googleAiWorker) {
      return NextResponse.json({ error: 'AI analysis service temporarily unavailable' }, { status: 503 })
    }

    // Create request to Google AI worker
    const workerRequest = new Request('https://worker/analyze-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: truncatedContent,
        fileName: document.name,
        mimeType: document.mime_type
      })
    })

    // Call the worker
    const workerResponse = await googleAiWorker.fetch(workerRequest)

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text()
      logError('Google AI Worker error:', errorText)
      return NextResponse.json({ error: 'Failed to generate AI insights' }, { status: 500 })
    }

    const workerResult = await workerResponse.json()
    const insights = workerResult.insights

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
    logError('AI insights error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI insights' },
      { status: 500 }
    )
  }
}

