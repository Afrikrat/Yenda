"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase, refreshToken } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import MediaUpload from "@/components/media-upload"

export default function NewUserPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setIsSubmitting(true)
    try {
      // Try to refresh the token first to ensure we have a valid session
      await refreshToken()

      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw authError
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          full_name: fullName,
          phone,
          avatar_url: avatarUrl,
        })

        if (profileError) {
          console.error("Profile error:", profileError)
          throw profileError
        }

        toast({
          title: "User created",
          description: "The user has been created successfully.",
        })

        router.push("/admin/users")
      }
    } catch (error: any) {
      console.error("Error creating user:", error)
      setError(error.message || "Failed to create user. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/admin/users">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <span className="text-xl font-bold">Add New User</span>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Add a new user to your application.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters long.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="+233 55 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Profile Picture (Optional)</Label>
                    <MediaUpload value={avatarUrl} onChange={setAvatarUrl} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating User...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
