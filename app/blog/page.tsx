"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import GoogleAdSense from "@/components/google-adsense"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  created_at: string
  image_url: string | null
  author: string | null
  status: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      console.log("Fetching blog posts...")
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, created_at, image_url, author, status")
        .eq("status", "published") // Only show published posts
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching blog posts:", error)
        throw error
      }

      console.log("Blog posts data:", data)
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="container px-4 py-6 mx-auto">
          <h1 className="text-2xl font-bold mb-6">Blog</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b0468e]"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Blog</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
            <p className="text-muted-foreground">Check back later for new content!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <BlogCard post={post} />
                  {/* Show ad after every 2nd post */}
                  {(index + 1) % 2 === 0 && index < posts.length - 1 && (
                    <div className="md:col-span-2 flex justify-center my-4">
                      <GoogleAdSense adSlot="1234567890" width={320} height={50} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Google AdSense Ad - Moved to bottom of content */}
            <div className="mt-8 flex justify-center">
              <GoogleAdSense adSlot="your-blog-ad-slot-id-here" width={320} height={50} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}

interface BlogCardProps {
  post: BlogPost
}

function BlogCard({ post }: BlogCardProps) {
  // Format date
  const postDate = new Date(post.created_at)
  const formattedDate = postDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow animate-slide-up">
        <div className="relative h-48">
          <Image
            src={post.image_url || "/placeholder.svg?height=400&width=600"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        <CardContent className="p-6">
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
            {post.author && (
              <>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          {post.excerpt && <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>}
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0">
          <Button variant="outline" className="w-full">
            Read More
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
