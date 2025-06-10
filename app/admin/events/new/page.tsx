"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function NewEventPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [organizer, setOrganizer] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!organizer) {
      alert("Organizer cannot be empty.")
      return
    }

    const newEvent = {
      title,
      description,
      date,
      location,
      organizer,
    }

    console.log("Creating event:", newEvent)

    // Simulate API call (replace with actual API endpoint)
    try {
      // const response = await fetch('/api/events', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newEvent),
      // });

      // if (response.ok) {
      //   router.push('/admin/events');
      // } else {
      //   console.error('Failed to create event');
      // }
      console.log("Event created successfully (simulated)")
      router.push("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Event Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Event Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="organizer" className="text-sm font-medium">
              Event Organizer *
            </Label>
            <Input
              id="organizer"
              placeholder="Enter organizer name (e.g., John Doe, ABC Company)"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              required
              className="h-12"
            />
          </div>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </div>
  )
}
