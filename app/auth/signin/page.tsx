"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { Loader2, AlertCircle, Shield } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading, signIn } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Get the callback URL from search params
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      router.push(callbackUrl)
    }
  }, [user, isLoading, router, callbackUrl])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await signIn(email, password)
      // Redirect will happen automatically via useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMicrosoftSignIn = async () => {
    setError("")
    setIsSubmitting(true)

    try {
      // For demo - simulate Microsoft authentication with domain validation
      const demoEmail = "admin@nextphaseit.org"
      await signIn(demoEmail, "microsoft-auth")
      // Redirect will happen automatically via useEffect
    } catch (err) {
      setError(err instanceof Error ? err.message : "Microsoft sign-in failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading if checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render if already authenticated (will redirect)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <div className="flex justify-center">
            <div className="rounded-full bg-brand-blue/10 p-3">
              <Shield className="h-6 w-6 text-brand-blue" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Admin Sign In</CardTitle>
            <CardDescription>Access restricted to NextPhase IT administrators only</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Access Requirements:</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Only users with @nextphaseit.org email addresses can access the admin panel.
            </p>
          </div>

          <Button
            onClick={handleMicrosoftSignIn}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
            variant="outline"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#00BCF2" d="M0 0h11v11H0z" />
                  <path fill="#00BCF2" d="M13 0h11v11H13z" />
                  <path fill="#00BCF2" d="M0 13h11v11H0z" />
                  <path fill="#00BCF2" d="M13 13h11v11H13z" />
                </svg>
                Sign in with Microsoft
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@nextphaseit.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">← Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
