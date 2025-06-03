"use client"

import { useEffect, useRef, useState } from "react"

interface GoogleAdSenseProps {
  adSlot: string
  adFormat?: "horizontal" | "vertical" | "rectangle"
  width?: number
  height?: number
  className?: string
}

export default function GoogleAdSense({
  adSlot,
  adFormat = "horizontal",
  width = 320,
  height = 50,
  className = "",
}: GoogleAdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement("script")
        script.async = true
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5039043071428597"
        script.crossOrigin = "anonymous"
        document.head.appendChild(script)
      }

      // Initialize ad after a short delay
      const timer = setTimeout(() => {
        try {
          if (window.adsbygoogle) {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
            setAdLoaded(true)
          }
        } catch (error) {
          console.error("Error loading AdSense ad:", error)
          setAdError(true)
        }
      }, 1000)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Error setting up AdSense:", error)
      setAdError(true)
    }
  }, [])

  if (adError) {
    return <div className="text-center text-gray-500 text-sm">Ad space</div>
  }

  return (
    <div className={`overflow-hidden ${className}`} style={{ width, height }}>
      {!adLoaded && (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
          <span className="text-gray-500 text-sm">Loading ad...</span>
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: `${width}px`, height: `${height}px` }}
        data-ad-client="ca-pub-5039043071428597"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
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
