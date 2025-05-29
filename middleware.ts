import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Allow access to admin login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next()
  }

  // For other admin routes, we'll handle authentication client-side for now
  // This prevents middleware from blocking access during development
  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
