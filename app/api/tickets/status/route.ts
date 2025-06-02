import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Input validation schema
const TicketQuerySchema = z.object({
  query: z.string().min(1, "Query is required").max(255, "Query too long"),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    // Validate input
    const validationResult = TicketQuerySchema.safeParse({ query })
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameter",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const sanitizedQuery = validationResult.data.query.trim()

    // Check if search webhook URL is configured
    const searchWebhookUrl = process.env.POWER_AUTOMATE_SEARCH_WEBHOOK_URL
    if (!searchWebhookUrl) {
      return NextResponse.json({ success: false, message: "Search service temporarily unavailable" }, { status: 503 })
    }

    // Determine search type and validate format
    const isEmail = sanitizedQuery.includes("@")
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(sanitizedQuery)) {
        return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
      }
    } else {
      // Validate ticket reference format
      const ticketRegex = /^TKT-[A-Z0-9-]+$/i
      if (!ticketRegex.test(sanitizedQuery)) {
        return NextResponse.json({ success: false, message: "Invalid ticket reference format" }, { status: 400 })
      }
    }

    const searchField = isEmail ? "email" : "ticketReference"
    const searchPayload = {
      searchField,
      searchValue: sanitizedQuery.toLowerCase(),
      timestamp: new Date().toISOString(),
    }

    // Send search request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

    try {
      const response = await fetch(searchWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "NextPhase-IT-HelpDesk/1.0",
        },
        body: JSON.stringify(searchPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Search webhook failed with status: ${response.status}`)
      }

      const result = await response.json()

      // Handle case where no ticket is found
      if (!result.ticket) {
        return NextResponse.json({
          success: false,
          message: "No ticket found with the provided information",
        })
      }

      // Sanitize response data
      const ticket = {
        id: result.ticket.id,
        ticketReference: result.ticket.ticketReference,
        fullName: result.ticket.fullName,
        email: result.ticket.email,
        issueCategory: result.ticket.issueCategory,
        description: result.ticket.description,
        status: result.ticket.status,
        submissionDate: result.ticket.submissionDate,
        assignedTechnician: result.ticket.assignedTechnician || null,
        lastUpdated: result.ticket.lastUpdated,
        attachmentUrls: result.ticket.attachmentUrls || [],
      }

      return NextResponse.json({
        success: true,
        ticket,
        message: "Ticket found successfully",
      })
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json({ success: false, message: "Search timeout. Please try again." }, { status: 408 })
      }

      throw error
    }
  } catch (error) {
    // Log error securely
    if (process.env.NODE_ENV === "production") {
      console.error("Ticket search error:", {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    return NextResponse.json(
      { success: false, message: "An error occurred while searching for tickets. Please try again." },
      { status: 500 },
    )
  }
}

// Only allow GET method
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
