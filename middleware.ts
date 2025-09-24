import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin')) {
    const hasToken = request.cookies.get('auth_token')?.value
    if (!hasToken) {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}

import { NextRequest, NextResponse } from 'next/server'

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

  // For all other routes, allow access (client-side auth will handle redirects)
  // The client-side authentication will handle redirecting to signin if needed
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