"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

// Create context for sidebar state
export const SidebarContext = createContext<{
  collapsed: boolean
  toggleCollapsed: () => void
}>({
  collapsed: false,
  toggleCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
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

  return <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>{children}</SidebarContext.Provider>
}
