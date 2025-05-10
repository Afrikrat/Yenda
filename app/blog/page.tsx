import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for blog posts
const BLOG_POSTS = [
  {
    id: "1",
    title: "How to Plan the Perfect Event",
    excerpt: "Learn the essential steps to planning a successful event that your guests will remember.",
    date: "2023-05-15",
    image: "/placeholder.svg?height=400&width=600",
    author: "Jane Smith",
  },
  {
    id: "2",
    title: "Top 10 Music Festivals This Summer",
    excerpt: "Discover the most anticipated music festivals happening around the country this summer season.",
    date: "2023-05-10",
    image: "/placeholder.svg?height=400&width=600",
    author: "John Doe",
  },
  {
    id: "3",
    title: "The Rise of Pop-Up Events",
    excerpt: "Explore how temporary, exclusive events are changing the entertainment landscape.",
    date: "2023-05-05",
    image: "/placeholder.svg?height=400&width=600",
    author: "Alex Johnson",
  },
  {
    id: "4",
    title: "Behind the Scenes: Event Organization",
    excerpt: "Get an insider look at what goes into organizing large-scale events and festivals.",
    date: "2023-04-28",
    image: "/placeholder.svg?height=400&width=600",
    author: "Sarah Williams",
  },
]

export default function BlogPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Blog</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}

interface BlogCardProps {
  post: (typeof BLOG_POSTS)[0]
}

function BlogCard({ post }: BlogCardProps) {
  // Format date
  const postDate = new Date(post.date)
  const formattedDate = postDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link href={`/blog/${post.id}`}>
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow animate-slide-up">
        <div className="relative h-48">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <CardContent className="p-6">
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>

          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
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
