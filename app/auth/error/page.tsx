"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { AlertTriangle, Home } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>{getErrorMessage(error)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href="/api/auth/signin">Try Again</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
          {error && <div className="text-center text-sm text-muted-foreground">Error code: {error}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
