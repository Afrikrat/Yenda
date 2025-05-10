"use client"

import type React from "react"

import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Phone, Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("contact_messages").insert([{ name, email, phone, message }])

      if (error) throw error

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      })

      // Reset form
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch (error) {
      console.error("Error submitting contact form:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Have a question or want to advertise your event? Fill out the form and we'll get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advertise Your Event</CardTitle>
                <CardDescription>Want us to promote your event, product, or service on Yenda?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Yenda is the premier platform for event discovery in Ghana's Western North region. We offer various
                  promotional packages to help you reach your target audience.
                </p>
                <p>
                  Our team will work with you to create a customized promotion strategy that fits your needs and budget.
                </p>
                <div className="mt-6">
                  <Button
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    onClick={() => {
                      window.location.href = "tel:0554688406"
                    }}
                  >
                    Call Us Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone/WhatsApp</p>
                    <p className="text-muted-foreground">0554688406</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">info@yenda.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Western North Region, Ghana</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground mb-2">Managed by:</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">JG</span>
                  </div>
                  <div>
                    <p className="font-medium">JayGuy Records</p>
                    <p className="text-xs text-muted-foreground">Your event promotion partner</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
