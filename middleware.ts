import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookies = request.cookies.getAll()
          const cookie = cookies.find((cookie) => cookie.name === name)
          return cookie ? cookie.value : undefined
        },
        set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
          // This is used for server-side cookies setting, which we don't need in middleware
        },
        remove(name: string, options: { path: string; domain?: string }) {
          // This is used for server-side cookies setting, which we don't need in middleware
        },
      },
    },
  )

  // If accessing admin routes, check if user is authenticated
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      const redirectUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
