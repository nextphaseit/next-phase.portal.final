import { type NextRequest, NextResponse } from "next/server"
import type { TicketStatusResponse, SharePointTicket } from "@/types/sharepoint"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ success: false, message: "Email or ticket reference is required" }, { status: 400 })
    }

    // Determine if query is email or ticket reference
    const isEmail = query.includes("@")
    const searchField = isEmail ? "email" : "ticketReference"

    // Call Power Automate flow to search SharePoint
    const searchWebhookUrl = process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL
    if (!searchWebhookUrl) {
      throw new Error("Power Automate search webhook URL not configured")
    }

    const searchPayload = {
      searchField,
      searchValue: query,
    }

    const response = await fetch(searchWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchPayload),
    })

    if (!response.ok) {
      throw new Error(`Power Automate search failed: ${response.status}`)
    }

    const result = await response.json()

    // Handle case where no ticket is found
    if (!result.ticket) {
      return NextResponse.json({
        success: false,
        message: "No ticket found with the provided information",
      } as TicketStatusResponse)
    }

    // Transform the response to match our SharePointTicket interface
    const ticket: SharePointTicket = {
      id: result.ticket.id,
      ticketReference: result.ticket.ticketReference,
      fullName: result.ticket.fullName,
      email: result.ticket.email,
      issueCategory: result.ticket.issueCategory,
      description: result.ticket.description,
      status: result.ticket.status,
      submissionDate: result.ticket.submissionDate,
      assignedTechnician: result.ticket.assignedTechnician,
      lastUpdated: result.ticket.lastUpdated,
      attachmentUrls: result.ticket.attachmentUrls,
    }

    return NextResponse.json({
      success: true,
      ticket,
      message: "Ticket found successfully",
    } as TicketStatusResponse)
  } catch (error) {
    console.error("Ticket status lookup error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to lookup ticket status",
        error: error instanceof Error ? error.message : "Unknown error",
      } as TicketStatusResponse,
      { status: 500 },
    )
  }
}
