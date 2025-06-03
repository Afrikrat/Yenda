"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Clock, Filter, LayoutGrid, List, RefreshCw } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import GoogleAdSense from "@/components/google-adsense"

interface Event {
  id: string
  title: string
  slug: string
  date: string
  time: string
  location: string
  image_url: string | null
  featured: boolean
  categories?: { name: string } | null
  category_id?: string | null
  town_id?: string | null
}

interface EventsListProps {
  initialEvents?: Event[]
}

export default function EventsList({ initialEvents = [] }: EventsListProps) {
  const isMobile = useIsMobile()
  const [viewMode, setViewMode] = useState<"grid" | "list">(isMobile ? "list" : "grid")
  const [events, setEvents] = useState<Event[]>(initialEvents || [])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Set default view mode based on device
    setViewMode(isMobile ? "list" : "grid")
  }, [isMobile])

  useEffect(() => {
    // When search params change, fetch filtered events
    fetchFilteredEvents()
  }, [searchParams, retryCount])

  const fetchFilteredEvents = async () => {
    setIsLoading(true)
    setFetchError(false)

    try {
      // First check if we have cached results for this search
      const searchKey = searchParams.toString() || "default"
      const cachedEvents = localStorage.getItem(`cached_events_${searchKey}`)

      if (cachedEvents && (!initialEvents || initialEvents.length === 0)) {
        const parsedEvents = JSON.parse(cachedEvents)
        if (parsedEvents && parsedEvents.length > 0) {
          setEvents(parsedEvents)
          setHasMore((parsedEvents?.length || 0) >= 12)
          setIsLoading(false)
          return
        }
      }

      let query = supabase
        .from("events")
        .select(`
          id, 
          title, 
          slug, 
          date, 
          time, 
          location, 
          image_url,
          featured,
          category_id,
          town_id,
          categories(name)
        `)
        .eq("published", true)

      // Apply search filters
      const q = searchParams.get("q")
      const location = searchParams.get("location")
      const category = searchParams.get("category")
      const dateMin = searchParams.get("dateMin")
      const dateMax = searchParams.get("dateMax")

      // Search term filter
      if (q) {
        query = query.ilike("title", `%${q}%`)
      }

      // Location filter
      if (location && location !== "all") {
        query = query.eq("town_id", location)
      }

      // Category filter
      if (category && category !== "all") {
        query = query.eq("category_id", category)
      }

      // Date range filter
      if (dateMin && dateMax) {
        const today = new Date()
        const minDate = new Date(today)
        minDate.setDate(today.getDate() + Number.parseInt(dateMin))

        const maxDate = new Date(today)
        maxDate.setDate(today.getDate() + Number.parseInt(dateMax))

        query = query.gte("date", minDate.toISOString().split("T")[0]).lte("date", maxDate.toISOString().split("T")[0])
      }

      // Order by date
      query = query.order("date", { ascending: true })

      // Limit results
      const { data, error } = await query.limit(12)

      if (error) {
        throw error
      }

      setEvents(data || [])
      setHasMore((data?.length || 0) >= 12)

      // Cache the results
      if (data && data.length > 0) {
        localStorage.setItem(`cached_events_${searchKey}`, JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error fetching filtered events:", error)
      setFetchError(true)

      // If we have initial events, use them as fallback
      if (initialEvents && initialEvents.length > 0 && events.length === 0) {
        setEvents(initialEvents)
      }

      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMoreEvents = async () => {
    if (!hasMore || isLoading || !events || events.length === 0) return

    setIsLoading(true)
    try {
      const lastEvent = events[events.length - 1]

      let query = supabase
        .from("events")
        .select(`
          id, 
          title, 
          slug, 
          date, 
          time, 
          location, 
          image_url, 
          featured,
          category_id,
          town_id,
          categories(name)
        `)
        .eq("published", true)
        .gt("date", lastEvent.date) // Get events after the last one

      // Apply the same filters as above
      const q = searchParams.get("q")
      const location = searchParams.get("location")
      const category = searchParams.get("category")
      const dateMin = searchParams.get("dateMin")
      const dateMax = searchParams.get("dateMax")

      if (q) query = query.ilike("title", `%${q}%`)
      if (location && location !== "all") query = query.eq("town_id", location)
      if (category && category !== "all") query = query.eq("category_id", category)

      if (dateMin && dateMax) {
        const today = new Date()
        const minDate = new Date(today)
        minDate.setDate(today.getDate() + Number.parseInt(dateMin))

        const maxDate = new Date(today)
        maxDate.setDate(today.getDate() + Number.parseInt(dateMax))

        query = query.gte("date", minDate.toISOString().split("T")[0]).lte("date", maxDate.toISOString().split("T")[0])
      }

      query = query.order("date", { ascending: true })

      const { data, error } = await query.limit(6)

      if (error) throw error

      setEvents([...events, ...(data || [])])
      setHasMore((data?.length || 0) >= 6)
    } catch (error) {
      console.error("Error loading more events:", error)
      toast({
        title: "Error",
        description: "Failed to load more events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(retryCount + 1)
  }

  // Ensure events is always an array
  const safeEvents = events || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Upcoming Events</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-l-full rounded-r-none"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">Grid</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-r-full rounded-l-none"
          >
            <List className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">List</span>
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              There was an error loading events. Using cached data if available.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {isLoading && safeEvents.length === 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden h-64 animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-800"></div>
              <CardContent className="p-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : safeEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters to find events.</p>
            <Button
              className="mt-4 bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
              onClick={() => {
                // Clear all search params
                window.location.href = "/"
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            className={cn(
              "grid gap-4",
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1",
            )}
          >
            {safeEvents.map((event, index) => (
              <React.Fragment key={event.id}>
                <EventCard event={event} viewMode={viewMode} />
                {/* Show ad after every 3rd event */}
                {(index + 1) % 3 === 0 && index < safeEvents.length - 1 && (
                  <div className={cn("flex justify-center items-center", viewMode === "grid" ? "col-span-full" : "")}>
                    <GoogleAdSense adSlot="1234567890" adFormat="horizontal" width={320} height={50} className="my-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" onClick={loadMoreEvents} disabled={isLoading} className="min-w-[200px]">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b0468e] mr-2"></div>
                    Loading...
                  </>
                ) : (
                  "Load More Events"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface EventCardProps {
  event: Event
  viewMode: "grid" | "list"
}

function EventCard({ event, viewMode }: EventCardProps) {
  // Format date
  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  // Calculate days remaining
  const today = new Date()
  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <Link href={`/events/${event.slug}`}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 hover:shadow-md",
          viewMode === "list" ? "flex flex-row h-32" : "h-full",
        )}
      >
        <div className={cn("relative", viewMode === "list" ? "w-32 h-full" : "h-48")}>
          <Image
            src={event.image_url || "/placeholder.svg?height=600&width=400"}
            alt={event.title}
            fill
            className="object-cover"
          />
          {event.featured && (
            <div className="absolute top-2 left-2 bg-[#b0468e] text-white text-xs px-2 py-1 rounded-full">Featured</div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {diffDays > 0 ? `${diffDays} days left` : "Today"}
          </div>
        </div>
        <CardContent className={cn("p-3", viewMode === "list" ? "flex-1" : "")}>
          <div className="space-y-2">
            <div>
              <h3 className={cn("font-semibold line-clamp-1", viewMode === "list" ? "text-base" : "text-sm")}>
                {event.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{event.time.substring(0, 5)}</span>
              </div>
            </div>
            {viewMode === "list" && (
              <Button
                size="sm"
                className="mt-2 w-full sm:w-auto bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
              >
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
