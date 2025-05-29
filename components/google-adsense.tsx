"use client"

import { useEffect, useRef } from "react"

interface GoogleAdSenseProps {
  adSlot: string
  adFormat?: "horizontal" | "vertical" | "rectangle"
  width?: number
  height?: number
  className?: string
}

export function GoogleAdSense({
  adSlot,
  adFormat = "horizontal",
  width = 320,
  height = 50,
  className = "",
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      // Check if adsbygoogle is defined
      if (window.adsbygoogle) {
        // Push the ad to Google AdSense
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("Error loading AdSense ad:", error)
    }
  }, [])

  return (
    <div className={`overflow-hidden ${className}`} style={{ width, height }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: `${width}px`, height: `${height}px` }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="false"
        ref={adRef}
      />
    </div>
  )
}

// Add this to make TypeScript happy
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
