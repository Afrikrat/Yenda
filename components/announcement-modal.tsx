"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Bell, Star, Calendar } from "lucide-react"

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AnnouncementModal({ isOpen, onClose }: AnnouncementModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="relative text-center pb-2">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-[#b0468e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-[#b0468e]" />
          </div>
          <CardTitle className="text-xl">Welcome to Yenda! 🎉</CardTitle>
          <CardDescription>Discover amazing events in Western North Ghana</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-[#b0468e]/5 rounded-lg">
              <Star className="h-5 w-5 text-[#b0468e]" />
              <div>
                <p className="font-medium text-sm">New Events Weekly</p>
                <p className="text-xs text-muted-foreground">Fresh events added every week</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#b0468e]/5 rounded-lg">
              <Calendar className="h-5 w-5 text-[#b0468e]" />
              <div>
                <p className="font-medium text-sm">RSVP & Save Events</p>
                <p className="text-xs text-muted-foreground">Never miss your favorite events</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-[#b0468e] hover:bg-[#b0468e]/90 text-white" onClick={onClose}>
              Explore Events
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
