"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, Settings } from "lucide-react"

interface AuthFallbackProps {
  error?: string
}

export default function AuthFallback({ error }: AuthFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      window.location.reload()
    } catch (err) {
      console.error("Retry failed:", err)
    } finally {
      setIsRetrying(false)
    }
  }

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Authentication Setup Required</CardTitle>
          </div>
          <CardDescription>NextAuth.js configuration needs to be completed for authentication to work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Required environment variables:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>NEXTAUTH_SECRET</li>
              <li>NEXTAUTH_URL</li>
              <li>MICROSOFT_CLIENT_ID</li>
              <li>MICROSOFT_CLIENT_SECRET</li>
              <li>MICROSOFT_TENANT_ID</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRetry} disabled={isRetrying} className="flex-1">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
              {isRetrying ? "Retrying..." : "Retry"}
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex-1">
              <Settings className="mr-2 h-4 w-4" />
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
