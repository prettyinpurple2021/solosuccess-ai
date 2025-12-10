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
    '/status',
    '/help',
    '/security',
    '/compliance',
    '/careers',
    '/forgot-password',
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

  // Create response with security headers for ALL routes
  const response = NextResponse.next()
  
  // Security headers (production-ready)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // CSP (Content Security Policy) - adjust as needed for your app
  // Applied to ALL routes to ensure chatbase.co is always allowed
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://www.chatbase.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "connect-src 'self' https://*.neon.tech https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://api.stripe.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://sse.devcycle.com https://www.chatbase.co",
    "frame-src https://js.stripe.com https://www.chatbase.co",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://api.stripe.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // For protected routes, check authentication
  if (!isPublicRoute && !pathname.startsWith('/api/')) {
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
  }
  
  return response
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