"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash, Edit, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface User {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // Get profiles from Supabase
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Get user emails from auth
      const { data: authData } = await supabase.auth.admin.listUsers()

      const usersWithEmail =
        profiles?.map((profile) => {
          const authUser = authData?.users.find((user) => user.id === profile.id)
          return {
            ...profile,
            email: authUser?.email || "No email found",
          }
        }) || []

      setUsers(usersWithEmail)
    } catch (error: any) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      // Delete user profile
      const { error: profileError } = await supabase.from("profiles").delete().eq("id", id)

      if (profileError) throw profileError

      // Delete user auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) throw authError

      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      })

      setUsers(users.filter((user) => user.id !== id))
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (user.full_name && user.full_name.toLowerCase().includes(searchLower)) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchQuery))
    )
  })

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
            <span className="text-xl font-bold">Manage Users</span>
          </div>
          <Link href="/admin/users/new">
            <Button className="bg-[#b0468e] text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-6 mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts for your application.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-4">No users found.</div>
            ) : (
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Joined</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">{user.full_name || "Unnamed User"}</td>
                          <td className="p-4 align-middle">{user.email}</td>
                          <td className="p-4 align-middle">{user.phone || "—"}</td>
                          <td className="p-4 align-middle">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/users/edit/${user.id}`}>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
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
                                    <DialogTitle>Delete User</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this user? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button variant="outline">Cancel</Button>
                                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
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
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Total users: <strong>{users.length}</strong>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
