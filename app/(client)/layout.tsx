import type React from "react"
import { Header } from "@/components/header"
import { AnnouncementBanner } from "@/components/announcement-banner"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
