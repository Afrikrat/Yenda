"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function clearAllDemoData() {
  try {
    const supabase = createServerSupabaseClient()
    console.log("Starting demo data cleanup...")

    // Clear blog posts - remove the placeholder condition
    console.log("Clearing blog posts...")
    const { error: blogError } = await supabase.from("blog_posts").delete()

    if (blogError) {
      console.error("Error clearing blog posts:", blogError)
      throw new Error(`Failed to clear blog posts: ${blogError.message}`)
    }

    // Clear events - remove the placeholder condition
    console.log("Clearing events...")
    const { error: eventsError } = await supabase.from("events").delete()

    if (eventsError) {
      console.error("Error clearing events:", eventsError)
      throw new Error(`Failed to clear events: ${eventsError.message}`)
    }

    // Clear demo users (excluding admin users)
    console.log("Clearing demo users...")
    // First get all demo users (those with email containing 'demo' or 'test')
    const { data: demoUsers, error: userQueryError } = await supabase
      .from("profiles")
      .select("id")
      .or("email.ilike.%demo%,email.ilike.%test%")

    if (userQueryError) {
      console.error("Error querying demo users:", userQueryError)
      throw new Error(`Failed to query demo users: ${userQueryError.message}`)
    }

    if (demoUsers && demoUsers.length > 0) {
      console.log(`Found ${demoUsers.length} demo users to delete`)

      // Delete profiles first (due to foreign key constraints)
      const { error: profilesError } = await supabase
        .from("profiles")
        .delete()
        .in(
          "id",
          demoUsers.map((user) => user.id),
        )

      if (profilesError) {
        console.error("Error deleting profiles:", profilesError)
        throw new Error(`Failed to delete profiles: ${profilesError.message}`)
      }

      // Then delete auth users
      for (const user of demoUsers) {
        try {
          await supabase.auth.admin.deleteUser(user.id)
          console.log(`Deleted user ${user.id}`)
        } catch (error) {
          console.error(`Error deleting auth user ${user.id}:`, error)
          // Continue with other users even if one fails
        }
      }
    } else {
      console.log("No demo users found to delete")
    }

    // Clear locations (except default ones)
    console.log("Clearing custom locations...")
    const { error: locationsError } = await supabase.from("locations").delete().not("id", "in", ["1", "2", "3"]) // Keep default locations

    if (locationsError) {
      console.error("Error clearing locations:", locationsError)
      throw new Error(`Failed to clear locations: ${locationsError.message}`)
    }

    // Clear categories (except default ones)
    console.log("Clearing custom categories...")
    const { error: categoriesError } = await supabase.from("categories").delete().not("id", "in", ["1", "2", "3"]) // Keep default categories

    if (categoriesError) {
      console.error("Error clearing categories:", categoriesError)
      throw new Error(`Failed to clear categories: ${categoriesError.message}`)
    }

    // Revalidate paths to update UI
    console.log("Revalidating paths...")
    revalidatePath("/admin")
    revalidatePath("/")
    revalidatePath("/blog")
    revalidatePath("/events")

    console.log("Demo data cleanup completed successfully")
    return {
      success: true,
      message: "All demo data has been cleared successfully!",
    }
  } catch (error: any) {
    console.error("Error clearing demo data:", error)
    return {
      success: false,
      message: error.message || "Failed to clear demo data. Please try again.",
    }
  }
}
