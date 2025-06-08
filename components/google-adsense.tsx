"use client"

import { useEffect, useRef } from "react"

export default function GoogleAdSense({ className = "" }) {
  const adRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Only initialize once
    if (isInitialized.current) return
    isInitialized.current = true

    try {
      // Push the ad when the component mounts
      const pushAd = () => {
        if (window.adsbygoogle) {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } else {
          // Retry if adsbygoogle isn't available yet
          setTimeout(pushAd, 200)
        }
      }

      // Start trying to push the ad
      pushAd()
    } catch (error) {
      console.error("Error initializing ad:", error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      {/* Using the exact code provided by Google */}
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "320px", height: "50px" }}
        data-ad-client="ca-pub-5039043071428597"
        data-ad-slot="2372308005"
      />
    </div>
  )
}

// Add TypeScript support for adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
