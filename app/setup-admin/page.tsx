"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "admin",
          },
        },
      })

      if (error) throw error

      toast({
        title: "Admin account created",
        description: "Your admin account has been created successfully. You can now log in.",
      })

      router.push("/admin/login")
    } catch (error: any) {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to create admin account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#b0468e]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image src="/images/yenda-icon.png" alt="Yenda" width={80} height={80} className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#b0468e]">Setup Admin Account</CardTitle>
          <CardDescription className="text-center">Create your admin account to manage Yenda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
            onClick={handleSetupAdmin}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
