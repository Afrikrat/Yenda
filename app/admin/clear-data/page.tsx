"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { clearAllDemoData } from "@/app/actions/clear-demo-data"

export default function ClearDataPage() {
  const [isClearing, setIsClearing] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleClearData = async () => {
    if (!isConfirmed) {
      toast({
        title: "Confirmation required",
        description: "Please confirm that you want to clear all demo data by checking the confirmation box.",
        variant: "destructive",
      })
      return
    }

    setIsClearing(true)
    try {
      const result = await clearAllDemoData()

      if (result.success) {
        setSuccess(true)
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
      setIsClearing(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <span className="text-xl font-bold">Clear Demo Data</span>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        <div className="max-w-2xl mx-auto">
          {success ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-center text-2xl">Data Cleared Successfully</CardTitle>
                <CardDescription className="text-center">
                  All demo data has been removed from the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Your application is now ready for production use with real data.</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
                  onClick={() => router.push("/admin")}
                >
                  Return to Dashboard
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="h-16 w-16 text-amber-500" />
                </div>
                <CardTitle className="text-center text-2xl">Clear All Demo Data</CardTitle>
                <CardDescription className="text-center">
                  This action will permanently remove all demo data from the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Warning</h3>
                  <p className="text-amber-700 text-sm">This action will delete:</p>
                  <ul className="list-disc list-inside text-amber-700 text-sm mt-2 space-y-1">
                    <li>All demo blog posts</li>
                    <li>All demo events</li>
                    <li>All demo user accounts</li>
                    <li>Custom locations and categories</li>
                  </ul>
                  <p className="text-amber-700 text-sm mt-2">Default locations and categories will be preserved.</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="confirm"
                    className="rounded border-gray-300 text-[#b0468e] focus:ring-[#b0468e]"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                  />
                  <label htmlFor="confirm" className="text-sm font-medium">
                    I understand that this action cannot be undone and all demo data will be permanently deleted.
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/admin")} disabled={isClearing}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  disabled={isClearing || !isConfirmed}
                  className="flex items-center"
                >
                  {isClearing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Clearing Data...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Demo Data
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
