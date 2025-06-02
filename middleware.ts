import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For our custom auth system, we handle authentication client-side
  // This middleware just allows all requests to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (our custom auth pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
}
