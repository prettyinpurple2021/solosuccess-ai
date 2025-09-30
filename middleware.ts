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

  // For protected routes, check for auth session in cookies
  const authCookie = request.cookies.get('better-auth.session-token')
  
  if (!authCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

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