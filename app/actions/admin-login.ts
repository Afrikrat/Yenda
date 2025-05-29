"use server"

import { supabase } from "@/lib/supabase/client"

// List of admin emails - add your admin email here
const ADMIN_EMAILS = ["admin@example.com", "admin@yenda.com", "yendaofficial@gmail.com"]

export async function adminLogin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: "Login failed. Please try again." }
    }

    // Check if the user is an admin by email
    if (!ADMIN_EMAILS.includes(data.user.email || "")) {
      // Sign out if not admin
      await supabase.auth.signOut()
      return { success: false, error: "You don't have permission to access the admin area." }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Admin login error:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
