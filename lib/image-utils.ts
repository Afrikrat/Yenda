export function getPublicImageUrl(imageUrl: string | null): string {
  if (!imageUrl) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/images/yenda-logo.png` // Fallback to logo
  }

  // If it's already a full URL, return as is
  if (imageUrl.startsWith("http")) {
    return imageUrl
  }

  // If it's a Supabase storage path, convert to public URL
  if (imageUrl.startsWith("events/") || imageUrl.startsWith("blog/") || imageUrl.startsWith("stories/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/images/${imageUrl}`
  }

  // If it's a relative path, make it absolute
  if (imageUrl.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}${imageUrl}`
  }

  // Default fallback
  return `${process.env.NEXT_PUBLIC_SITE_URL || "https://yenda.vercel.app"}/images/yenda-logo.png`
}

export function getOptimizedImageUrl(imageUrl: string | null, width = 1200, height = 630): string {
  const publicUrl = getPublicImageUrl(imageUrl)

  // If it's a Supabase image, we can add transformation parameters
  if (publicUrl.includes("supabase") && publicUrl.includes("/storage/")) {
    return `${publicUrl}?width=${width}&height=${height}&resize=cover&quality=80`
  }

  // For other images, return as is (could integrate with other image optimization services)
  return publicUrl
}

export function validateImageUrl(imageUrl: string): boolean {
  try {
    new URL(imageUrl)
    return true
  } catch {
    return false
  }
}

export function getImageDimensions(imageUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }
    img.crossOrigin = "anonymous"
    img.src = imageUrl
  })
}
