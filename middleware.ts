import { NextRequest, NextResponse } from 'next/server'

// Simplified middleware to avoid Edge runtime issues
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/signin', 
    '/signup',
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

  // Always allow public routes and API routes
  if (isPublicRoute || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // For protected routes, temporarily allow access to test authentication
  // TODO: Fix Better Auth cookie detection
  const allCookies = request.cookies.getAll()
  const hasAuthCookie = allCookies.some(cookie => 
    cookie.name.includes('session') || 
    cookie.name.includes('auth') ||
    cookie.name.includes('token') ||
    cookie.name.includes('better-auth')
  )
  
  // Temporarily disable auth check for debugging
  // if (!hasAuthCookie) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/signin'
  //   url.searchParams.set('redirect', pathname)
  //   return NextResponse.redirect(url)
  // }

  return NextResponse.next()
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