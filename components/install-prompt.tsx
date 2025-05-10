"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches
    if (isAppInstalled) {
      return
    }

    // Check if prompt was recently dismissed
    const lastDismissed = localStorage.getItem("installPromptDismissed")
    if (lastDismissed) {
      const dismissedTime = Number.parseInt(lastDismissed, 10)
      const now = Date.now()
      // If dismissed less than 24 hours ago, don't show
      if (now - dismissedTime < 24 * 60 * 60 * 1000) {
        return
      }
    }

    // Store the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show our custom install prompt
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Show the prompt after a delay if the user hasn't interacted with it
    const promptTimer = setTimeout(() => {
      if (deferredPrompt) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      clearTimeout(promptTimer)
    }
  }, [deferredPrompt])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice

    // User accepted the install prompt
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Save to localStorage to avoid showing again for some time
    localStorage.setItem("installPromptDismissed", Date.now().toString())
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 py-2 animate-slide-up">
      <Card className="border-[#b0468e]">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/yenda-icon.png" alt="Yenda" width={32} height={32} className="rounded-md" />
              <CardTitle className="text-lg">Install Yenda App</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>Get the full app experience</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm">
            Install Yenda on your home screen for quick access to events in Western North Ghana.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Later
          </Button>
          <Button variant="brand" size="sm" onClick={handleInstall}>
            Install Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
