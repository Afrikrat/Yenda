"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, MessageCircle, Send, Facebook, Twitter, Linkedin } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface EnhancedShareProps {
  title: string
  description: string
  url: string
  imageUrl?: string
}

export default function EnhancedShare({ title, description, url, imageUrl }: EnhancedShareProps) {
  const [isSharing, setIsSharing] = useState(false)

  const shareData = {
    title,
    text: description,
    url,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        setIsSharing(true)
        await navigator.share(shareData)
        toast({
          title: "Shared successfully!",
          description: "Content shared via native sharing",
        })
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error)
        }
      } finally {
        setIsSharing(false)
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "Link has been copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying link:", error)
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n\n${description}`)}`
    window.open(telegramUrl, "_blank")
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, "_blank")
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n\n${description}`)}`
    window.open(twitterUrl, "_blank")
  }

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedinUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Native Share (if supported) */}
        {navigator.share && (
          <Button
            onClick={handleNativeShare}
            disabled={isSharing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}

        {/* Copy Link */}
        <Button onClick={handleCopyLink} variant="outline" size="sm" className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy Link
        </Button>

        {/* WhatsApp */}
        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>

        {/* Telegram */}
        <Button
          onClick={handleTelegramShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <Send className="h-4 w-4" />
          Telegram
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Facebook */}
        <Button
          onClick={handleFacebookShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        {/* Twitter */}
        <Button
          onClick={handleTwitterShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sky-500 hover:text-sky-600"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>

        {/* LinkedIn */}
        <Button
          onClick={handleLinkedInShare}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Button>
      </div>
    </div>
  )
}
