import type React from "react"
import Link from "next/link"
import { Tag } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      {/* Add this to the navigation links in the sidebar (if there is one) */}
      <Link
        href="/admin/categories"
        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Tag className="h-4 w-4" />
        <span>Categories</span>
      </Link>
    </>
  )
}
