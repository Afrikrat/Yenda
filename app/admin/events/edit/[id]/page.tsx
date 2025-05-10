"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Calendar, Clock, MapPin, Phone, QrCode } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import MediaUpload from "@/components/media-upload"

interface Town {
  id: string
  name: string
  region: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface EventData {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string
  location: string
  town_id: string | null
  organizer: string
  phone: string
  image_url: string | null
  category_id: string | null
  featured: boolean
  published: boolean
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<EventData | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [townId, setTownId] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [phone, setPhone] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [showQrCode, setShowQrCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [towns, setTowns] = useState<Town[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*").eq("id", params.id).single()

        if (error) throw error
        if (!data) throw new Error("Event not found")

        setEvent(data)
        setTitle(data.title || "")
        setSlug(data.slug || "")
        setDescription(data.description || "")
        setDate(data.date ? data.date.split("T")[0] : "")
        setTime(data.time || "")
        setLocation(data.location || "")
        setTownId(data.town_id || "")
        setOrganizer(data.organizer || "")
        setPhone(data.phone || "")
        setImageUrl(data.image_url || "")
        setCategoryId(data.category_id || "")
        setIsFeatured(data.featured || false)
        setIsPublished(data.published || true)
      } catch (error) {
        console.error("Error fetching event:", error)
        toast({
          title: "Error",
          description: "Failed to load event data. Please try again.",
          variant: "destructive",
        })
        router.push("/admin")
      }
    }

    const loadData = async () => {
      setIsLoading(true)
      try {
        await fetchEvent()
        await Promise.all([fetchTowns(), fetchCategories()])
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id, router, toast])

  const fetchTowns = async () => {
    try {
      const { data, error } = await supabase.from("towns").select("*").order("name", { ascending: true })

      if (error) throw error
      setTowns(data || [])
    } catch (error) {
      console.error("Error fetching towns:", error)
      setTowns([])
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    if (!title || !date || !location) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const now = new Date().toISOString()

      const { error } = await supabase
        .from("events")
        .update({
          title,
          slug,
          description,
          date,
          time,
          location,
          town_id: townId || null,
          organizer,
          phone,
          image_url: imageUrl || null,
          category_id: categoryId || null,
          featured: isFeatured,
          published: saveAsDraft ? false : isPublished,
          updated_at: now,
        })
        .eq("id", params.id)

      if (error) throw error

      toast({
        title: saveAsDraft ? "Event saved as draft" : "Event updated",
        description: saveAsDraft
          ? "Your event has been saved as a draft."
          : "Your event has been updated successfully.",
      })

      router.push("/admin")
    } catch (error: any) {
      console.error("Error updating event:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="container flex items-center justify-between h-16 px-4 mx-auto">
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <span className="text-xl font-bold">Edit Event</span>
            </div>
          </div>
        </header>

        <div className="container px-4 py-6 mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b0468e] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading event data...</p>
            </div>
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
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <span className="text-xl font-bold">Edit Event</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
              Save as Draft
            </Button>
            <Button
              className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Basic information about your event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="event-url-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used in the URL: yenda.com/events/{slug || "event-slug"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event"
                    className="min-h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-10"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        className="pl-10"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Event location"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    placeholder="Event organizer"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="Contact phone number"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Media</CardTitle>
                <CardDescription>Upload images for your event.</CardDescription>
              </CardHeader>
              <CardContent>
                {imageUrl && (
                  <div className="mb-4">
                    <p className="text-sm mb-2">Current image:</p>
                    <div className="relative h-40 w-full rounded-md overflow-hidden">
                      <img src={imageUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
                    </div>
                  </div>
                )}
                <MediaUpload onImageSelected={setImageUrl} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure additional settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="featured">Featured Event</Label>
                    <p className="text-sm text-muted-foreground">Display this event prominently on the homepage.</p>
                  </div>
                  <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="published">Published</Label>
                    <p className="text-sm text-muted-foreground">Make this event visible to users.</p>
                  </div>
                  <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="qr-code">Generate QR Code</Label>
                    <p className="text-sm text-muted-foreground">Create a QR code for this event.</p>
                  </div>
                  <Switch id="qr-code" checked={showQrCode} onCheckedChange={setShowQrCode} />
                </div>

                {showQrCode && (
                  <div className="mt-4 p-4 border rounded-lg flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg mb-3">
                      <QrCode className="h-32 w-32 text-black" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Download QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Event"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Select the town/city for this event.</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={townId} onValueChange={setTownId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select town/city" />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map((town) => (
                      <SelectItem key={town.id} value={town.id}>
                        {town.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
