"use client"

import { useEffect, useRef } from "react"

interface GoogleAdSenseProps {
  adSlot?: string
  className?: string
}

export default function GoogleAdSense({ adSlot = "1234567890", className = "" }: GoogleAdSenseProps) {
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
    <div ref={adRef} className={`overflow-hidden ${className}`} style={{ width: 320, height: 50 }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "320px", height: "50px" }}
        data-ad-client="ca-pub-5039043071428597"
        data-ad-slot={adSlot}
        data-ad-format="horizontal"
        data-full-width-responsive="false"
      />
    </div>
  )
}
