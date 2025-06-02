"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

const mockTickets = [
  {
    id: "1",
    reference: "TKT-001",
    title: "Cannot access email",
    status: "open",
    priority: "high",
    category: "Email",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    reference: "TKT-002",
    title: "Software installation request",
    status: "in-progress",
    priority: "medium",
    category: "Software",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-15",
  },
  {
    id: "3",
    reference: "TKT-003",
    title: "Network connectivity issues",
    status: "resolved",
    priority: "high",
    category: "Network",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-14",
  },
]

export default function TicketsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "destructive",
      "in-progress": "default",
      resolved: "secondary",
      closed: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status.replace("-", " ")}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const

    return <Badge variant={variants[priority as keyof typeof variants] || "default"}>{priority}</Badge>
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
          <p className="text-muted-foreground">View and manage your support tickets.</p>
        </div>
        <Button asChild>
          <Link href="/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
          <CardDescription>All your submitted support tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <CardDescription>
                        {ticket.reference} • {ticket.category} • Created {ticket.createdAt}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Last updated: {ticket.updatedAt}</div>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
