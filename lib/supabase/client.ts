import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase URL or Anon Key is missing")
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "yenda_auth_token",
    },
  })

  return supabaseInstance
}

// For backward compatibility
export const supabase = getSupabaseClient()

// Helper function to refresh the token
export const refreshToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) {
      console.error("Error refreshing token:", error)
      return false
    }
    return !!data.session
  } catch (error) {
    console.error("Error in refreshToken:", error)
    return false
  }
}

// Helper function to check if the user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("Error checking authentication:", error)
      return false
    }
    if (!data.session) {
      // Try to refresh the token
      return await refreshToken()
    }
    return true
  } catch (error) {
    console.error("Error in isAuthenticated:", error)
    return false
  }
}
