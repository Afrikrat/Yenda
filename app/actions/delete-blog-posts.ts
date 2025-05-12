"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteAllBlogPosts() {
  try {
    const supabase = createServerSupabaseClient()

    // Delete all blog posts
    const { error } = await supabase.from("blog_posts").delete().not("id", "eq", "placeholder")

    if (error) {
      console.error("Error deleting blog posts:", error)
      return { success: false, message: error.message }
    }

    // Revalidate paths
    revalidatePath("/admin/blog")
    revalidatePath("/blog")

    return { success: true, message: "All blog posts have been deleted successfully." }
  } catch (error: any) {
    console.error("Error in deleteAllBlogPosts:", error)
    return { success: false, message: error.message || "An error occurred while deleting blog posts." }
  }
}
