"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Heart, Users, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { getPublicImageUrl } from "@/lib/image-utils"
import GoogleAdSense from "@/components/google-adsense"

interface Event {
  id: string
  title: string
  slug: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  phone: string
  image_url: string | null
  featured: boolean
  category_id: string | null
  town_id: string | null
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Town {
  id: string
  name: string
  region: string
}

interface EventDetailsClientProps {
  event: Event
  category: Category | null
  town: Town | null
}

export default function EventDetailsClient({ event, category, town }: EventDetailsClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false)
  const [attendees, setAttendees] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [hasRsvpd, setHasRsvpd] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    checkUser()
    fetchAttendees()
    updateCountdown()

    // Set current URL for sharing
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }

    const interval = setInterval(() => {
      updateCountdown()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        checkUserInteractions(session.user.id)
      }
    } catch (error) {
      console.error("Error checking user:", error)
    }
  }

  const fetchAttendees = async () => {
    try {
      const { count } = await supabase
        .from("rsvps")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)

      setAttendees(count || 0)
    } catch (error) {
      console.error("Error fetching attendees:", error)
    }
  }

  const checkUserInteractions = async (uid: string) => {
    try {
      // Check if user has saved this event
      const { data: savedData } = await supabase
        .from("saved_events")
        .select("*")
        .eq("user_id", uid)
        .eq("event_id", event.id)
        .single()

      setIsSaved(!!savedData)

      // Check if user has RSVP'd to this event
      const { data: rsvpData } = await supabase
        .from("rsvps")
        .select("*")
        .eq("user_id", uid)
        .eq("event_id", event.id)
        .single()

      setHasRsvpd(!!rsvpData)
    } catch (error) {
      console.error("Error checking user interactions:", error)
    }
  }

  const updateCountdown = () => {
    const eventDateTime = new Date(`${event.date}T${event.time}`)
    const now = new Date()
    const diff = eventDateTime.getTime() - now.getTime()

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeLeft({ days, hours, minutes, seconds })
  }

  const handleQuickRsvp = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to RSVP to this event.",
      })
      router.push(`/login?redirect=/events/${event?.slug}`)
      return
    }

    setIsSubmittingRsvp(true)
    try {
      // Check if already RSVP'd
      if (hasRsvpd) {
        // Remove RSVP
        const { error } = await supabase.from("rsvps").delete().eq("user_id", userId).eq("event_id", event.id)

        if (error) throw error

        toast({
          title: "RSVP Removed",
          description: "You are no longer attending this event.",
        })
        setHasRsvpd(false)
        setAttendees(attendees - 1)
      } else {
        // Add RSVP
        const { error } = await supabase.from("rsvps").insert({
          event_id: event.id,
          user_id: userId,
          created_at: new Date().toISOString(),
        })

        if (error) throw error

        toast({
          title: "RSVP Successful",
          description: "You are now attending this event!",
        })
        setHasRsvpd(true)
        setAttendees(attendees + 1)
      }
    } catch (error: any) {
      console.error("Error submitting RSVP:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingRsvp(false)
    }
  }

  const toggleSaveEvent = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save events.",
      })
      router.push(`/login?redirect=/events/${event?.slug}`)
      return
    }

    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase.from("saved_events").delete().eq("user_id", userId).eq("event_id", event.id)

        if (error) throw error
        setIsSaved(false)
        toast({
          title: "Event removed",
          description: "Event removed from your saved list",
        })
      } else {
        // Add to saved
        const { error } = await supabase.from("saved_events").insert({
          event_id: event.id,
          user_id: userId,
          created_at: new Date().toISOString(),
        })

        if (error) throw error
        setIsSaved(true)
        toast({
          title: "Event saved",
          description: "Event added to your saved list",
        })
      }
    } catch (error: any) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update saved events. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addToCalendar = () => {
    const eventDateTime = new Date(`${event.date}T${event.time}`)
    const endDateTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000) // Add 2 hours

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title,
    )}&dates=${eventDateTime.toISOString().replace(/-|:|\.\d+/g, "")}/${endDateTime
      .toISOString()
      .replace(/-|:|\.\d+/g, "")}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(
      event.location,
    )}`

    window.open(googleCalendarUrl, "_blank")
  }

  // Format date
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get image URL for sharing
  const imageUrl = event.image_url ? getPublicImageUrl(event.image_url) : null

  return (
    <main className="pb-20">
      <div className="relative h-64 sm:h-80 md:h-96">
        <Image
          src={event.image_url ? getPublicImageUrl(event.image_url) : "/placeholder.svg?height=800&width=600"}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <Link href="/" className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
      </div>

      <div className="container px-4 mx-auto -mt-16 relative z-10">
        <Card className="overflow-hidden animate-slide-up">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                {category && (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#b0468e]/10 text-[#b0468e] mb-2">
                    {category.name}
                  </span>
                )}
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <p className="text-muted-foreground mt-2">{event.description}</p>
              </div>

              {/* First Ad - After description - 350x50 only */}
              <GoogleAdSense />

              {/* Countdown Timer */}
              <div className="bg-[#b0468e]/5 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3 text-center">Event Countdown</h2>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-2xl font-bold text-[#b0468e]">{timeLeft.days}</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-2xl font-bold text-[#b0468e]">{timeLeft.hours}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-2xl font-bold text-[#b0468e]">{timeLeft.minutes}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
                    <div className="text-2xl font-bold text-[#b0468e]">{timeLeft.seconds}</div>
                    <div className="text-xs text-muted-foreground">Seconds</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(`2000-01-01T${event.time}`).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location}
                      {town && `, ${town.name}, ${town.region}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 dark:bg-pink-900 p-2 rounded-full">
                    <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Organizer</p>
                    <p className="text-sm text-muted-foreground">{event.organizer || "Event Organizer"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                      <span className="text-pink-600 dark:text-pink-400 font-bold">{attendees}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">People Going</p>
                      <p className="text-sm text-muted-foreground">Join them now!</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{event.phone || "Contact organizer"}</p>
                  </div>
                </div>
              </div>

              {/* Second Ad - Before buttons - 350x50 only */}
              <GoogleAdSense />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className={`flex-1 ${
                    hasRsvpd ? "bg-green-600 hover:bg-green-700" : "bg-[#b0468e] hover:opacity-90"
                  } text-white transition-colors`}
                  onClick={handleQuickRsvp}
                  disabled={isSubmittingRsvp}
                >
                  {isSubmittingRsvp ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ThumbsUp className={`h-4 w-4 mr-2 ${hasRsvpd ? "fill-white" : ""}`} />
                      {hasRsvpd ? "I'm Going!" : "RSVP Now"}
                    </>
                  )}
                </Button>

                <Button variant="outline" className="flex-1" onClick={addToCalendar}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Add to Calendar
                </Button>

                <Button variant="outline" size="icon" className="rounded-full" onClick={toggleSaveEvent}>
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-[#b0468e] text-[#b0468e]" : ""}`} />
                  <span className="sr-only">Save</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: event.title,
                          text: `Check out this event: ${event.title}`,
                          url: currentUrl,
                        })
                        .catch((err) => {
                          if (err.name !== "AbortError") {
                            console.error("Error sharing:", err)
                            navigator.clipboard.writeText(currentUrl)
                            toast({
                              title: "Link copied",
                              description: "Event link copied to clipboard",
                            })
                          }
                        })
                    } else {
                      navigator.clipboard.writeText(currentUrl)
                      toast({
                        title: "Link copied",
                        description: "Event link copied to clipboard",
                      })
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
