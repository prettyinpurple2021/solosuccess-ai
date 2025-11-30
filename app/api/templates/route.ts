
import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { templates } from '@/db/schema'
import { eq, or, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import * as jose from 'jose'

export const dynamic = 'force-dynamic'

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sql = getSql()

    // Fetch system templates (is_public = true) AND user's templates
    const allTemplates = await sql`
      SELECT * FROM templates 
      WHERE is_public = true 
      OR user_id = ${user.userId as string}
      ORDER BY created_at DESC
    `

    return NextResponse.json(allTemplates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, category } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const sql = getSql()

    const newTemplate = await sql`
      INSERT INTO templates (user_id, title, description, content, category, is_public)
      VALUES (${user.userId as string}, ${title}, ${description || ''}, ${content}, ${category || 'general'}, false)
      RETURNING *
    `

    return NextResponse.json(newTemplate[0])
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}