"use client"

import { useEffect, useRef } from "react"

export default function GoogleAdSense({ adSlot = "1234567890", className = "" }) {
  const adRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Only initialize once
    if (isInitialized.current) return
    isInitialized.current = true

    try {
      // Make sure the AdSense script is loaded
      const checkAdSenseAndLoad = () => {
        // @ts-ignore
        if (window.adsbygoogle) {
          try {
            // @ts-ignore
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          } catch (pushError) {
            console.error("Error pushing ad:", pushError)
          }
        } else {
          setTimeout(checkAdSenseAndLoad, 300)
        }
      }

      // Start checking for AdSense
      checkAdSenseAndLoad()
    } catch (error) {
      console.error("Error setting up AdSense:", error)
    }
  }, [adSlot])

  return (
    <div className={`ad-container overflow-hidden flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: "320px", height: "50px" }}
        data-ad-client="ca-pub-5039043071428597"
        data-ad-slot={adSlot}
      />
    </div>
  )
}
