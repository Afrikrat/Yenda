"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { Loader2, Plus, Trash, Edit, Eye, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MediaUpload } from "@/components/media-upload"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Story {
  id: string
  title: string
  subtitle: string
  image_url: string
  event_id: string | null
  active: boolean
  created_at: string
  event?: {
    id: string
    title: string
  }
}

interface Event {
  id: string
  title: string
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [eventId, setEventId] = useState("")
  const [active, setActive] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchStories()
    fetchEvents()
  }, [])

  const fetchStories = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          *,
          event:event_id (
            id,
            title
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error("Error fetching stories:", error)
      toast({
        title: "Error",
        description: "Failed to load stories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from("events").select("id, title").order("date", { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!title || !subtitle || !imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const storyData = {
        title,
        subtitle,
        image_url: imageUrl,
        event_id: eventId || null,
        active,
        created_at: new Date().toISOString(),
      }

      if (editingId) {
        // Update existing story
        const { error } = await supabase.from("stories").update(storyData).eq("id", editingId)
        if (error) throw error

        toast({
          title: "Story updated",
          description: "The story has been updated successfully.",
        })
      } else {
        // Create new story
        const { error } = await supabase.from("stories").insert(storyData)
        if (error) throw error

        toast({
          title: "Story created",
          description: "The story has been created successfully.",
        })
      }

      // Reset form and refresh stories
      resetForm()
      fetchStories()
    } catch (error: any) {
      console.error("Error saving story:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (story: Story) => {
    setEditingId(story.id)
    setTitle(story.title)
    setSubtitle(story.subtitle)
    setImageUrl(story.image_url)
    setEventId(story.event_id || "")
    setActive(story.active)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("stories").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "Story deleted",
        description: "The story has been deleted successfully.",
      })

      // Refresh stories
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

  const resetForm = () => {
    setEditingId(null)
    setTitle("")
    setSubtitle("")
    setImageUrl("")
    setEventId("")
    setActive(true)
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
          <h1 className="text-2xl font-bold">Manage Stories</h1>
        </div>
        <Link href="/stories" target="_blank">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Stories
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Story" : "Create New Story"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter story title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Enter story subtitle or description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Story Image</Label>
                <MediaUpload value={imageUrl} onChange={setImageUrl} accept="image/*" maxSize={5} className="w-full" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Related Event (Optional)</Label>
                <Select value={eventId} onValueChange={setEventId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" checked={active} onCheckedChange={setActive} />
                <Label htmlFor="active">Active</Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                className="bg-[#b0468e] text-white hover:opacity-90"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {editingId ? "Update Story" : "Create Story"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stories</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#b0468e]" />
                </div>
              ) : stories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No stories found. Create your first story!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stories.map((story) => (
                    <Card key={story.id} className="overflow-hidden">
                      <div className="relative h-40">
                        <Image
                          src={story.image_url || "/placeholder.svg?height=400&width=600"}
                          alt={story.title}
                          fill
                          className="object-cover"
                        />
                        {!story.active && (
                          <div className="absolute top-2 right-2 bg-gray-800/80 text-white text-xs px-2 py-1 rounded-full">
                            Inactive
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold truncate">{story.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{story.subtitle}</p>
                        {story.event && (
                          <div className="mt-2 text-xs bg-[#b0468e]/10 text-[#b0468e] px-2 py-1 rounded-full inline-block">
                            Event: {story.event.title}
                          </div>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(story)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash className="h-4 w-4" />
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
                                <Button variant="destructive" onClick={() => handleDelete(story.id)}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
