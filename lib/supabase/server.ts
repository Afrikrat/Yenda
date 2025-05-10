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

// Create a singleton instance for server-side usage
// This is the missing export that was causing the deployment error
export const supabase = createServerSupabaseClient()
