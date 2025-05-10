"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import slugify from "slugify"

interface Category {
  id: string
  name: string
  slug: string
  created_at?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const slug = slugify(newCategoryName, { lower: true, strict: true })

      const { data, error } = await supabase.from("categories").insert({ name: newCategoryName, slug }).select()

      if (error) throw error

      setCategories([...categories, data[0]])
      setNewCategoryName("")
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error: any) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id)

      if (error) throw error

      setCategories(categories.filter((category) => category.id !== id))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
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
            <span className="text-xl font-bold">Manage Categories</span>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>Create a new category for events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="categoryName"
                      placeholder="Enter category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button
                      onClick={handleAddCategory}
                      disabled={isSaving || !newCategoryName.trim()}
                      className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Categories</CardTitle>
              <CardDescription>Manage your event categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b0468e]"></div>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No categories found. Add your first category!</p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Total categories: {categories.length}</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
