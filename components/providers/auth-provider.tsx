"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading stored user:", error)
      localStorage.removeItem("user")
    }
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password
      // In production, this would make an actual API call
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.includes("microsoft") ? "Microsoft User" : "Demo User",
        email: email,
        role: email.includes("admin") ? "admin" : "user",
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } catch (error) {
      console.error("Sign-in error:", error)
      throw new Error("Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
