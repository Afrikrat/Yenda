"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Tag, PlusCircle, Trash2, Film, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Event {
  id: string
  title: string
  slug: string
  location: string
  date: string
  featured: boolean
  image_url: string | null
}

interface BlogPost {
  id: string
  title: string
  slug: string
  created_at: string
  status: string
  image_url: string | null
}

interface User {
  id: string
  full_name: string | null
  email: string
  created_at: string
}

interface Story {
  id: string
  title: string
  subtitle: string
  image_url: string
  active: boolean
  created_at: string
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalEvents, setTotalEvents] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalStories, setTotalStories] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchEvents(), fetchBlogPosts(), fetchUsers(), fetchStories()])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data, error, count } = await supabase
        .from("events")
        .select("id, title, slug, location, date, featured, image_url", { count: "exact" })
        .order("date", { ascending: false })
        .limit(5)

      if (error) throw error
      setEvents(data || [])
      setTotalEvents(count || 0)
    } catch (error) {
      console.error("Error fetching events:", error)
      setEvents([])
      setTotalEvents(0)
    }
  }

  const fetchBlogPosts = async () => {
    try {
      const { data, error, count } = await supabase
        .from("blog_posts")
        .select("id, title, slug, created_at, status, image_url", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setBlogPosts(data || [])
      setTotalPosts(count || 0)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setBlogPosts([])
      setTotalPosts(0)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error, count } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setUsers(data || [])
      setTotalUsers(count || 0)
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
      setTotalUsers(0)
    }
  }

  const fetchStories = async () => {
    try {
      const { data, error, count } = await supabase
        .from("stories")
        .select("id, title, subtitle, image_url, active, created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setStories(data || [])
      setTotalStories(count || 0)
    } catch (error) {
      console.error("Error fetching stories:", error)
      setStories([])
      setTotalStories(0)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      })

      // Refresh events list
      fetchEvents()
    } catch (error: any) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBlogPost = async (id: string) => {
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      })

      // Refresh blog posts list
      fetchBlogPosts()
    } catch (error: any) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStory = async (id: string) => {
    try {
      const { error } = await supabase.from("stories").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Story deleted",
        description: "The story has been successfully deleted.",
      })

      // Refresh stories list
      fetchStories()
    } catch (error: any) {
      console.error("Error deleting story:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete story. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Events in the system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Events</h2>
            <div className="flex gap-2">
              <Link href="/admin/categories">
                <Button variant="outline" className="flex items-center gap-1">
                  <Tag className="h-4 w-4 mr-2" />
                  Categories
                </Button>
              </Link>
              <Link href="/admin/events/new">
                <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Event
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Event</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b0468e]"></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Loading events...</p>
                          </td>
                        </tr>
                      ) : events.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center">
                            <p className="text-gray-500">No events found. Add your first event!</p>
                            <Link href="/admin/events/new" className="mt-2 inline-block">
                              <Button size="sm" className="bg-[#b0468e] text-white hover:opacity-90">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Event
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        events.map((event) => (
                          <tr
                            key={event.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={event.image_url || "/placeholder.svg?height=200&width=300"}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium">{event.title}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{event.location}</td>
                            <td className="p-4 align-middle">
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-4 align-middle">
                              {event.featured ? (
                                <Badge className="bg-[#b0468e] hover:bg-[#b0468e]/90">Featured</Badge>
                              ) : (
                                <Badge variant="outline">Standard</Badge>
                              )}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Link href={`/events/${event.slug}`} target="_blank">
                                  <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </Link>
                                <Link href={`/admin/events/edit/${event.id}`}>
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
                                      <DialogTitle>Delete Event</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this event? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{events.length}</strong> of <strong>{totalEvents}</strong> events
              </div>
              <div className="flex gap-2">
                <Link href="/admin/events">
                  <Button variant="outline">View All Events</Button>
                </Link>
                <Link href="/admin/events/new">
                  <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Blog Posts</h2>
            <Link href="/admin/blog/new">
              <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Post
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
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
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b0468e]"></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Loading blog posts...</p>
                          </td>
                        </tr>
                      ) : blogPosts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            <p className="text-gray-500">No blog posts found. Add your first post!</p>
                            <Link href="/admin/blog/new" className="mt-2 inline-block">
                              <Button size="sm" className="bg-[#b0468e] text-white hover:opacity-90">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Post
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        blogPosts.map((post) => (
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
                                <span className="font-medium">{post.title}</span>
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
                                <Badge className="bg-[#b0468e] hover:bg-[#b0468e]/90">Published</Badge>
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
                                      <Button variant="destructive" onClick={() => handleDeleteBlogPost(post.id)}>
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{blogPosts.length}</strong> of <strong>{totalPosts}</strong> posts
              </div>
              <div className="flex gap-2">
                <Link href="/admin/blog">
                  <Button variant="outline">View All Posts</Button>
                </Link>
                <Link href="/admin/blog/clear">
                  <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Blog Data
                  </Button>
                </Link>
                <Link href="/admin/blog/new">
                  <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Stories</h2>
            <Link href="/admin/stories">
              <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Story
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Story</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b0468e]"></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Loading stories...</p>
                          </td>
                        </tr>
                      ) : stories.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            <p className="text-gray-500">No stories found. Add your first story!</p>
                            <Link href="/admin/stories" className="mt-2 inline-block">
                              <Button size="sm" className="bg-[#b0468e] text-white hover:opacity-90">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create Story
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        stories.map((story) => (
                          <tr
                            key={story.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="relative h-10 w-16 rounded overflow-hidden flex-shrink-0">
                                  <Image
                                    src={story.image_url || "/placeholder.svg?height=200&width=300"}
                                    alt={story.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="font-medium block">{story.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {story.subtitle.substring(0, 30)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              {new Date(story.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-4 align-middle">
                              {story.active ? (
                                <Badge className="bg-[#b0468e] hover:bg-[#b0468e]/90">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Link href="/stories" target="_blank">
                                  <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                  </Button>
                                </Link>
                                <Link href="/admin/stories">
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
                                      <DialogTitle>Delete Story</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this story? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button variant="destructive" onClick={() => handleDeleteStory(story.id)}>
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{stories.length}</strong> of <strong>{totalStories}</strong> stories
              </div>
              <div className="flex gap-2">
                <Link href="/admin/stories">
                  <Button variant="outline">Manage All Stories</Button>
                </Link>
                <Link href="/admin/stories">
                  <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Users</h2>
            <Link href="/admin/users/new">
              <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Joined</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#b0468e]"></div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-4 text-center">
                            <p className="text-gray-500">No users found.</p>
                            <Link href="/admin/users/new" className="mt-2 inline-block">
                              <Button size="sm" className="bg-[#b0468e] text-white hover:opacity-90">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create User
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#b0468e]/10 flex items-center justify-center flex-shrink-0">
                                  <span className="text-[#b0468e] text-sm font-medium">
                                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                                  </span>
                                </div>
                                <span className="font-medium">{user.full_name || "Unnamed User"}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{user.email}</td>
                            <td className="p-4 align-middle">
                              {new Date(user.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Link href={`/admin/users/edit/${user.id}`}>
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
                                      <DialogTitle>Delete User</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this user? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline">Cancel</Button>
                                      <Button variant="destructive">Delete</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{users.length}</strong> of <strong>{totalUsers}</strong> users
              </div>
              <div className="flex gap-2">
                <Link href="/admin/users">
                  <Button variant="outline">View All Users</Button>
                </Link>
                <Link href="/admin/users/new">
                  <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Events Management */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 mr-2 text-[#b0468e]" />
            <h2 className="text-xl font-semibold">Events</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage events, create new ones, or edit existing events.</p>
          <div className="flex flex-col space-y-2">
            <Link href="/admin/events/new">
              <Button className="w-full bg-[#b0468e] hover:bg-[#b0468e]/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </Link>
            <Link href="/admin/events">
              <Button variant="outline" className="w-full">
                View All Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Blog Management */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <BookOpen className="h-6 w-6 mr-2 text-[#b0468e]" />
            <h2 className="text-xl font-semibold">Blog</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage blog posts, create new articles, or edit existing content.</p>
          <div className="flex flex-col space-y-2">
            <Link href="/admin/blog/new">
              <Button className="w-full bg-[#b0468e] hover:bg-[#b0468e]/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Link>
            <Link href="/admin/blog">
              <Button variant="outline" className="w-full">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>

        {/* Stories Management */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Film className="h-6 w-6 mr-2 text-[#b0468e]" />
            <h2 className="text-xl font-semibold">Stories</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage stories, create new content, or edit existing stories.</p>
          <div className="flex flex-col space-y-2">
            <Link href="/admin/stories">
              <Button className="w-full bg-[#b0468e] hover:bg-[#b0468e]/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Manage Stories
              </Button>
            </Link>
            <Link href="/stories">
              <Button variant="outline" className="w-full">
                View Stories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
