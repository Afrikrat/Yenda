"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Basic validation
    if (!fullName || !email || !password) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting to sign up with:", { email, password })

      // Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        console.error("Sign up error:", signUpError)
        throw signUpError
      }

      console.log("Sign up response:", data)

      if (data.user) {
        // Create user profile - IMPORTANT: Only include fields that exist in the profiles table
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          // Remove email field as it doesn't exist in the profiles table
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          throw profileError
        }

        toast({
          title: "Account created",
          description: "Your account has been created successfully. You can now sign in.",
        })

        // Redirect to login page
        router.push("/login")
      } else {
        // This shouldn't happen if there's no error, but just in case
        throw new Error("Failed to create user account. Please try again.")
      }
    } catch (error: any) {
      console.error("Error creating account:", error)
      setError(error.message || "Failed to create account. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image src="/images/yenda-logo.png" alt="Yenda" width={180} height={60} className="mx-auto" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">Join Yenda to discover events in Western North</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[#b0468e] hover:underline">
                Sign in
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
