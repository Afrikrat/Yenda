"use client"

import { useEffect, useRef } from "react"

interface GoogleAdSenseProps {
  adSlot?: string
  adFormat?: "auto" | "horizontal" | "vertical" | "rectangle"
  width?: number
  height?: number
  className?: string
}

export default function GoogleAdSense({
  adSlot = "1234567890",
  adFormat = "auto",
  width = 320,
  height = 50,
  className = "",
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    // Only load ads once per component
    if (isLoaded.current) return

    try {
      // Check if window and document are available (client-side)
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        // Wait for the Google AdSense script to be ready
        const tryLoadAd = () => {
          // @ts-ignore
          if (window.adsbygoogle) {
            // @ts-ignore
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            isLoaded.current = true
          } else {
            // Retry after a short delay
            setTimeout(tryLoadAd, 200)
          }
        }

        // Start trying to load the ad
        tryLoadAd()
      }
    } catch (error) {
      console.error("Error loading AdSense ad:", error)
    }
  }, [])

  return (
    <div ref={adRef} className={`overflow-hidden ${className}`} style={{ width, height }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-5039043071428597"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
