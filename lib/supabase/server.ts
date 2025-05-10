import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

// This function should only be used in Server Components or Server Actions
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: { path: string; domain?: string }) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })
}

// Alternative version that doesn't use next/headers for middleware or other contexts
export function createServerSupabaseClientWithCookies(cookieStore: {
  get: (name: string) => { value: string } | undefined
  set: (cookie: { name: string; value: string; path: string; maxAge?: number; domain?: string }) => void
}) {
  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: { path: string; maxAge: number; domain?: string }) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: { path: string; domain?: string }) {
        cookieStore.set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })
}

// For API routes and other contexts where cookies() can't be used at the module level
export async function createSupabaseServerClientForAPI(request: Request) {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [key, ...value] = cookie.split("=")
      return [key.trim(), value.join("=")]
    }),
  )

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookies[name]
      },
      set(name: string, value: string) {
        // This is a read-only client for API routes
      },
      remove(name: string) {
        // This is a read-only client for API routes
      },
    },
  })
}

// REMOVED: export const supabase = createServerSupabaseClient()
