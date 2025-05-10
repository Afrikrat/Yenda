import EventsList from "@/components/events-list"
import SearchBar from "@/components/search-bar"
import Header from "@/components/header"
import FeaturedEventsCarousel from "@/components/featured-events-carousel"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = createServerSupabaseClient()

  // Fetch events from Supabase
  const { data: events } = await supabase
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
      categories(name)
    `)
    .eq("published", true)
    .order("date", { ascending: true })
    .limit(10)

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container px-4 py-4 mx-auto animate-slide-up">
        <div className="mb-6">
          <FeaturedEventsCarousel />
        </div>
        <SearchBar />
        <EventsList initialEvents={events || []} />
      </div>
    </main>
  )
}
