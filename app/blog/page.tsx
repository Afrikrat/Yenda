import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

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

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="flex flex-col min-h-screen pb-20">
      <div className="relative h-32 sm:h-40 bg-gradient-to-r from-[#b0468e] to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <Link href="/" className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Home</span>
          </Button>
        </Link>
        <div className="container px-4 mx-auto h-full flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white text-center">Blog</h1>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No blog posts yet</h2>
            <p className="text-muted-foreground mb-6">Check back later for updates and stories.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const postDate = new Date(post.created_at)
              const formattedDate = postDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })

              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.image_url || "/placeholder.svg?height=300&width=400"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formattedDate}</span>
                      {post.author && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>}
                    <Link href={`/blog/${post.slug}`}>
                      <Button className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
