"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import SupabaseProvider from "./SupabaseProvider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SupabaseProvider>{children}</SupabaseProvider>
    </ThemeProvider>
  )
}
