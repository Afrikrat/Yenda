"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  useEffect(() => {
    // Initial user fetch
    refreshUser()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>{children}</AuthContext.Provider>
}
