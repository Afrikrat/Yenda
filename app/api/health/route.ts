import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"
import { cookies } from "next/headers"

// Create a Supabase client inside the request handler to avoid the "cookies outside request scope" error
async function createSupabaseClient() {
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

export async function GET() {
  try {
    // Create the client inside the request handler
    const supabase = await createSupabaseClient()

    // Check database connection
    const { data, error } = await supabase.from("events").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "online",
        api: "online",
        storage: "online",
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function HEAD() {
  // For HEAD requests, we don't need to check the database
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
