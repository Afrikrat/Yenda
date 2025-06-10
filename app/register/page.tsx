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
import { ArrowLeft, Loader2, Eye, EyeOff, User, Mail, Lock, Check } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 6,
    match: password === confirmPassword && confirmPassword.length > 0,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!email || !password) {
      setError("Please fill in all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
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
        // Create user profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          throw profileError
        }

        toast({
          title: "Account created successfully! 🎉",
          description: "Welcome to Yenda! You can now sign in and explore events.",
        })

        // Redirect to login page
        router.push("/login")
      } else {
        throw new Error("Failed to create user account. Please try again.")
      }
    } catch (error: any) {
      console.error("Error creating account:", error)
      let errorMessage = "Failed to create account. Please try again."

      if (error.message.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please sign in instead."
      }

      setError(errorMessage)
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-[#b0468e]/5 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image src="/images/yenda-logo.png" alt="Yenda" width={180} height={60} className="mx-auto" />
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Join Yenda</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your account to discover amazing events
          </p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <div>{error}</div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${passwordChecks.length ? "text-green-600" : "text-gray-400"}`}
                    >
                      <Check className="h-3 w-3" />
                      <span>At least 6 characters</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`flex items-center gap-1 ${passwordChecks.match ? "text-green-600" : "text-gray-400"}`}
                    >
                      <Check className="h-3 w-3" />
                      <span>Passwords match</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#b0468e] hover:bg-[#b0468e]/90 text-white font-medium"
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
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
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
