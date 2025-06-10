"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Heart, Users, Calendar } from "lucide-react"
import Link from "next/link"

interface EngagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EngagementModal({ isOpen, onClose }: EngagementModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="relative text-center pb-2">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-[#b0468e] to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">Don't Miss Out! ✨</CardTitle>
          <CardDescription>There's so much more to explore on Yenda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/stories" onClick={onClose}>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center hover:scale-105 transition-transform cursor-pointer">
                <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Stories</p>
                <p className="text-xs text-muted-foreground">Event highlights</p>
              </div>
            </Link>
            <Link href="/blog" onClick={onClose}>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg text-center hover:scale-105 transition-transform cursor-pointer">
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Blog</p>
                <p className="text-xs text-muted-foreground">Event news</p>
              </div>
            </Link>
          </div>

          <div className="bg-[#b0468e]/5 rounded-lg p-4 text-center">
            <p className="text-sm font-medium mb-2">🎯 Quick Tip</p>
            <p className="text-xs text-muted-foreground">
              Create an account to save events, RSVP, and get personalized recommendations!
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/register" className="flex-1" onClick={onClose}>
              <Button className="w-full bg-[#b0468e] hover:bg-[#b0468e]/90 text-white">Sign Up Free</Button>
            </Link>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Continue Browsing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
