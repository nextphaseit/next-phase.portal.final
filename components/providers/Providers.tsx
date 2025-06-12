"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./auth-provider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
