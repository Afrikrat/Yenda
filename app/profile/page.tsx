"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, Heart, Calendar, Edit, Save, Settings, MessageSquare, Bell, Eye } from "lucide-react"
import { supabase, refreshToken } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import MediaUpload from "@/components/media-upload"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  preferences?: UserPreferences
}

interface UserPreferences {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  dark_mode: boolean
  location_services: boolean
  event_categories: string[]
}

interface SavedEvent {
  id: string
  title: string
  date: string
  image_url: string | null
  slug: string
}

interface RsvpEvent {
  id: string
  title: string
  date: string
  image_url: string | null
  slug: string
}

interface Comment {
  id: string
  content: string
  created_at: string
  post_title: string
  post_slug: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([])
  const [rsvpEvents, setRsvpEvents] = useState<RsvpEvent[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedPhone, setEditedPhone] = useState("")
  const [editedAvatar, setEditedAvatar] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    push_notifications: false,
    sms_notifications: false,
    dark_mode: false,
    location_services: true,
    event_categories: [],
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    setLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login?redirect=/profile")
        return
      }

      await fetchUserData(session.user.id)
    } catch (error) {
      console.error("Error checking user:", error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        // If JWT expired, try to refresh the token and fetch again
        if (profileError.message.includes("JWT")) {
          const refreshed = await refreshToken()
          if (refreshed) {
            return fetchUserData(userId)
          }
        }

        console.error("Error fetching profile:", profileError)
        throw profileError
      }

      setProfile(profileData)
      setEditedName(profileData.full_name || "")
      setEditedPhone(profileData.phone || "")
      setEditedAvatar(profileData.avatar_url || "")

      // Get user preferences
      const { data: preferencesData } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (preferencesData) {
        setPreferences({
          email_notifications: preferencesData.email_notifications || true,
          push_notifications: preferencesData.push_notifications || false,
          sms_notifications: preferencesData.sms_notifications || false,
          dark_mode: preferencesData.dark_mode || false,
          location_services: preferencesData.location_services || true,
          event_categories: preferencesData.event_categories || [],
        })
      }

      // Get user auth data
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      setUser(authUser)

      // Fetch saved events
      const { data: savedEventsData, error: savedEventsError } = await supabase
        .from("saved_events")
        .select(`
          event_id,
          events (
            id,
            title,
            date,
            image_url,
            slug
          )
        `)
        .eq("user_id", userId)
        .limit(10)

      if (savedEventsError) {
        console.error("Error fetching saved events:", savedEventsError)
      } else {
        setSavedEvents(savedEventsData.map((item) => item.events) || [])
      }

      // Fetch RSVP events
      const { data: rsvpEventsData, error: rsvpEventsError } = await supabase
        .from("rsvps")
        .select(`
          event_id,
          events (
            id,
            title,
            date,
            image_url,
            slug
          )
        `)
        .eq("user_id", userId)
        .limit(10)

      if (rsvpEventsError) {
        console.error("Error fetching RSVP events:", rsvpEventsError)
      } else {
        setRsvpEvents(rsvpEventsData.map((item) => item.events) || [])
      }

      // Fetch user comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          blog_posts (
            title,
            slug
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (commentsError) {
        console.error("Error fetching comments:", commentsError)
      } else {
        setComments(
          commentsData.map((item) => ({
            id: item.id,
            content: item.content,
            created_at: item.created_at,
            post_title: item.blog_posts.title,
            post_slug: item.blog_posts.slug,
          })) || [],
        )
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editedName,
          phone: editedPhone,
          avatar_url: editedAvatar,
        })
        .eq("id", profile.id)

      if (error) throw error

      // Update preferences
      const { error: prefError } = await supabase.from("user_preferences").upsert({
        user_id: profile.id,
        email_notifications: preferences.email_notifications,
        push_notifications: preferences.push_notifications,
        sms_notifications: preferences.sms_notifications,
        dark_mode: preferences.dark_mode,
        location_services: preferences.location_services,
        event_categories: preferences.event_categories,
      })

      if (prefError) throw prefError

      // Update local state
      setProfile({
        ...profile,
        full_name: editedName,
        phone: editedPhone,
        avatar_url: editedAvatar,
        preferences,
      })

      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePreference = (key: keyof UserPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b0468e]"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image src="/images/yenda-logo.png" alt="Yenda" width={180} height={60} className="mx-auto" />
          </Link>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => router.push("/login?redirect=/profile")}
              className="bg-[#b0468e] hover:bg-[#b0468e]/90 text-white"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4">
            <Image
              src={profile.avatar_url || "/placeholder.svg?height=200&width=200"}
              alt={profile.full_name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">{profile.full_name || "User"}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-[#b0468e]" />
                  Saved Events
                </CardTitle>
                <CardDescription>Events you've saved for later.</CardDescription>
              </CardHeader>
              <CardContent>
                {savedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedEvents.map((event) => (
                      <Link key={event.id} href={`/events/${event.slug}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={event.image_url || "/placeholder.svg?height=200&width=200"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium line-clamp-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">You haven't saved any events yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-[#b0468e]" />
                  My RSVPs
                </CardTitle>
                <CardDescription>Events you're attending.</CardDescription>
              </CardHeader>
              <CardContent>
                {rsvpEvents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rsvpEvents.map((event) => (
                      <Link key={event.id} href={`/events/${event.slug}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={event.image_url || "/placeholder.svg?height=200&width=200"}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium line-clamp-1">{event.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">You haven't RSVP'd to any events yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-[#b0468e]" />
                  My Comments
                </CardTitle>
                <CardDescription>Your recent comments on blog posts.</CardDescription>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            href={`/blog/${comment.post_slug}`}
                            className="font-medium hover:text-[#b0468e] transition-colors"
                          >
                            {comment.post_title}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">You haven't made any comments yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-[#b0468e]" />
                  Recently Viewed
                </CardTitle>
                <CardDescription>Events and posts you've recently viewed.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Event</Badge>
                      <span className="font-medium">Summer Music Festival</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Blog</Badge>
                      <span className="font-medium">How to Plan the Perfect Event</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Yesterday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-[#b0468e]" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your device.</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.push_notifications}
                    onCheckedChange={(checked) => handleTogglePreference("push_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => handleTogglePreference("email_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS.</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.sms_notifications}
                    onCheckedChange={(checked) => handleTogglePreference("sms_notifications", checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#b0468e] hover:opacity-90 transition-opacity"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-[#b0468e]" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your app experience.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme throughout the app.</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={preferences.dark_mode}
                    onCheckedChange={(checked) => handleTogglePreference("dark_mode", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-services">Location Services</Label>
                    <p className="text-sm text-muted-foreground">Allow app to access your location.</p>
                  </div>
                  <Switch
                    id="location-services"
                    checked={preferences.location_services}
                    onCheckedChange={(checked) => handleTogglePreference("location_services", checked)}
                  />
                </div>

                <Separator className="my-4" />

                <div>
                  <Label className="mb-2 block">Event Categories</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select categories you're interested in.</p>
                  <div className="flex flex-wrap gap-2">
                    {["Music", "Food", "Sports", "Art", "Technology", "Business", "Education"].map((category) => (
                      <Badge
                        key={category}
                        variant={preferences.event_categories.includes(category) ? "default" : "outline"}
                        className={
                          preferences.event_categories.includes(category)
                            ? "bg-[#b0468e] hover:bg-[#b0468e]/90 cursor-pointer"
                            : "hover:bg-muted cursor-pointer"
                        }
                        onClick={() => {
                          const newCategories = preferences.event_categories.includes(category)
                            ? preferences.event_categories.filter((c) => c !== category)
                            : [...preferences.event_categories, category]
                          setPreferences({ ...preferences, event_categories: newCategories })
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-[#b0468e] hover:opacity-90 transition-opacity"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  // Edit mode
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email} disabled className="bg-gray-100" />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden">
                          <Image
                            src={editedAvatar || "/placeholder.svg?height=200&width=200"}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <MediaUpload value={editedAvatar} onChange={setEditedAvatar} />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div className="space-y-1">
                      <Label>Name</Label>
                      <p className="text-sm font-medium">{profile.full_name || "Not provided"}</p>
                    </div>

                    <div className="space-y-1">
                      <Label>Email</Label>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                      <Label>Phone</Label>
                      <p className="text-sm font-medium">{profile.phone || "Not provided"}</p>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {isEditing ? (
                  <Button
                    className="w-full bg-[#b0468e] hover:bg-[#b0468e]/90 text-white"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
