"use client"

import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/providers/auth-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function Header() {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]" />
          </div>
          <ModeToggle />
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <UserNav />
          ) : (
            <Button variant="default" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium" asChild>
              <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`}>Admin Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
