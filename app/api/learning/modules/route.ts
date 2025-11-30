
import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
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

    // Fetch all published learning modules
    const modules = await sql`
      SELECT * FROM learning_modules 
      WHERE is_published = true 
      ORDER BY created_at DESC
    `

    return NextResponse.json(modules)
  } catch (error) {
    console.error('Error fetching learning modules:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
