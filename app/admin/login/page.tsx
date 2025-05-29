"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase/client"

// List of admin emails - add your admin email here
const ADMIN_EMAILS = ["admin@example.com", "admin@yenda.com", "yendaofficial@gmail.com"]

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check if already logged in on page load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session && ADMIN_EMAILS.includes(session.user.email || "")) {
          setRedirecting(true)
          // Multiple redirect attempts
          setTimeout(() => {
            window.location.replace("/admin")
          }, 100)
          setTimeout(() => {
            router.push("/admin")
            router.refresh()
          }, 200)
        }
      } catch (err) {
        console.error("Session check error:", err)
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting login for:", email)

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Auth error:", authError)
        setError(authError.message)
        return
      }

      if (!data.user) {
        setError("Login failed. Please try again.")
        return
      }

      console.log("Login successful for:", data.user.email)

      // Check if the user is an admin by email
      if (!ADMIN_EMAILS.includes(data.user.email || "")) {
        console.log("User is not an admin:", data.user.email)
        await supabase.auth.signOut()
        setError("You don't have permission to access the admin area.")
        return
      }

      console.log("User is admin, redirecting...")

      toast({
        title: "Login successful",
        description: "Redirecting to admin dashboard...",
      })

      setRedirecting(true)

      // Multiple redirect strategies
      setTimeout(() => {
        console.log("Redirect attempt 1: window.location.replace")
        window.location.replace("/admin")
      }, 500)

      setTimeout(() => {
        console.log("Redirect attempt 2: window.location.href")
        window.location.href = "/admin"
      }, 1000)

      setTimeout(() => {
        console.log("Redirect attempt 3: router.push")
        router.push("/admin")
        router.refresh()
      }, 1500)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (redirecting) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#b0468e]">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#b0468e] mb-4" />
            <p className="text-center text-[#b0468e] font-medium">
              Login successful! Redirecting to admin dashboard...
            </p>
            <p className="text-center text-sm text-gray-600 mt-2">
              If you're not redirected automatically,{" "}
              <a href="/admin" className="text-[#b0468e] underline">
                click here
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#b0468e]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image src="/images/yenda-icon.png" alt="Yenda" width={80} height={80} className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#b0468e]">Yenda Admin</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="yendaofficial@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-[#b0468e] hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
            onClick={handleLogin}
            disabled={isLoading || redirecting}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
