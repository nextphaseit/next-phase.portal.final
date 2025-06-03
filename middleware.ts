import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance mode check with safe default
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true"

  if (isMaintenanceMode && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    const key = getRateLimitKey(request)

    if (isRateLimited(key)) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
  }

  // Security headers
  const response = NextResponse.next()

  // Remove server information
  response.headers.set("Server", "")

  // Add security headers
  response.headers.set("X-DNS-Prefetch-Control", "off")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return response
}

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown"
  return ip
}

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(key)

  if (!limit || now > limit.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 }) // 15 minutes
    return false
  }

  if (limit.count >= 100) {
    // 100 requests per 15 minutes
    return true
  }

  limit.count++
  return false
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
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
