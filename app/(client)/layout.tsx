import type React from "react"
import { Header } from "@/components/header"
import { AnnouncementBanner } from "@/components/announcement-banner"

// Server component only - no additional exports or client code
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock announcement data - in production, this would be fetched server-side
  const announcement = {
    id: "1",
    title: "System Maintenance",
    content: "Scheduled maintenance on June 5th from 2-4 AM EST. Some services may be unavailable.",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner announcement={announcement} />
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NextPhase IT. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="/terms" className="hover:underline">
              Terms
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
