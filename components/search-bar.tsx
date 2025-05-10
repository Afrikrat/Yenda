"use client"

import type React from "react"

import { Search, MapPin, Calendar, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface Town {
  id: string
  name: string
  region: string
}

interface Category {
  id: string
  name: string
  slug: string
}

// Default categories to use as fallback
const DEFAULT_CATEGORIES: Category[] = [
  { id: "music", name: "Music", slug: "music" },
  { id: "sports", name: "Sports", slug: "sports" },
  { id: "food", name: "Food & Drink", slug: "food-drink" },
  { id: "arts", name: "Arts & Culture", slug: "arts-culture" },
  { id: "community", name: "Community", slug: "community" },
]

// Default towns to use as fallback
const DEFAULT_TOWNS: Town[] = [
  { id: "london", name: "London", region: "Greater London" },
  { id: "manchester", name: "Manchester", region: "Greater Manchester" },
  { id: "birmingham", name: "Birmingham", region: "West Midlands" },
  { id: "edinburgh", name: "Edinburgh", region: "Scotland" },
]

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dateRange, setDateRange] = useState([0, 30])
  const [towns, setTowns] = useState<Town[]>(DEFAULT_TOWNS)
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Load any existing search params
    const q = searchParams.get("q")
    const location = searchParams.get("location")
    const category = searchParams.get("category")
    const dateMin = searchParams.get("dateMin")
    const dateMax = searchParams.get("dateMax")

    if (q) setSearchTerm(q)
    if (location) setSelectedLocation(location)
    if (category) setSelectedCategory(category)
    if (dateMin && dateMax) setDateRange([Number.parseInt(dateMin), Number.parseInt(dateMax)])

    // Fetch towns and categories
    fetchTowns()
    fetchCategories()
  }, []) // Empty dependency array to run only once on mount

  const fetchTowns = async () => {
    try {
      setFetchError(false)
      const { data, error } = await supabase.from("towns").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Supabase error fetching towns:", error)
        return // Keep using the default towns
      }

      if (data && data.length > 0) {
        setTowns(data)
      }
    } catch (error) {
      console.error("Error fetching towns:", error)
      // Keep using the default towns
    }
  }

  const fetchCategories = async () => {
    try {
      setFetchError(false)
      const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

      if (error) {
        console.error("Supabase error fetching categories:", error)
        setFetchError(true)
        return // Keep using the default categories
      }

      if (data && data.length > 0) {
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setFetchError(true)
      // Keep using the default categories
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    applyFilters({ category })
  }

  const handleLocationClick = (location: string) => {
    setSelectedLocation(location)
    applyFilters({ location })
  }

  const applyFilters = (overrides: Record<string, string> = {}) => {
    setIsLoading(true)

    // Build query params
    const params = new URLSearchParams()

    if (searchTerm || overrides.q) params.set("q", overrides.q || searchTerm)
    if (selectedLocation !== "all" || overrides.location) params.set("location", overrides.location || selectedLocation)
    if (selectedCategory !== "all" || overrides.category) params.set("category", overrides.category || selectedCategory)
    params.set("dateMin", overrides.dateMin || dateRange[0].toString())
    params.set("dateMax", overrides.dateMax || dateRange[1].toString())

    // Close filter sheet if open
    setIsOpen(false)

    // Navigate with the filters
    router.push(`/?${params.toString()}`)

    toast({
      title: "Filters applied",
      description: "Your search filters have been applied.",
    })

    setIsLoading(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedLocation("all")
    setSelectedCategory("all")
    setDateRange([0, 30])
    router.push("/")
    setIsOpen(false)
  }

  // Retry fetching if there was an error
  const handleRetryFetch = () => {
    setRetryCount(retryCount + 1)
    fetchCategories()
    fetchTowns()
  }

  return (
    <div className="relative mb-6 space-y-2">
      {fetchError && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded-md mb-2">
          <div className="flex justify-between items-center">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              Unable to load all filters. Using default values.
            </p>
            <Button variant="ghost" size="sm" onClick={handleRetryFetch} className="text-amber-800 dark:text-amber-200">
              Retry
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-9 pr-4 py-6 rounded-full border-gray-300 dark:border-gray-700 focus-visible:ring-[#b0468e]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12 flex-shrink-0">
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader className="text-left pb-4">
              <SheetTitle>Filter Events</SheetTitle>
            </SheetHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {towns.map((town) => (
                      <SelectItem key={town.id} value={town.id}>
                        {town.name}, {town.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                  <div className="flex flex-wrap gap-2">
                    <Label
                      htmlFor="all"
                      className="flex items-center px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 [&:has(:checked)]:bg-[#b0468e]/10 dark:[&:has(:checked)]:bg-[#b0468e]/20 [&:has(:checked)]:border-[#b0468e]"
                    >
                      <RadioGroupItem id="all" value="all" className="sr-only" />
                      All
                    </Label>
                    {categories.map((category) => (
                      <Label
                        key={category.id}
                        htmlFor={category.id}
                        className="flex items-center px-3 py-2 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 [&:has(:checked)]:bg-[#b0468e]/10 dark:[&:has(:checked)]:bg-[#b0468e]/20 [&:has(:checked)]:border-[#b0468e]"
                      >
                        <RadioGroupItem id={category.id} value={category.id} className="sr-only" />
                        {category.name}
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Today</span>
                  <span className="text-sm text-muted-foreground">Next 30 days</span>
                </div>
                <Slider value={dateRange} max={30} step={1} onValueChange={setDateRange} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {dateRange[0] === 0 ? "Today" : `+${dateRange[0]} ${dateRange[0] === 1 ? "day" : "days"}`}
                  </span>
                  <span>
                    {dateRange[1] === 30 ? "30 days" : `+${dateRange[1]} ${dateRange[1] === 1 ? "day" : "days"}`}
                  </span>
                </div>
              </div>
            </div>
            <SheetFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
              <Button
                className="w-full bg-[#b0468e] text-white hover:opacity-90 transition-opacity"
                onClick={() => applyFilters()}
                disabled={isLoading}
              >
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={selectedLocation === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full flex gap-1 whitespace-nowrap"
          onClick={() => handleLocationClick("all")}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>All Locations</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full flex gap-1 whitespace-nowrap"
          onClick={() => {
            const today = new Date()
            const weekend = new Date()
            weekend.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7) + 2) // Next weekend
            applyFilters({
              dateMin: "3",
              dateMax: "5",
            })
          }}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>This Weekend</span>
        </Button>
        {categories.slice(0, 5).map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className="rounded-full whitespace-nowrap"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
