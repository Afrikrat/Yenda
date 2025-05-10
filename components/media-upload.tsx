"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import Image from "next/image"

interface MediaUploadProps {
  // Support both old and new prop patterns
  onImageSelected?: (url: string) => void
  onChange?: (url: string) => void
  defaultValue?: string
  value?: string
  accept?: string
  maxSize?: number
  className?: string
}

export default function MediaUpload({
  onImageSelected,
  onChange,
  defaultValue = "",
  value = "",
  accept = "image/*",
  maxSize = 5,
  className = "",
}: MediaUploadProps) {
  // Use either provided value or defaultValue
  const initialValue = value || defaultValue
  const [imageUrl, setImageUrl] = useState(initialValue)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  // Handle callback to parent component
  const updateValue = (url: string) => {
    setImageUrl(url)
    // Support both callback patterns
    if (typeof onChange === "function") {
      onChange(url)
    } else if (typeof onImageSelected === "function") {
      onImageSelected(url)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    updateValue(url)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB by default)
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB.`,
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, GIF).",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Generate a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `uploads/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from("media").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
        },
      })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath)

      const publicUrl = publicUrlData.publicUrl
      updateValue(publicUrl)

      toast({
        title: "Upload successful",
        description: "Your image has been uploaded.",
      })
    } catch (error: any) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    updateValue("")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" placeholder="https://example.com/image.jpg" value={imageUrl} onChange={handleUrlChange} />
        <p className="text-xs text-muted-foreground">Enter a URL for your image or upload one below.</p>
      </div>

      {imageUrl && (
        <div className="relative w-full h-48 rounded-md overflow-hidden border">
          <Image src={imageUrl || "/placeholder.svg"} alt="Selected media" fill className="object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-90"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-muted rounded-full p-3 mb-3">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Upload Image</h3>
        <p className="text-sm text-muted-foreground mb-4">Drag and drop your image here, or click to browse</p>
        <div className="relative">
          <Button variant="outline" className="mb-2" disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? `Uploading (${uploadProgress}%)` : "Choose File"}
          </Button>
          <Input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            accept={accept}
            disabled={isUploading}
          />
        </div>
        <p className="text-xs text-muted-foreground">PNG, JPG or GIF, max {maxSize}MB</p>
      </div>
    </div>
  )
}

// Export both as default and named export
export { MediaUpload }
