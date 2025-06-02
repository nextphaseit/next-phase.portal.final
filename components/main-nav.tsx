"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-4 lg:space-x-6">
      <Logo size="sm" />
      <nav className="flex items-center space-x-4 lg:space-x-6">
        <Link
          href="/dashboard"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/tickets"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname?.startsWith("/tickets") ? "text-foreground" : "text-muted-foreground",
          )}
        >
          Tickets
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
        {process.env.NODE_ENV === "development" && (
          <Link
            href="/test-auth"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/test-auth" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            🧪 Test Auth
          </Link>
        )}
      </nav>
    </div>
  )
}
