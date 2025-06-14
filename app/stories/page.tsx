"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUp, ArrowDown, Heart, Share2, X, Play, Pause } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useSwipeable } from "react-swipeable"

interface Story {
  id: string
  title: string
  subtitle: string
  image_url: string
  event_id: string
  active: boolean
  event?: {
    id: string
    title: string
    slug: string
    date: string
  }
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()
  const storyContainerRef = useRef<HTMLDivElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const STORY_DURATION = 5000 // 5 seconds per story

  useEffect(() => {
    fetchStories()
  }, [])

  useEffect(() => {
    if (stories.length > 0 && isPlaying) {
      startStoryTimer()
    } else {
      stopStoryTimer()
    }

    return () => {
      stopStoryTimer()
    }
  }, [currentIndex, stories.length, isPlaying])

  const startStoryTimer = () => {
    stopStoryTimer()
    setProgress(0)

    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (STORY_DURATION / 100)
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 100)

    // Auto advance to next story
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      nextStory()
    }, STORY_DURATION)
  }

  const stopStoryTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = null
    }
  }

  const fetchStories = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("stories")
        .select(`
          *,
          event:event_id (
            id,
            title,
            slug,
            date
          )
        `)
        .eq("active", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error("Error fetching stories:", error)
      toast({
        title: "Error",
        description: "Failed to load stories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop back to first story or exit
      setCurrentIndex(0)
    }
  }

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = (storyId: string) => {
    setLiked({
      ...liked,
      [storyId]: !liked[storyId],
    })
  }

  const shareStory = () => {
    if (navigator.share) {
      navigator.share({
        title: stories[currentIndex]?.title,
        text: stories[currentIndex]?.subtitle,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Story link copied to clipboard",
      })
    }
  }

  const handlers = useSwipeable({
    onSwipedUp: nextStory,
    onSwipedDown: prevStory,
    onTap: togglePlayPause,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b0468e]"></div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="w-16 h-16 bg-[#b0468e]/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-[#b0468e] text-2xl">!</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">No Stories Available</h1>
        <p className="text-muted-foreground mb-6">Check back later for new stories about upcoming events.</p>
        <Link href="/">
          <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">Back to Home</Button>
        </Link>
      </div>
    )
  }

  const currentStory = stories[currentIndex]

  return (
    <main className="fixed inset-0 bg-black z-50" {...handlers}>
      <div ref={storyContainerRef} className="relative h-full w-full overflow-hidden">
        {/* Story Content */}
        <div className="absolute inset-0">
          <Image
            src={currentStory.image_url || "/placeholder.svg?height=1920&width=1080"}
            alt={currentStory.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
        </div>

        {/* Story Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2 flex gap-1">
          {stories.map((_, index) => (
            <div key={index} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-100 ${
                  index === currentIndex ? `w-[${progress}%]` : index < currentIndex ? "w-full" : "w-0"
                }`}
                style={index === currentIndex ? { width: `${progress}%` } : {}}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-black/30"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-black/30"
            >
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevStory}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white/70 hover:text-white disabled:opacity-0"
        >
          <ArrowUp className="h-8 w-8" />
        </button>
        <button
          onClick={nextStory}
          disabled={currentIndex === stories.length - 1}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white/70 hover:text-white disabled:opacity-0"
        >
          <ArrowDown className="h-8 w-8" />
        </button>

        {/* Story Content */}
        <div className="absolute bottom-20 left-0 right-0 p-6 text-white z-10">
          <h2 className="text-2xl font-bold mb-1">{currentStory.title}</h2>
          <p className="text-white/90 mb-4">{currentStory.subtitle}</p>

          {currentStory.event && (
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-3 mb-4">
              <p className="text-sm text-white/70 mb-1">Event Details:</p>
              <p className="font-medium">{currentStory.event.title}</p>
              <p className="text-sm text-white/90">
                {new Date(currentStory.event.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {currentStory.event && (
              <Link href={`/events/${currentStory.event.slug}`} className="flex-1">
                <Button className="w-full bg-white text-black hover:bg-white/90">
                  View Event
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-black/30"
            onClick={() => toggleLike(currentStory.id)}
          >
            <Heart className={`h-5 w-5 ${liked[currentStory.id] ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-black/20 backdrop-blur-md border-white/30 text-white hover:bg-black/30"
            onClick={shareStory}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Tap to pause indicator */}
        {!isPlaying && (
          <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 text-white/70 text-sm flex flex-col items-center">
            <Play className="h-6 w-6 mb-1" />
            <span>Tap to resume</span>
          </div>
        )}
      </div>
    </main>
  )
}
