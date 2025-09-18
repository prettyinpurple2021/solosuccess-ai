import { NextRequest, NextResponse} from 'next/server'
import { z} from 'zod'
import { authenticateRequest} from '@/lib/auth-server'
import { rateLimitByIp} from '@/lib/rate-limit'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Validation schema for conversation data
const ConversationSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  agentId: z.string().optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string().datetime().optional()
  })).optional()
})

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 100, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mock conversations data for now - replace with actual database query
    const conversations = [
      {
        id: '1',
        title: 'Business Strategy Discussion',
        agentId: 'blaze',
        agentName: 'Blaze',
        lastMessage: 'Let\'s scale your business to the next level!',
        lastMessageTime: new Date().toISOString(),
        messageCount: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Content Creation Help',
        agentId: 'echo',
        agentName: 'Echo',
        lastMessage: 'Here are some viral content ideas for you!',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        messageCount: 8,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      conversations
    })

  } catch (error) {
    logError('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 50, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const conversationData = ConversationSchema.parse(body)

    // Create new conversation - replace with actual database operation
    const newConversation = {
      id: Date.now().toString(),
      title: conversationData.title || 'New Conversation',
      agentId: conversationData.agentId || 'roxy',
      agentName: 'Roxy',
      lastMessage: 'Hello! How can I help you today?',
      lastMessageTime: new Date().toISOString(),
      messageCount: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      conversation: newConversation
    }, { status: 201 })

  } catch (error) {
    logError('Error creating conversation:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid conversation data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 50, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    const validatedData = ConversationSchema.partial().parse(updateData)

    // Update conversation - replace with actual database operation
    const updatedConversation = {
      id,
      ...validatedData,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      conversation: updatedConversation
    })

  } catch (error) {
    logError('Error updating conversation:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid conversation data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitByIp(request, { requests: 50, window: 60 })
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Authentication
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get conversation ID from query params
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    // Delete conversation - replace with actual database operation
    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully'
    })

  } catch (error) {
    logError('Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}