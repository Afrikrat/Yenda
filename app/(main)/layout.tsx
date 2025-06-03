import type React from "react"
import BottomNavigation from "@/components/bottom-navigation"
import { InstallPrompt } from "@/components/install-prompt"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("MainLayout rendering")
  return (
    <>
      <div className="flex flex-col min-h-screen pb-16">{children}</div>
      <BottomNavigation />
      <InstallPrompt />
    </>
  )
}
