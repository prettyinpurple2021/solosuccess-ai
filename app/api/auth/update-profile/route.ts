import { NextRequest, NextResponse} from 'next/server'
import { verifyToken} from '@/lib/auth-utils'
import { db} from '@/db'
import { users} from '@/db/schema'
import { eq} from 'drizzle-orm'
import { logger, logError, logWarn, logInfo, logDebug, logApi, logDb, logAuth } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Update user profile in database
    await db
      .update(users)
      .set({ 
        full_name: name.trim(),
        updated_at: new Date()
      })
      .where(eq(users.id, decoded.userId))

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    })

  } catch (error) {
    logError('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
