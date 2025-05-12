"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteAllBlogPosts() {
  try {
    const supabase = createServerSupabaseClient()

    // Delete all blog posts
    const { error } = await supabase.from("blog_posts").delete().neq("id", "placeholder")

    if (error) {
      console.error("Error deleting all blog posts:", error)
      return { success: false, message: error.message }
    }

    // Revalidate paths to update the UI
    revalidatePath("/blog")
    revalidatePath("/admin/blog")
    revalidatePath("/admin")

    return { success: true, message: "All blog posts have been deleted successfully." }
  } catch (error: any) {
    console.error("Error in deleteAllBlogPosts:", error)
    return { success: false, message: error.message || "An error occurred while deleting blog posts." }
  }
}
