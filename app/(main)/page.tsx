"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import FeaturedEventsCarousel from "@/components/featured-events-carousel"
import EventsList from "@/components/events-list"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image_url?: string
  category: string
  slug: string
  featured: boolean
  created_at: string
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      // Fetch all events
      const { data: allEvents, error } = await supabase.from("events").select("*").order("date", { ascending: true })

      if (error) {
        console.error("Error fetching events:", error)
        return
      }

      setEvents(allEvents || [])

      // Filter featured events
      const featured = allEvents?.filter((event) => event.featured) || []
      setFeaturedEvents(featured)

      console.log("Featured events:", featured) // Debug log
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase() || "")
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#b0468e]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Featured Events - Now placed BEFORE search */}
        {featuredEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Featured Events</h2>
            <FeaturedEventsCarousel />
          </section>
        )}

        {/* Search Section - Now AFTER carousel */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* All Events */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {searchQuery || selectedCategory !== "all" ? "Search Results" : "All Events"}
          </h2>
          <EventsList initialEvents={filteredEvents} />
        </section>
      </main>
    </div>
  )
}
