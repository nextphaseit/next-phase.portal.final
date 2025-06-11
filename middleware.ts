import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { validateRuntimeConfig } from "./lib/config"
import { getToken } from 'next-auth/jwt'
import { hasFeatureAccess } from '@/lib/auth/roles'

export async function middleware(request: NextRequest) {
  // Validate environment variables on first request
  try {
    validateRuntimeConfig()
  } catch (error) {
    console.error("Runtime environment validation failed:", error)

    // In production, return error page
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(
        JSON.stringify({
          error: "Configuration Error",
          message: "Server configuration is incomplete. Please contact administrator.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  }

  // Check maintenance mode
  if (process.env.MAINTENANCE_MODE === "true") {
    const url = request.nextUrl.clone()
    if (!url.pathname.startsWith("/maintenance") && !url.pathname.startsWith("/api")) {
      url.pathname = "/maintenance"
      return NextResponse.redirect(url)
    }
  }

  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  )

  const token = await getToken({ req: request as any })
  const path = new URL(request.url).pathname

  // Public API routes that don't require authentication
  const publicRoutes = ['/api/auth']
  if (publicRoutes.some(route => path.startsWith(route))) {
    return response
  }

  // Check if user is authenticated
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Map API routes to required features
  const routeFeatureMap: Record<string, string> = {
    '/api/users': 'user:view',
    '/api/users/create': 'user:create',
    '/api/users/update': 'user:edit',
    '/api/users/delete': 'user:delete',
    '/api/tickets': 'ticket:view',
    '/api/tickets/create': 'ticket:create',
    '/api/tickets/update': 'ticket:edit',
    '/api/tickets/delete': 'ticket:delete',
    '/api/documents': 'document:view',
    '/api/documents/upload': 'document:upload',
    '/api/documents/delete': 'document:delete',
    '/api/analytics': 'analytics:view',
    '/api/analytics/export': 'analytics:export',
    '/api/calendar': 'calendar:view',
    '/api/calendar/create': 'calendar:create',
    '/api/calendar/update': 'calendar:edit',
    '/api/calendar/delete': 'calendar:delete',
  }

  // Find the matching feature for the current route
  const requiredFeature = Object.entries(routeFeatureMap).find(([route]) => 
    path.startsWith(route)
  )?.[1]

  // If no feature is required for this route, allow access
  if (!requiredFeature) {
    return response
  }

  // Check if user has access to the required feature
  if (!hasFeatureAccess(token.role as any, requiredFeature as any)) {
    return new NextResponse(
      JSON.stringify({ error: 'Insufficient permissions' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
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
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
