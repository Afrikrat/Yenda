"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function seedDemoData() {
  try {
    const supabase = createServerSupabaseClient()

    // Seed events
    const events = [
      {
        title: "Community Festival",
        slug: "community-festival",
        description:
          "Join us for a day of fun, food, and entertainment at the annual Community Festival. There will be live music, games, and activities for all ages.",
        location: "Central Park, Kumasi",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        featured: true,
        image_url: "https://source.unsplash.com/random/800x600/?festival",
      },
      {
        title: "Tech Meetup",
        slug: "tech-meetup",
        description:
          "Connect with fellow tech enthusiasts and learn about the latest technologies and trends in the industry.",
        location: "Innovation Hub, Accra",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        featured: false,
        image_url: "https://source.unsplash.com/random/800x600/?technology",
      },
      {
        title: "Cultural Exhibition",
        slug: "cultural-exhibition",
        description:
          "Experience the rich cultural heritage of Ghana through art, music, dance, and traditional crafts.",
        location: "National Museum, Accra",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
        featured: true,
        image_url: "https://source.unsplash.com/random/800x600/?culture",
      },
    ]

    for (const event of events) {
      const { error } = await supabase.from("events").upsert(
        {
          ...event,
          created_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )

      if (error) throw error
    }

    // Seed blog posts
    const blogPosts = [
      {
        title: "Exploring Western North Region",
        slug: "exploring-western-north-region",
        content:
          "The Western North Region of Ghana is a hidden gem waiting to be explored. From lush forests to vibrant communities, there's something for everyone to discover and enjoy.",
        date: new Date().toISOString(),
        status: "published",
        image_url: "https://source.unsplash.com/random/800x600/?nature",
      },
      {
        title: "Traditional Festivals in Ghana",
        slug: "traditional-festivals-ghana",
        content:
          "Ghana is known for its colorful and vibrant traditional festivals that celebrate the rich cultural heritage of the country. These festivals are an important part of Ghanaian identity and community life.",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        status: "published",
        image_url: "https://source.unsplash.com/random/800x600/?festival",
      },
      {
        title: "Local Cuisine: A Taste of Ghana",
        slug: "local-cuisine-taste-ghana",
        content:
          "Ghanaian cuisine is diverse and flavorful, with each region offering its own unique dishes and cooking styles. From spicy jollof rice to hearty fufu, there's a wide variety of delicious foods to try.",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        status: "published",
        image_url: "https://source.unsplash.com/random/800x600/?food",
      },
    ]

    for (const post of blogPosts) {
      const { error } = await supabase.from("blog_posts").upsert(
        {
          ...post,
          created_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )

      if (error) throw error
    }

    // Seed locations
    const locations = [
      {
        name: "Kumasi",
        region: "Ashanti",
        description: "The cultural heart of Ghana, known for its rich Ashanti heritage and vibrant markets.",
      },
      {
        name: "Accra",
        region: "Greater Accra",
        description: "The capital city of Ghana, a bustling metropolis with a mix of modern and traditional elements.",
      },
      {
        name: "Tamale",
        region: "Northern",
        description: "The largest city in northern Ghana, known for its unique culture and warm hospitality.",
      },
    ]

    for (const location of locations) {
      const { error } = await supabase.from("locations").upsert(location, { onConflict: "name" })

      if (error) throw error
    }

    return {
      success: true,
      message: "Demo data seeded successfully!",
    }
  } catch (error: any) {
    console.error("Error seeding demo data:", error)
    return {
      success: false,
      message: error.message || "Failed to seed demo data. Please try again.",
    }
  }
}

export async function clearDemoData() {
  try {
    const supabase = createServerSupabaseClient()

    // Clear events
    await supabase.from("events").delete().neq("id", "placeholder")

    // Clear blog posts
    await supabase.from("blog_posts").delete().neq("id", "placeholder")

    // Clear locations
    await supabase.from("locations").delete().neq("id", "placeholder")

    return {
      success: true,
      message: "All demo data cleared successfully!",
    }
  } catch (error: any) {
    console.error("Error clearing demo data:", error)
    return {
      success: false,
      message: error.message || "Failed to clear demo data. Please try again.",
    }
  }
}
