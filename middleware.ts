import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { validateRuntimeConfig } from "./lib/config"

export function middleware(request: NextRequest) {
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

  // Add security headers
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
  )

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
