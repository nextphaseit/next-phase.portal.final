"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Logo size="sm" variant="auto" />
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/tickets/new"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith("/tickets") ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Submit Ticket
        </Link>
        <Link
          href="/knowledge"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/knowledge" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Knowledge Base
        </Link>
        <Link
          href="/services"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/services" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Services
        </Link>
      </nav>
    </div>
  )
}
