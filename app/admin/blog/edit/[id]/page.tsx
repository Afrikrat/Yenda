"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Calendar, ImageIcon, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import slugify from "slugify"

interface BlogEditPageProps {
  params: {
    id: string
  }
}

export default function BlogEditPage({ params }: BlogEditPageProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState("draft")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogPost()
  }, [params.id])

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

      if (error) throw error

      if (data) {
        setTitle(data.title || "")
        setSlug(data.slug || "")
        setExcerpt(data.excerpt || "")
        setContent(data.content || "")
        setAuthor(data.author || "")
        setImageUrl(data.image_url || "")
        setStatus(data.status || "draft")
      }
    } catch (error: any) {
      console.error("Error fetching blog post:", error)
      setError(error.message || "Failed to load blog post")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    // Only auto-generate slug if it's empty or matches the current title
    if (!slug || slug === slugify(title, { lower: true, strict: true })) {
      setSlug(slugify(newTitle, { lower: true, strict: true }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from("blog_posts")
        .update({
          title,
          slug,
          excerpt,
          content,
          author,
          image_url: imageUrl || null,
          status,
          updated_at: now,
        })
        .eq("id", params.id)
        .select()

      if (error) {
        console.error("Error updating blog post:", error)
        throw error
      }

      console.log("Blog post updated:", data)

      toast({
        title: "Blog post updated",
        description: status === "published" ? "Your post has been published." : "Your post has been saved as a draft.",
      })

      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error updating blog post:", error)
      setError(error.message || "Failed to update blog post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="container px-4 py-6 mx-auto flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b0468e] mx-auto mb-4"></div>
            <p className="text-lg">Loading blog post...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/admin/blog">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <span className="text-xl font-bold">Edit Blog Post</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setStatus("draft")
                handleSubmit(new Event("submit") as any)
              }}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button
              className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
              onClick={() => {
                setStatus("published")
                handleSubmit(new Event("submit") as any)
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update & Publish"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
                <CardDescription>Basic information about your blog post.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input id="title" placeholder="Enter post title" value={title} onChange={handleTitleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" placeholder="post-url-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                  <p className="text-xs text-muted-foreground">
                    This will be used in the URL: yenda.com/blog/{slug || "post-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of your post"
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog post content here..."
                    className="min-h-[300px]"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">You can use HTML tags for formatting.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Add a featured image for your blog post.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL for your featured image or upload one below.
                  </p>
                </div>

                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <div className="bg-muted rounded-full p-3 mb-3">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Upload Featured Image</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your image here, or click to browse
                  </p>
                  <Button variant="outline" className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG or GIF, max 5MB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication Settings</CardTitle>
                <CardDescription>Configure your post settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Publication Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured Post</Label>
                    <p className="text-sm text-muted-foreground">Display this post prominently on the blog page.</p>
                  </div>
                  <Switch id="featured" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="culture">Culture</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
                  onClick={() => {
                    setStatus("published")
                    handleSubmit(new Event("submit") as any)
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update & Publish"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your post for search engines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" placeholder="SEO title" defaultValue={title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" placeholder="SEO description" rows={3} defaultValue={excerpt} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
