import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { neon } from '@neondatabase/serverless'

function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }
  return neon(url)
}

export async function POST(request: NextRequest) {
  try {
    const sql = getSql()
    const { identifier, password, isEmail } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      )
    }

    // Get user from database - check both email and username
    let users
    if (isEmail) {
      // Search by email
      users = await sql`
        SELECT id, email, password_hash, full_name, username, date_of_birth, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end, created_at
        FROM users 
        WHERE email = ${identifier.toLowerCase()}
      `
    } else {
      // Search by username
      users = await sql`
        SELECT id, email, password_hash, full_name, username, date_of_birth, subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end, created_at
        FROM users 
        WHERE username = ${identifier.toLowerCase()}
      `
    }

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Check if user has a password hash (for existing users without passwords)
    if (!user.password_hash) {
      return NextResponse.json(
        { error: 'Please set up a password for your account' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email/username or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      username: user.username,
      date_of_birth: user.date_of_birth,
      subscription_tier: user.subscription_tier || 'launch',
      subscription_status: user.subscription_status || 'active',
      stripe_customer_id: user.stripe_customer_id,
      stripe_subscription_id: user.stripe_subscription_id,
      current_period_start: user.current_period_start,
      current_period_end: user.current_period_end,
      cancel_at_period_end: user.cancel_at_period_end || false,
      created_at: user.created_at
    }

    return NextResponse.json({
      user: userData,
      token
    })

  } catch (error) {
    console.error('Signin error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    )
  }
}
