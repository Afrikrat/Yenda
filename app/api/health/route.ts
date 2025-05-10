import { createSupabaseServerClientForAPI } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Create Supabase client inside the request handler
    const supabase = await createSupabaseServerClientForAPI(request)

    // Check database connection
    const { data, error } = await supabase.from("health_check").select("*").limit(1).maybeSingle()

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
