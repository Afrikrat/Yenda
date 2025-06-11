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

// Helper function to get absolute URL for images
function getAbsoluteImageUrl(imageUrl: string | null): string {
  if (!imageUrl) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/images/yenda-logo.png`
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http")) {
    return imageUrl
  }

  // If it's a Supabase storage path, convert to public URL
  if (imageUrl.startsWith("events/") || imageUrl.startsWith("blog/") || imageUrl.startsWith("stories/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/images/${imageUrl}`
  }

  // If it's a relative path, make it absolute
  if (imageUrl.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}${imageUrl}`
  }

  // Default fallback
  return `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/images/yenda-logo.png`
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

  const description = `Join us for ${event.title} on ${formattedDate} at ${eventTime}. ${event.description} Location: ${event.location}`

  // Get absolute image URL
  const imageUrl = getAbsoluteImageUrl(event.image_url)

  return {
    title: `${event.title} - Yenda Events`,
    description: description,
    keywords: `event, ${event.title}, ${event.location}, ${formattedDate}`,
    authors: [{ name: event.organizer || "Yenda Events" }],
    openGraph: {
      title: event.title,
      description: description,
      type: "article",
      publishedTime: event.date,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/events/${event.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
      siteName: "Yenda",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: description,
      images: [imageUrl],
      creator: "@yendaapp",
      site: "@yendaapp",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/events/${event.slug}`,
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
