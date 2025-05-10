import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yenda - Event Discovery",
    short_name: "Yenda",
    description: "Discover and manage events in Ghana's Western North region",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#b83280",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  }
}
