"use client"

import { MoonStar, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image src="/images/yenda-logo.png" alt="Yenda" width={140} height={45} className="h-8 w-auto" />
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonStar className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
