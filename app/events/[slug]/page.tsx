import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import EventDetailsClient from "./event-details-client"

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

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const { data, error } = await supabase.from("events").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Error fetching event:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching event:", error)
    return null
  }
}

async function getCategory(categoryId: string): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").select("*").eq("id", categoryId).single()

    if (error) return null
    return data
  } catch (error) {
    return null
  }
}

async function getTown(townId: string): Promise<Town | null> {
  try {
    const { data, error } = await supabase.from("towns").select("*").eq("id", townId).single()

    if (error) return null
    return data
  } catch (error) {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug)

  if (!event) {
    return {
      title: "Event Not Found - Yenda",
      description: "The event you're looking for doesn't exist.",
    }
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const eventTime = new Date(`2000-01-01T${event.time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  const description = `${event.description} | ${formattedDate} at ${eventTime} | ${event.location}`

  return {
    title: `${event.title} - Yenda`,
    description: description,
    openGraph: {
      title: event.title,
      description: description,
      type: "article",
      publishedTime: event.date,
      images: [
        {
          url: event.image_url || "/images/yenda-logo.png",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      siteName: "Yenda",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: description,
      images: [event.image_url || "/images/yenda-logo.png"],
    },
  }
}

export default async function EventDetailsPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug)

  if (!event) {
    return notFound()
  }

  // Fetch additional data
  const category = event.category_id ? await getCategory(event.category_id) : null
  const town = event.town_id ? await getTown(event.town_id) : null

  return <EventDetailsClient event={event} category={category} town={town} />
}
