import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import jwt from 'jsonwebtoken'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded?.userId || null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const sql = getSql()
    const userId = getUserIdFromToken(req)
    
    // Get specific preference key from query params
    const url = new URL(req.url)
    const key = url.searchParams.get('key')
    
    if (!userId) {
      // For anonymous users, return default/empty state
      return NextResponse.json({ preferences: {} })
    }
    
    // Create table if it doesn't exist
    await sql`create table if not exists user_preferences (
      id serial primary key,
      user_id integer not null,
      preference_key varchar(100) not null,
      preference_value jsonb not null,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      unique(user_id, preference_key)
    )`
    
    if (key) {
      // Get specific preference
      const result = await sql`
        select preference_value from user_preferences 
        where user_id = ${userId} and preference_key = ${key}
      `
      
      const value = result.length > 0 ? result[0].preference_value : null
      return NextResponse.json({ key, value })
    } else {
      // Get all preferences for user
      const result = await sql`
        select preference_key, preference_value from user_preferences 
        where user_id = ${userId}
      `
      
      const preferences = result.reduce((acc, row) => {
        acc[row.preference_key] = row.preference_value
        return acc
      }, {} as Record<string, any>)
      
      return NextResponse.json({ preferences })
    }
  } catch (error) {
    console.error('Preferences GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getSql()
    const userId = getUserIdFromToken(req)
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const { key, value, preferences } = await req.json().catch(() => ({}))
    
    // Create table if it doesn't exist
    await sql`create table if not exists user_preferences (
      id serial primary key,
      user_id integer not null,
      preference_key varchar(100) not null,
      preference_value jsonb not null,
      created_at timestamptz default now(),
      updated_at timestamptz default now(),
      unique(user_id, preference_key)
    )`
    
    if (preferences) {
      // Bulk update multiple preferences
      const results = []
      for (const [prefKey, prefValue] of Object.entries(preferences)) {
        const result = await sql`
          insert into user_preferences (user_id, preference_key, preference_value, updated_at) 
          values (${userId}, ${prefKey}, ${JSON.stringify(prefValue)}, now())
          on conflict (user_id, preference_key) do update set 
            preference_value = ${JSON.stringify(prefValue)}, 
            updated_at = now()
          returning preference_key, preference_value
        `
        results.push(result[0])
      }
      
      return NextResponse.json({ 
        success: true, 
        updated: results.length,
        preferences: results.reduce((acc, row) => {
          acc[row.preference_key] = row.preference_value
          return acc
        }, {} as Record<string, any>)
      })
    } else if (key && value !== undefined) {
      // Update single preference
      const result = await sql`
        insert into user_preferences (user_id, preference_key, preference_value, updated_at) 
        values (${userId}, ${key}, ${JSON.stringify(value)}, now())
        on conflict (user_id, preference_key) do update set 
          preference_value = ${JSON.stringify(value)}, 
          updated_at = now()
        returning preference_key, preference_value
      `
      
      return NextResponse.json({ 
        success: true, 
        key: result[0].preference_key, 
        value: result[0].preference_value 
      })
    } else {
      return NextResponse.json({ error: 'Key and value, or preferences object required' }, { status: 400 })
    }
  } catch (error) {
    console.error('Preferences POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sql = getSql()
    const userId = getUserIdFromToken(req)
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    const url = new URL(req.url)
    const key = url.searchParams.get('key')
    
    if (!key) {
      return NextResponse.json({ error: 'Key parameter required' }, { status: 400 })
    }
    
    await sql`
      delete from user_preferences 
      where user_id = ${userId} and preference_key = ${key}
    `
    
    return NextResponse.json({ success: true, deleted: key })
  } catch (error) {
    console.error('Preferences DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}