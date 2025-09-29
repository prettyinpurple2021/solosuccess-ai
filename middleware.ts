import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/signin',
    '/signup',
    '/forgot-password',
    '/about',
    '/features',
    '/pricing',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies',
    '/gdpr',
    '/blog',
    '/landing',
    '/auth/2fa',
    '/auth/sessions',
    '/api/auth',
    '/api/health',
    '/manifest.json',
    '/sw.js',
    '/favicon.ico',
    '/robots.txt'
  ]

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // For API routes, let them handle their own authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check authentication using Better Auth
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Check if user needs 2FA verification
    if (session.user.twoFactorEnabled && !session.user.twoFactorVerified) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/2fa'
      return NextResponse.redirect(url)
    }

    // Check if user needs device approval
    if (session.user.requiresDeviceApproval && !session.user.deviceApproved) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/device-approval'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch (error) {
    // If there's an error checking the session, redirect to signin
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}