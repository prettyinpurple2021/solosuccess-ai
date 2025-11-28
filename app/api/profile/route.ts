import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth-server'
import { getDb } from '@/lib/database-client'
import { z } from 'zod'
import { logger, logError, logInfo } from '@/lib/logger'

// Edge runtime enabled after refactoring to jose and Neon HTTP
export const runtime = 'edge'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const route = '/api/profile'
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      logInfo('Unauthorized profile request', {
        route,
        status: 401,
        meta: { ip: request.headers.get('x-forwarded-for') || 'unknown' }
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getDb()
    const { rows } = await db.query(
      `SELECT id, email, full_name, avatar_url, subscription_tier, subscription_status,
              stripe_customer_id, stripe_subscription_id, current_period_start, current_period_end, cancel_at_period_end,
              level, total_points, current_streak, wellness_score, focus_minutes, onboarding_completed, preferred_ai_agent
         FROM users WHERE id = $1`,
      [user.id]
    )

    if (rows.length === 0) {
      logInfo('Profile not found', {
        route,
        userId: user.id,
        status: 404,
        meta: { ip: request.headers.get('x-forwarded-for') || 'unknown' }
      })
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    logInfo('Profile fetched successfully', {
      route,
      userId: user.id,
      status: 200,
      meta: { ip: request.headers.get('x-forwarded-for') || 'unknown' }
    })

    return NextResponse.json(rows[0])
  } catch (err) {
    logError('Error fetching profile', {
      route,
      status: 500,
      error: err,
      meta: {
        errorMessage: err instanceof Error ? err.message : String(err),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update current user's profile
export async function PATCH(request: NextRequest) {
  const route = '/api/profile'
  try {
    const { user, error } = await authenticateRequest()
    if (error || !user) {
      logInfo('Unauthorized profile update attempt', {
        route,
        status: 401,
        meta: { ip: request.headers.get('x-forwarded-for') || 'unknown' }
      })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const BodySchema = z.object({
      full_name: z.string().min(1).max(200).nullable().optional(),
      avatar_url: z.string().url().nullable().optional(),
      onboarding_completed: z.boolean().optional(),
      onboarding_data: z.unknown().optional(),
    })
    const parsed = BodySchema.safeParse(await request.json())
    if (!parsed.success) {
      logInfo('Invalid profile update payload', {
        route,
        userId: user.id,
        status: 400,
        meta: {
          validationErrors: parsed.error.flatten(),
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 })
    }
    const { full_name, avatar_url, onboarding_completed, onboarding_data } = parsed.data

    const shouldUpdateOnboardingData = typeof onboarding_data !== 'undefined'
    let onboardingDataJson: string | null = null

    if (shouldUpdateOnboardingData) {
      if (onboarding_data === null) {
        onboardingDataJson = null
      } else {
        try {
          onboardingDataJson = JSON.stringify(onboarding_data)
        } catch (serializationError) {
          logInfo('Invalid onboarding_data payload', {
            route,
            userId: user.id,
            status: 400,
            meta: {
              serializationError: serializationError instanceof Error ? serializationError.message : 'Unknown error',
              ip: request.headers.get('x-forwarded-for') || 'unknown'
            }
          })
          return NextResponse.json({ error: 'Invalid onboarding_data payload' }, { status: 400 })
        }
      }
    }

    const db = getDb()
    const { rows } = await db.query(
      `UPDATE users
          SET 
            full_name = COALESCE($1, full_name),
            avatar_url = COALESCE($2, avatar_url),
            onboarding_completed = COALESCE($3, onboarding_completed),
            onboarding_completed_at = CASE 
              WHEN $3 = true THEN NOW()
              WHEN $3 = false THEN NULL
              ELSE onboarding_completed_at 
            END,
            onboarding_data = CASE 
              WHEN $4 THEN $5::jsonb 
              ELSE onboarding_data 
            END,
            updated_at = NOW()
        WHERE id = $6
        RETURNING id, email, full_name, avatar_url, subscription_tier, subscription_status, onboarding_completed, onboarding_completed_at, onboarding_data`,
      [
        full_name ?? null,
        avatar_url ?? null,
        onboarding_completed ?? null,
        shouldUpdateOnboardingData,
        onboardingDataJson,
        user.id
      ]
    )

    logInfo('Profile updated successfully', {
      route,
      userId: user.id,
      status: 200,
      meta: {
        updatedFields: {
          full_name: full_name !== undefined,
          avatar_url: avatar_url !== undefined,
          onboarding_completed: onboarding_completed !== undefined,
          onboarding_data: shouldUpdateOnboardingData
        },
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })

    return NextResponse.json(rows[0])
  } catch (err) {
    logError('Error updating profile', {
      route,
      status: 500,
      error: err,
      meta: {
        errorMessage: err instanceof Error ? err.message : String(err),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      }
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}