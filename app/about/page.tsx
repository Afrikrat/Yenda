import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Yenda</h1>

        <div className="space-y-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4">
              <Image src="/images/yenda-icon.png" alt="Yenda" fill className="object-contain" />
            </div>
            <p className="text-center text-lg font-medium">
              Your premier event discovery platform in Ghana's Western North region
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Our Mission</h2>
              <p className="mb-4">
                Yenda is dedicated to connecting people with exciting events, concerts, parties, and programs throughout
                Ghana's Western North region. We believe that great experiences bring communities together, and our
                mission is to make these experiences more accessible to everyone.
              </p>
              <p>
                Whether you're looking for music concerts, cultural festivals, educational workshops, or community
                gatherings, Yenda helps you discover, track, and engage with events that matter to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Our Team</h2>
              <p className="mb-4">
                Yenda is developed by Westlert Digitals, a forward-thinking digital solutions provider committed to
                enhancing community connections through technology. The platform is managed by JayGuy Records, bringing
                their expertise in event management and promotion to ensure the best user experience.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 dark:text-pink-400 text-xl font-bold">WD</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Westlert Digitals</h3>
                    <p className="text-sm text-muted-foreground">Development Partner</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-xl font-bold">JG</span>
                  </div>
                  <div>
                    <h3 className="font-bold">JayGuy Records</h3>
                    <p className="text-sm text-muted-foreground">Management Partner</p>
                    <p className="text-sm">Call/WhatsApp: 0554688406</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Why Choose Yenda?</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-600 dark:text-pink-400 text-sm">✓</span>
                  </div>
                  <p>Discover local events in Ghana's Western North region</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-600 dark:text-pink-400 text-sm">✓</span>
                  </div>
                  <p>Get reminders and countdowns for upcoming events</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-600 dark:text-pink-400 text-sm">✓</span>
                  </div>
                  <p>Easily RSVP and share events with friends</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-600 dark:text-pink-400 text-sm">✓</span>
                  </div>
                  <p>Stay updated with event-related blog content</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-pink-600 dark:text-pink-400 text-sm">✓</span>
                  </div>
                  <p>Native mobile app experience with PWA technology</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
