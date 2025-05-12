"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteAllBlogPosts } from "@/app/actions/delete-all-blog-posts"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
        // Redirect to blog admin page after successful deletion
        router.push("/admin/blog")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting blog posts.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="container px-4 py-6 mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/blog">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Delete All Blog Posts</h1>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-600">Warning: Destructive Action</CardTitle>
          <CardDescription className="text-center">
            This will permanently delete ALL blog posts from the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Are you absolutely sure you want to delete all blog posts? This action cannot be undone and will remove all
            blog content from your site.
          </p>
          <p className="text-sm text-muted-foreground">
            If you only want to delete specific posts, please go back to the blog admin page and delete them
            individually.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin/blog">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete All Blog Posts
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
