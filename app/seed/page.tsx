"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { seedDemoData, clearDemoData } from "@/app/actions/seed-data"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function SeedPage() {
  const [isSeedingData, setIsSeedingData] = useState(false)
  const [isClearingData, setIsClearingData] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSeedDemoData = async () => {
    setIsSeedingData(true)
    try {
      const result = await seedDemoData()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error: any) {
      console.error("Error seeding demo data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to seed demo data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSeedingData(false)
    }
  }

  const handleClearDemoData = async () => {
    setIsClearingData(true)
    try {
      const result = await clearDemoData()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error: any) {
      console.error("Error clearing demo data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to clear demo data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearingData(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src="/images/yenda-icon.png" alt="Yenda" width={80} height={80} className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#b0468e]">Database Management</CardTitle>
          <CardDescription className="text-center">Seed or clear your database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use these options to populate your database with demo data or clear all existing data. This is useful for
            testing or starting fresh.
          </p>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleSeedDemoData}
              disabled={isSeedingData || isClearingData}
              className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
            >
              {isSeedingData ? "Seeding..." : "Seed Demo Data"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClearDemoData}
              disabled={isSeedingData || isClearingData}
              className="w-full"
            >
              {isClearingData ? "Clearing..." : "Clear All Data"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push("/admin-menu")}>
            Back to Admin Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
