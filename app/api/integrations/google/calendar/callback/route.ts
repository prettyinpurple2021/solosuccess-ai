import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'
import { logError, logInfo } from '@/lib/logger'

export const dynamic = 'force-dynamic'

/**
 * OAuth callback handler for Google Calendar
 * This route handles the callback after user authorizes access
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // Contains user ID
    const error = searchParams.get('error')

    if (error) {
      logError('Google Calendar OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?calendar_error=${encodeURIComponent(error)}`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?calendar_error=no_code`
      )
    }

    if (!state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?calendar_error=no_state`
      )
    }

    // Exchange code for tokens via POST to our API
    try {
      // In a real implementation, we'd need to get the user's token
      // For now, we'll use the state as the userId and handle it in the API
      // The frontend will need to handle this callback by calling the POST endpoint
      
      // Redirect to settings page with code for frontend to handle
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?calendar_code=${encodeURIComponent(code)}&calendar_state=${encodeURIComponent(state)}`
      )
    } catch (error) {
      logError('Failed to exchange OAuth code:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?calendar_error=exchange_failed`
      )
    }
  } catch (error) {
    logError('Calendar callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?calendar_error=unknown`
    )
  }
}

