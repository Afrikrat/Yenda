"use client"

import { useEffect, useRef } from "react"

export default function GoogleAdSense({ className = "" }) {
  const adRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Only initialize once per component instance
    if (isInitialized.current) return
    isInitialized.current = true

    try {
      // Wait a bit for the page to load completely
      const timer = setTimeout(() => {
        if (window.adsbygoogle) {
          try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          } catch (error) {
            console.error("Error pushing ad:", error)
          }
        }
      }, 100)

      return () => clearTimeout(timer)
    } catch (error) {
      console.error("Error initializing ad:", error)
    }
  }, [])

  return (
    <div className={`ad-container flex justify-center my-4 ${className}`}>
      {/* Fixed 350x50 size ad */}
      <ins
        className="adsbygoogle"
        style={{
          display: "inline-block",
          width: "350px",
          height: "50px",
        }}
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
