import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data for a single blog post
const post = {
  id: "1",
  title: "How to Plan the Perfect Event",
  content: `
    <p>Planning an event can be a daunting task, but with the right approach, it can be a rewarding experience. Whether you're organizing a small gathering or a large festival, these essential steps will help you create a memorable event.</p>
    
    <h2>1. Define Your Event's Purpose and Target Audience</h2>
    <p>Before diving into the details, clearly define what you want to achieve with your event and who you want to attend. Understanding your audience will guide your decisions on venue, programming, and marketing.</p>
    
    <h2>2. Set a Realistic Budget</h2>
    <p>Create a comprehensive budget that includes all potential expenses: venue, catering, entertainment, decorations, staff, marketing, and a contingency fund for unexpected costs.</p>
    
    <h2>3. Choose the Right Venue</h2>
    <p>Select a venue that aligns with your event's theme, accommodates your expected attendance, and fits within your budget. Consider factors like location, accessibility, parking, and available facilities.</p>
    
    <h2>4. Create a Detailed Timeline</h2>
    <p>Develop a timeline that covers everything from the initial planning stages to post-event activities. Include deadlines for booking vendors, sending invitations, and confirming details.</p>
    
    <h2>5. Market Your Event Effectively</h2>
    <p>Use a mix of channels to promote your event: social media, email marketing, local press, and word of mouth. Create compelling content that highlights what makes your event special.</p>
    
    <p>Remember, successful events don't just happen—they're the result of careful planning, attention to detail, and a clear vision. By following these steps, you'll be well on your way to creating an event that leaves a lasting impression on your guests.</p>
  `,
  date: "2023-05-15",
  image: "/placeholder.svg?height=600&width=1200",
  author: "Jane Smith",
  authorImage: "/placeholder.svg?height=100&width=100",
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  // Format date
  const postDate = new Date(post.date)
  const formattedDate = postDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <main className="flex flex-col min-h-screen pb-10">
      <div className="relative h-64 sm:h-80 md:h-96">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
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
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </div>

            <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="mt-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image src={post.authorImage || "/placeholder.svg"} alt={post.author} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.author}</p>
                  <p className="text-xs text-muted-foreground">Author</p>
                </div>
              </div>

              <Button variant="outline" size="icon" className="rounded-full">
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
