"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { signOut } from "@/app/actions/auth-actions"

export default function AdminMenuPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      // The server action will handle the redirect
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your admin account.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#b0468e]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Router will redirect to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/images/yenda-icon.png" alt="Yenda" width={80} height={80} className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#b0468e]">Admin Menu</CardTitle>
          <CardDescription className="text-center">Manage your Yenda application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/admin">
            <Button variant="brand" className="w-full mb-2">
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/seed">
            <Button variant="outline" className="w-full mb-2">
              Seed Database
            </Button>
          </Link>
          <Link href="/deployment">
            <Button variant="outline" className="w-full mb-2">
              Deployment Guide
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return to App
            </Button>
          </Link>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full text-red-500" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
