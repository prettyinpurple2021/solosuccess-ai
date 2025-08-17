import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { createClient } from '@/lib/neon/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateRequest()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversationId = params.id

    const client = await createClient()
    
    // Get conversation data
    const { rows: conversations } = await client.query(
      `SELECT c.id, c.user_id, c.agent_id, c.created_at, c.updated_at
       FROM conversations c
       WHERE c.id = $1 AND c.user_id = $2`,
      [conversationId, user.id]
    )

    if (conversations.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const conversation = conversations[0]

    // Get all messages for this conversation
    const { rows: messages } = await client.query(
      `SELECT message, response, created_at
       FROM conversations
       WHERE user_id = $1 AND agent_id = $2
       ORDER BY created_at ASC`,
      [user.id, conversation.agent_id]
    )

    // Format messages into chat format
    const formattedMessages = []
    for (const msg of messages) {
      if (msg.message) {
        formattedMessages.push({
          id: `user-${msg.created_at}`,
          role: 'user',
          content: msg.message,
          timestamp: new Date(msg.created_at)
        })
      }
      if (msg.response) {
        formattedMessages.push({
          id: `assistant-${msg.created_at}`,
          role: 'assistant',
          content: msg.response,
          timestamp: new Date(msg.created_at)
        })
      }
    }

    return NextResponse.json({
      id: conversation.id,
      user_id: conversation.user_id,
      agent_id: conversation.agent_id,
      messages: formattedMessages,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at
    })

  } catch (error) {
    console.error('Conversation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}