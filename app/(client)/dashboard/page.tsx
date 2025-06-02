"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TicketSubmissionForm } from "@/components/dashboard/ticket-submission-form"
import { TicketStatusTracker } from "@/components/dashboard/ticket-status-tracker"
import { PlusCircle, Clock, CheckCircle, AlertCircle, FileText, Search, TrendingUp } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { IntegrationTest } from "@/components/dashboard/integration-test"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Manage your IT support requests and track ticket status.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-brand-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-brand-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-blue">3</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">2</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-brand-green">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-green">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <TrendingUp className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">2.4h</div>
            <p className="text-xs text-muted-foreground">-18% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="submit-ticket" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submit-ticket" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Submit New Ticket
          </TabsTrigger>
          <TabsTrigger value="track-status" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Track Ticket Status
          </TabsTrigger>
          <TabsTrigger value="integration-test" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Test Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit-ticket" className="space-y-6">
          <TicketSubmissionForm />
        </TabsContent>

        <TabsContent value="track-status" className="space-y-6">
          <TicketStatusTracker />
        </TabsContent>

        <TabsContent value="integration-test" className="space-y-6">
          <IntegrationTest />
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest support interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                action: "Ticket TKT-789012 was resolved",
                description: "Email configuration issue has been fixed",
                time: "2 hours ago",
                status: "resolved",
              },
              {
                id: 2,
                action: "New ticket TKT-456789 submitted",
                description: "Printer connectivity problem reported",
                time: "1 day ago",
                status: "open",
              },
              {
                id: 3,
                action: "Ticket TKT-123456 updated",
                description: "Technician assigned and working on hardware issue",
                time: "2 days ago",
                status: "in-progress",
              },
            ].map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                <div
                  className={`p-2 rounded-full ${
                    activity.status === "resolved"
                      ? "bg-green-100"
                      : activity.status === "in-progress"
                        ? "bg-blue-100"
                        : "bg-red-100"
                  }`}
                >
                  {activity.status === "resolved" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : activity.status === "in-progress" ? (
                    <Clock className="h-4 w-4 text-blue-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
