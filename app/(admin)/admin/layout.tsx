"use client"

import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2, LogOut } from "lucide-react"
import { SidebarProvider, useSidebar } from "@/app/context/SidebarContext"
import { Button } from "@/components/ui/button"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${collapsed ? "md:ml-16" : "md:ml-64"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

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
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  )
}
