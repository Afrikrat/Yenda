"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Trash, Edit } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Town {
  id: string
  name: string
  region: string
  created_at: string
}

export default function LocationsPage() {
  const [towns, setTowns] = useState<Town[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newTownName, setNewTownName] = useState("")
  const [newTownRegion, setNewTownRegion] = useState("Western North")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTown, setEditingTown] = useState<Town | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTowns()
  }, [])

  const fetchTowns = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("towns").select("*").order("name", { ascending: true })

      if (error) throw error

      setTowns(data || [])
    } catch (error: any) {
      console.error("Error fetching towns:", error)
      toast({
        title: "Error",
        description: "Failed to fetch locations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTown = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTownName.trim()) return

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase
        .from("towns")
        .insert({
          name: newTownName.trim(),
          region: newTownRegion.trim(),
        })
        .select()

      if (error) throw error

      toast({
        title: "Location added",
        description: `${newTownName} has been added successfully.`,
      })

      setTowns([...(data || []), ...towns])
      setNewTownName("")
    } catch (error: any) {
      console.error("Error adding town:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTown = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTown) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from("towns")
        .update({
          name: editingTown.name,
          region: editingTown.region,
        })
        .eq("id", editingTown.id)

      if (error) throw error

      toast({
        title: "Location updated",
        description: `${editingTown.name} has been updated successfully.`,
      })

      setTowns(towns.map((town) => (town.id === editingTown.id ? editingTown : town)))
      setEditingTown(null)
    } catch (error: any) {
      console.error("Error updating town:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTown = async (id: string) => {
    try {
      const { error } = await supabase.from("towns").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Location deleted",
        description: "The location has been deleted successfully.",
      })

      setTowns(towns.filter((town) => town.id !== id))
    } catch (error: any) {
      console.error("Error deleting town:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete location. Please try again.",
        variant: "destructive",
      })
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
            <span className="text-xl font-bold">Manage Locations</span>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
                <CardDescription>Manage towns and cities for events.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading locations...</div>
                ) : towns.length === 0 ? (
                  <div className="text-center py-4">No locations found. Add your first location.</div>
                ) : (
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Region</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {towns.map((town) => (
                            <tr
                              key={town.id}
                              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                              <td className="p-4 align-middle font-medium">{town.name}</td>
                              <td className="p-4 align-middle">{town.region}</td>
                              <td className="p-4 align-middle text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setEditingTown(town)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                      >
                                        <Trash className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Delete Location</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to delete {town.name}? This action cannot be undone.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button variant="outline">Cancel</Button>
                                        <Button variant="destructive" onClick={() => handleDeleteTown(town.id)}>
                                          Delete
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{editingTown ? "Edit Location" : "Add New Location"}</CardTitle>
                <CardDescription>
                  {editingTown ? "Update location details" : "Add a new town or city for events"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingTown ? handleUpdateTown : handleAddTown} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Sefwi Wiawso"
                      value={editingTown ? editingTown.name : newTownName}
                      onChange={(e) =>
                        editingTown
                          ? setEditingTown({ ...editingTown, name: e.target.value })
                          : setNewTownName(e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      placeholder="e.g., Western North"
                      value={editingTown ? editingTown.region : newTownRegion}
                      onChange={(e) =>
                        editingTown
                          ? setEditingTown({ ...editingTown, region: e.target.value })
                          : setNewTownRegion(e.target.value)
                      }
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {editingTown && (
                  <Button variant="outline" onClick={() => setEditingTown(null)}>
                    Cancel
                  </Button>
                )}
                <Button
                  className={`${editingTown ? "" : "w-full"} bg-[#b0468e] text-white hover:opacity-90 transition-opacity`}
                  onClick={editingTown ? handleUpdateTown : handleAddTown}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingTown
                      ? "Updating..."
                      : "Adding..."
                    : editingTown
                      ? "Update Location"
                      : "Add Location"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
