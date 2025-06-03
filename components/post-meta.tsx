import { Calendar, User, Clock } from "lucide-react"

interface PostMetaProps {
  author?: string
  date?: string
  readTime?: string
  className?: string
}

export function PostMeta({ author, date, readTime, className = "" }: PostMetaProps) {
  return (
    <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
      {author && (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{author}</span>
        </div>
      )}
      {date && (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )}
      {readTime && (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readTime}</span>
        </div>
      )}
    </div>
  )
}
