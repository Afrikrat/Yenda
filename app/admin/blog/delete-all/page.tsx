"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteAllBlogPosts } from "@/app/actions/delete-blog-posts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function DeleteAllBlogPostsPage() {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDeleteAll = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteAllBlogPosts()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/admin/blog")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting blog posts:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Delete All Blog Posts
          </CardTitle>
          <CardDescription className="text-center">
            This action will permanently delete all blog posts. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
            <p className="text-red-700 text-sm">
              Warning: You are about to delete all blog posts from the database. This action is permanent and cannot be
              reversed. Make sure you have a backup if you need this data in the future.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button variant="destructive" className="w-full" onClick={handleDeleteAll} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Yes, Delete All Blog Posts"}
          </Button>
          <Link href="/admin/blog" className="w-full">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
