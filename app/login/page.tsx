"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true)
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          // Check if the user is an admin
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.session.user.id)
            .single()

          if (redirect.startsWith("/admin") && profileData?.role !== "admin") {
            // If trying to access admin pages but not an admin, redirect to home
            router.push("/")
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin area.",
              variant: "destructive",
            })
          } else {
            // Otherwise redirect to the requested page
            router.push(redirect)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [redirect, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if the user is an admin when trying to access admin pages
      if (redirect.startsWith("/admin")) {
        const { data: profileData } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

        if (profileData?.role !== "admin") {
          await supabase.auth.signOut()
          setError("You don't have permission to access the admin area.")
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin area.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      router.push(redirect)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in. Please check your credentials.")
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#b0468e]" />
          <p className="mt-2 text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image src="/images/yenda-logo.png" alt="Yenda" width={180} height={60} className="mx-auto" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {redirect.startsWith("/admin") ? "Admin Login" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {redirect.startsWith("/admin") ? "Sign in to access the admin dashboard" : "Sign in to your Yenda account"}
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
              )}

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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-[#b0468e] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full bg-[#b0468e] hover:bg-[#b0468e]/90 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-[#b0468e] hover:underline">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-[#b0468e]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
