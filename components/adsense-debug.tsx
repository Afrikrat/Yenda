"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdSenseDebug() {
  const [adSenseStatus, setAdSenseStatus] = useState("Checking...")
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkAdSense = () => {
      // @ts-ignore
      if (window.adsbygoogle) {
        setAdSenseStatus("AdSense script loaded")
      } else {
        setAdSenseStatus("AdSense script not loaded")
        setTimeout(checkAdSense, 1000)
      }
    }

    checkAdSense()
  }, [])

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {showDebug ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs">
          <h3 className="font-bold mb-2">AdSense Debug</h3>
          <p className="text-sm mb-2">Status: {adSenseStatus}</p>
          <p className="text-sm mb-2">Publisher ID: ca-pub-5039043071428597</p>
          <Button size="sm" variant="outline" onClick={() => setShowDebug(false)}>
            Close
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setShowDebug(true)}>
          Debug Ads
        </Button>
      )}
    </div>
  )
}
