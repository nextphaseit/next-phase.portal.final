"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, Clock, User, Calendar, FileText, AlertCircle, CheckCircle } from "lucide-react"
import type { SharePointTicket, TicketStatusResponse } from "@/types/sharepoint"

export function TicketStatusTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<TicketStatusResponse | null>(null)
  const [ticket, setTicket] = useState<SharePointTicket | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      setSearchResult({
        success: false,
        message: "Please enter an email address or ticket reference number",
      })
      return
    }

    setIsSearching(true)
    setSearchResult(null)
    setTicket(null)

    try {
      const response = await fetch(`/api/tickets/status?query=${encodeURIComponent(searchQuery.trim())}`)
      const result: TicketStatusResponse = await response.json()

      setSearchResult(result)
      if (result.success && result.ticket) {
        setTicket(result.ticket)
      }
    } catch (error) {
      setSearchResult({
        success: false,
        message: "Network error occurred. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <AlertCircle className="h-4 w-4" />
      case "In Progress":
        return <Clock className="h-4 w-4" />
      case "Resolved":
      case "Closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-brand-green/10 rounded-lg">
            <Search className="h-5 w-5 text-brand-green" />
          </div>
          Live Ticket Status Tracker
        </CardTitle>
        <CardDescription>
          Enter your email address or ticket reference number to check the current status of your NextPhase IT support
          request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="searchQuery" className="sr-only">
                Email or Ticket Reference
              </Label>
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter email address or ticket reference (e.g., TKT-123456)"
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        {searchResult && !searchResult.success && (
          <Alert className="mt-4 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">{searchResult.message}</AlertDescription>
          </Alert>
        )}

        {ticket && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ticket Details</h3>
              <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                {getStatusIcon(ticket.status)}
                {ticket.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-brand-blue">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-brand-blue" />
                    <span className="font-medium">Ticket Information</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Reference:</span> {ticket.ticketReference}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {ticket.issueCategory}
                    </div>
                    <div>
                      <span className="font-medium">Submitted by:</span> {ticket.fullName}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-brand-green">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-brand-green" />
                    <span className="font-medium">Timeline</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Submitted:</span> {formatDate(ticket.submissionDate)}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {formatDate(ticket.lastUpdated)}
                    </div>
                    {ticket.assignedTechnician && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">Assigned to:</span> {ticket.assignedTechnician}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="mb-2">
                  <span className="font-medium">Description:</span>
                </div>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{ticket.description}</p>
              </CardContent>
            </Card>

            {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="font-medium">Attachments:</span>
                  </div>
                  <div className="space-y-1">
                    {ticket.attachmentUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-blue hover:underline block"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
