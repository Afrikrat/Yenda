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

interface Event {
  id: string
  title: string
  slug: string
  location: string
  date: string
  time: string
  featured: boolean
  published: boolean
  image_url: string | null
  category_id: string | null
  categories?: { name: string } | null
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, statusFilter])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("events")
        .select(`
          id, 
          title, 
          slug, 
          location, 
          date, 
          time, 
          featured, 
          published, 
          image_url, 
          category_id,
          categories(name)
        `)
        .order("date", { ascending: false })

      if (error) throw error
      setEvents(data || [])
      setFilteredEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "published") {
        filtered = filtered.filter((event) => event.published)
      } else if (statusFilter === "draft") {
        filtered = filtered.filter((event) => !event.published)
      } else if (statusFilter === "featured") {
        filtered = filtered.filter((event) => event.featured)
      }
    }

    setFilteredEvents(filtered)
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

  return (
    <main className="container px-4 py-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">All Events</h1>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
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
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
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
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search filters."
              : "Create your first event to get started."}
          </p>
          <Link href="/admin/events/new">
            <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Event</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Date & Time</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
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
                        <div>
                          <span className="font-medium block">{event.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {event.categories?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">{event.location}</td>
                    <td className="p-4 align-middle">
                      <div>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">{event.time.substring(0, 5)}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-1">
                        {event.published ? (
                          <Badge className="w-fit bg-green-500 hover:bg-green-600">Published</Badge>
                        ) : (
                          <Badge className="w-fit" variant="outline">
                            Draft
                          </Badge>
                        )}
                        {event.featured && <Badge className="w-fit bg-[#b0468e] hover:bg-[#b0468e]/90">Featured</Badge>}
                      </div>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}
