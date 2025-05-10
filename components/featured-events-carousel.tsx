"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase, refreshToken } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface Event {
  id: string
  title: string
  slug: string
  date: string
  location: string
  image_url: string | null
  featured: boolean
}

export default function FeaturedEventsCarousel() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchFeaturedEvents()
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (events.length > 1) {
      startAutoplay()
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [events, currentIndex])

  const fetchFeaturedEvents = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, slug, date, location, image_url, featured")
        .eq("featured", true)
        .eq("published", true)
        .order("date", { ascending: true })
        .limit(5)

      if (error) {
        console.error("Error fetching featured events:", error)

        // If JWT expired, try to refresh the token and fetch again
        if (error.message.includes("JWT")) {
          const refreshed = await refreshToken()
          if (refreshed) {
            const { data: refreshedData, error: refreshedError } = await supabase
              .from("events")
              .select("id, title, slug, date, location, image_url, featured")
              .eq("featured", true)
              .eq("published", true)
              .order("date", { ascending: true })
              .limit(5)

            if (refreshedError) {
              console.error("Error after token refresh:", refreshedError)
              throw refreshedError
            }

            setEvents(refreshedData || [])
            return
          }
        }

        throw error
      }

      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching featured events:", error)
      toast({
        title: "Error",
        description: "Failed to load featured events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
    }

    autoplayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Loading featured events...</div>
      </div>
    )
  }

  if (events.length === 0) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div ref={carouselRef} className="relative h-64 sm:h-80 overflow-hidden rounded-xl">
        {events.map((event, index) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="relative h-full w-full">
              <Image
                src={event.image_url || "/placeholder.svg?height=600&width=1200"}
                alt={event.title}
                fill
                className="object-cover"
                priority={index === currentIndex}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#b0468e] mb-2">
                  Featured
                </div>
                <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span className="truncate max-w-[200px]">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
        onClick={(e) => {
          e.preventDefault()
          prevSlide()
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
        onClick={(e) => {
          e.preventDefault()
          nextSlide()
        }}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex gap-1">
        {events.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/30"}`}
            onClick={(e) => {
              e.preventDefault()
              goToSlide(index)
            }}
          />
        ))}
      </div>
    </div>
  )
}
