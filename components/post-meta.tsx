import { Calendar, Clock, User } from "lucide-react"

interface PostMetaProps {
  post: {
    author?: string | null
    created_at: string
    content?: string
  }
}

export function PostMeta({ post }: PostMetaProps) {
  // Format date
  const postDate = new Date(post.created_at)
  const formattedDate = postDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.content ? post.content.split(/\s+/).length : 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      {post.author && (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{post.author}</span>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span>{formattedDate}</span>
      </div>

      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>{readTime} min read</span>
      </div>
    </div>
  )
}
