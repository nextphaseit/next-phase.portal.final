"use client"

import { ReactNode } from "react"
import { SidebarProvider } from "@/app/context/SidebarContext"

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}
