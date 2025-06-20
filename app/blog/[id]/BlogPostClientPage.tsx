"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import GoogleAdSense from "@/components/google-adsense"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  created_at: string
  image_url: string | null
  author: string | null
  status: string
}

interface BlogPostClientPageProps {
  post: BlogPost
}

export default function BlogPostClientPage({ post }: BlogPostClientPageProps) {
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)

  // Format date
  const postDate = new Date(post.created_at)
  const formattedDate = postDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "",
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Blog post link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen pb-10">
      <div className="relative h-64 sm:h-80 md:h-96">
        <Image
          src={post.image_url || "/placeholder.svg?height=600&width=1200"}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <Link href="/blog" className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Blog</span>
          </Button>
        </Link>
      </div>

      <div className="container px-4 mx-auto -mt-16 relative z-10">
        <div className="bg-background rounded-t-3xl p-6 shadow-lg animate-slide-up">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
              {post.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

            {/* First Ad after title - 350x50 size only */}
            <GoogleAdSense />

            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Second Ad after content - 350x50 size only */}
            <GoogleAdSense />

            <div className="mt-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={post.image_url || "/placeholder.svg?height=100&width=100"}
                    alt={post.author || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare} disabled={isSharing}>
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
