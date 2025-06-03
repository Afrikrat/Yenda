import GoogleAdSense from "@/components/google-adsense"

import { allPosts } from "contentlayer/generated"
import { notFound } from "next/navigation"
import { PostMeta } from "@/components/post-meta"
import { Balancer } from "react-wrap-balancer"
import { Mdx } from "@/components/mdx-components"

interface Props {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    id: post.slug,
  }))
}

export default async function PostPage({ params }: Props) {
  const post = allPosts.find((post) => post.slug === params.id)

  if (!post) {
    return notFound()
  }

  return (
    <article className="mx-auto max-w-2xl py-16">
      <div className="mb-8 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          <Balancer>{post.title}</Balancer>
        </h1>
        <PostMeta post={post} />
      </div>
      <div className="mb-4">
        <GoogleAdSense />
      </div>
      <div className="mb-8">
        <Mdx code={post.body.code} />
      </div>
    </article>
  )
}
