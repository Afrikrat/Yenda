"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Eye, Plus, Search, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BlogPost {
  id: string
  title: string
  slug: string
  created_at: string // Changed from date to created_at
  status: string
  image_url: string | null
  excerpt: string | null
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, statusFilter])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, created_at, status, image_url, excerpt") // Changed from date to created_at
        .order("created_at", { ascending: false }) // Changed from date to created_at

      if (error) throw error
      setPosts(data || [])
      setFilteredPosts(data || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = [...posts]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      })

      // Refresh posts list
      fetchPosts()
    } catch (error: any) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAllPosts = async () => {
    try {
      const { error } = await supabase.from("blog_posts").delete().not("id", "eq", "placeholder")
      if (error) throw error

      toast({
        title: "All blog posts deleted",
        description: "All blog posts have been successfully deleted.",
      })

      // Refresh posts list
      fetchPosts()
    } catch (error: any) {
      console.error("Error deleting all blog posts:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete all blog posts. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">All Blog Posts</h1>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete All Posts</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete All Blog Posts</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete ALL blog posts? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteAllPosts}>
                  Delete All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link href="/admin/blog/new">
            <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Add New Post
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b0468e]"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search filters."
              : "Create your first blog post to get started."}
          </p>
          <Link href="/admin/blog/new">
            <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Post</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={post.image_url || "/placeholder.svg?height=200&width=300"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-medium block">{post.title}</span>
                          {post.excerpt && (
                            <span className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 align-middle">
                      {post.status === "published" ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/blog/edit/${post.id}`}>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Blog Post</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this blog post? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDeletePost(post.id)}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}
