import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNavigation from "@/components/bottom-navigation"
import { Toaster } from "@/components/ui/toaster"
import { InstallPrompt } from "@/components/install-prompt"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yenda - Event Discovery",
  description: "Discover and manage events in Ghana's Western North region",
  manifest: "/manifest.json",
  themeColor: "#b83280",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Yenda",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Only the basic AdSense script - NO auto ads */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5039043071428597"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen pb-16">
            {children}
            <BottomNavigation />
            <InstallPrompt />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
