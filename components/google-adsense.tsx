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
      // Debug info
      console.log("Initializing AdSense ad with slot:", adSlot)

      // Make sure the AdSense script is loaded
      const checkAdSenseAndLoad = () => {
        // @ts-ignore
        if (window.adsbygoogle) {
          console.log("AdSense found, pushing ad")
          try {
            // @ts-ignore
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            console.log("Ad push completed")
          } catch (pushError) {
            console.error("Error pushing ad:", pushError)
          }
        } else {
          console.log("AdSense not found yet, retrying...")
          setTimeout(checkAdSenseAndLoad, 300)
        }
      }

      // Start checking for AdSense
      checkAdSenseAndLoad()
    } catch (error) {
      console.error("Error setting up AdSense:", error)
    }

    return () => {
      console.log("Ad component unmounted")
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
