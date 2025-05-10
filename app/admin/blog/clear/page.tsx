"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ClearBlogDataPage() {
  const [isClearing, setIsClearing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleClearBlogData = async () => {
    try {
      setIsClearing(true)

      // Clear blog posts
      const { error } = await supabase.from("blog_posts").delete().not("id", "eq", "placeholder")

      if (error) {
        throw new Error(`Failed to clear blog posts: ${error.message}`)
      }

      toast({
        title: "Success",
        description: "All blog posts have been cleared successfully!",
      })

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh()
        router.push("/admin/blog")
      }, 1500)
    } catch (error: any) {
      console.error("Error clearing blog data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to clear blog data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin/blog" className="flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Blog Management
      </Link>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Clear Blog Data
          </CardTitle>
          <CardDescription>
            This action will delete all blog posts from the database. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200 mb-4">
            <p className="text-amber-800 text-sm">
              <strong>Warning:</strong> This will permanently delete all blog posts. Make sure you have a backup if you
              need to restore this data later.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/blog">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleClearBlogData}
            disabled={isClearing}
            className="flex items-center"
          >
            {isClearing ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Blog Posts
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
