"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Log error to monitoring service
  if (process.env.NODE_ENV === "production") {
    console.error("Global error:", {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Application Error</h1>
              <p className="text-muted-foreground mb-6">
                A critical error occurred. Our team has been notified and is working to resolve the issue.
              </p>
              <div className="space-y-3">
                <Button onClick={reset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Button>
              </div>
              {process.env.NODE_ENV === "development" && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {error.message}
                    {error.stack && `\n\n${error.stack}`}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
