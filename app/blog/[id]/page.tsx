import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { getPublicImageUrl, getOptimizedImageUrl } from "@/lib/image-utils"
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

  // Get proper public image URL
  const imageUrl = post.image_url
    ? getPublicImageUrl(post.image_url)
    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/images/yenda-logo.png`
  const optimizedImageUrl = getOptimizedImageUrl(imageUrl, 1200, 630)

  return {
    title: `${post.title} - Yenda Blog`,
    description: description,
    keywords: `blog, article, ${post.title}`,
    authors: [{ name: post.author || "Yenda Team" }],
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      publishedTime: post.created_at,
      authors: post.author ? [post.author] : undefined,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/blog/${post.slug}`,
      images: [
        {
          url: optimizedImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/jpeg",
        },
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: post.title,
          type: "image/jpeg",
        },
      ],
      siteName: "Yenda",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [optimizedImageUrl],
      creator: "@yendaapp",
      site: "@yendaapp",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/blog/${post.slug}`,
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
