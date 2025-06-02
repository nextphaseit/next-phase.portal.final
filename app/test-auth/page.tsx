"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, User, Mail, Shield, Clock } from "lucide-react"
import Link from "next/link"

export default function TestAuthPage() {
  const { user, isLoading, signOut } = useAuth()

  return (
    <div className="container py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Authentication Test Page</h1>
        <p className="text-muted-foreground">Test the authentication flow and protected routes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {user ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
              Authentication Status
            </CardTitle>
            <CardDescription>Current authentication state and user information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={user ? "default" : "destructive"}>
                {isLoading ? "Loading..." : user ? "Authenticated" : "Not Authenticated"}
              </Badge>
            </div>

            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name:
                  </span>
                  <span className="text-sm">{user.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email:
                  </span>
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Role:
                  </span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Session:
                  </span>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </>
            )}

            <div className="pt-4 space-y-2">
              {user ? (
                <Button onClick={signOut} variant="outline" className="w-full">
                  Sign Out
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Protected Routes Test */}
        <Card>
          <CardHeader>
            <CardTitle>Protected Routes Test</CardTitle>
            <CardDescription>Test access to protected pages and functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dashboard:</span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard">Test Access</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">My Tickets:</span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/tickets">Test Access</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Ticket:</span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/tickets/new">Test Access</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Admin Panel:</span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin">Test Access</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Knowledge Base:</span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/knowledge">Test Access</Link>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Services:</span>
                <Button asChild size="sm" variant="outline">
                  <Link href="/services">Test Access</Link>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                {user
                  ? "✅ You should have access to all protected routes"
                  : "❌ You should be redirected to sign-in for protected routes"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Authentication Flow Test */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Flow Test</CardTitle>
          <CardDescription>Step-by-step authentication testing guide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">🔐 Test Sign-In Flow:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Click "Sign Out" if currently signed in</li>
                  <li>Try accessing a protected route (should redirect to /auth/signin)</li>
                  <li>Go to sign-in page at /auth/signin</li>
                  <li>Use Microsoft sign-in or email/password</li>
                  <li>Verify redirect to dashboard or original page</li>
                </ol>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">🛡️ Test Protection:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Sign out completely</li>
                  <li>Try direct URL access to /dashboard</li>
                  <li>Try direct URL access to /tickets</li>
                  <li>Try direct URL access to /admin</li>
                  <li>Verify all redirect to sign-in</li>
                </ol>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href="/auth/signin">Go to Sign-In</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard">Test Dashboard</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/tickets/new">Test New Ticket</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin">Test Admin</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
