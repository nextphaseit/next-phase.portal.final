"use client"

import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState, createContext, useContext } from "react"
import { Loader2 } from "lucide-react"

// Create context for sidebar state
export const SidebarContext = createContext<{
  collapsed: boolean
  toggleCollapsed: () => void
}>({
  collapsed: false,
  toggleCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  // Initialize collapsed state from localStorage if available
  const [collapsed, setCollapsed] = useState(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed")
      return saved === "true" ? true : false
    }
    return false
  })

  // Function to toggle collapsed state
  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(newState))
    }
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to sign in
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <ModeToggle />
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}
