import type React from "react"
import BottomNavigation from "@/components/bottom-navigation"
import { InstallPrompt } from "@/components/install-prompt"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      {children}
      <BottomNavigation />
      <InstallPrompt />
    </div>
  )
}
