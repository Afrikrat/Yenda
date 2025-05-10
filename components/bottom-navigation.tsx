"use client"

import { Home, BookOpen, Play, User, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function BottomNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Reordered to put Stories in the middle
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: BookOpen, label: "Blog", href: "/blog" },
    { icon: Play, label: "Stories", href: "/stories", featured: true },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 native-bottom-nav safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const isStories = item.href === "/stories"

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors press-effect",
                isActive
                  ? "text-[#b0468e] dark:text-[#b0468e]"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#b0468e] dark:hover:text-[#b0468e]",
                isStories && "relative",
              )}
            >
              {isStories && (
                <div className="absolute -top-3 w-12 h-12 rounded-full bg-[#b0468e] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              )}
              {!isStories && <item.icon className={cn("w-5 h-5 mb-1", isActive ? "fill-current" : "")} />}
              <span className={cn("text-xs", isStories && "mt-5")}>{item.label}</span>
            </Link>
          )
        })}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center w-full h-full transition-colors press-effect",
                "text-gray-500 dark:text-gray-400 hover:text-[#b0468e] dark:hover:text-[#b0468e]",
              )}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span className="text-xs">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <div className="grid grid-cols-2 gap-4 py-6">
              <Link
                href="/about"
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 press-effect"
                onClick={() => setOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-[#b0468e]/10 dark:bg-[#b0468e]/20 flex items-center justify-center mb-2">
                  <span className="text-[#b0468e] dark:text-[#b0468e] text-xl">Y</span>
                </div>
                <span className="text-sm font-medium">About Us</span>
              </Link>
              <Link
                href="/contact"
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 press-effect"
                onClick={() => setOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-[#000000]/10 dark:bg-[#000000]/20 flex items-center justify-center mb-2">
                  <span className="text-[#000000] dark:text-white text-xl">C</span>
                </div>
                <span className="text-sm font-medium">Contact Us</span>
              </Link>
              <Link
                href="/terms"
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 press-effect"
                onClick={() => setOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-[#b0468e]/10 dark:bg-[#b0468e]/20 flex items-center justify-center mb-2">
                  <span className="text-[#b0468e] dark:text-[#b0468e] text-xl">T</span>
                </div>
                <span className="text-sm font-medium">Terms</span>
              </Link>
              {/* Admin link removed from regular users */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
