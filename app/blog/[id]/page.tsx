import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import BlogPostClientPage from "./BlogPostClientPage"

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

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()

    if (error) {
      console.error("Error fetching blog post:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id)

  if (!post) {
    return {
      title: "Blog Post Not Found - Yenda",
      description: "The blog post you're looking for doesn't exist.",
    }
  }

  const postDate = new Date(post.created_at)
  const formattedDate = postDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const description = post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, "") + "..."

  return {
    title: `${post.title} - Yenda Blog`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      publishedTime: post.created_at,
      authors: post.author ? [post.author] : undefined,
      images: [
        {
          url: post.image_url || "/images/yenda-logo.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: "Yenda",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [post.image_url || "/images/yenda-logo.png"],
    },
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    return notFound()
  }

  return <BlogPostClientPage post={post} />
}
