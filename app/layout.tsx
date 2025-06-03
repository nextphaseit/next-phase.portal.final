import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ThemeProvider from "@/components/theme-provider"
import SessionProvider from "@/components/providers/session-provider"
import { SidebarProvider } from "@/app/context/SidebarContext"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextPhase IT - Help Desk System",
  description: "Modern Help Desk and Service Management System",
  keywords: ["help desk", "IT support", "ticket management", "service desk"],
  authors: [{ name: "NextPhase IT" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get session server-side - this is a server component
  let session = null
  try {
    session = await getServerSession(authOptions)

  } catch (error) {
    // Gracefully handle auth errors in development
    if (process.env.NODE_ENV === "development") {
      console.warn("NextAuth session fetch failed:", error)
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SessionProvider session={session}>
              <SidebarProvider>
                {children}
                <Toaster />
              </SidebarProvider>
            </SessionProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
