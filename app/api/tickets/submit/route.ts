import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Input validation schema
const TicketSubmissionSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  issueCategory: z.string().min(1, "Issue category is required").max(50, "Category too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description too long"),
})

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/gif",
  "application/zip",
]

export async function POST(request: NextRequest) {
  try {
    // Check if webhook URL is configured
    const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json({ success: false, message: "Service temporarily unavailable" }, { status: 503 })
    }

    const formData = await request.formData()

    // Extract and validate form fields
    const ticketData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      issueCategory: formData.get("issueCategory") as string,
      description: formData.get("description") as string,
    }

    // Validate input
    const validationResult = TicketSubmissionSchema.safeParse(ticketData)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    // Handle file attachments with validation
    const files = formData.getAll("attachments") as File[]
    const validAttachments = []

    for (const file of files) {
      if (file.size === 0) continue

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: `File ${file.name} exceeds 10MB limit` }, { status: 400 })
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, message: `File type ${file.type} not allowed` }, { status: 400 })
      }

      validAttachments.push({
        name: file.name,
        size: file.size,
        type: file.type,
        content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      })
    }

    // Generate secure ticket reference
    const ticketReference = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Prepare sanitized payload
    const payload = {
      ticketReference,
      fullName: validationResult.data.fullName.trim(),
      email: validationResult.data.email.toLowerCase().trim(),
      issueCategory: validationResult.data.issueCategory,
      description: validationResult.data.description.trim(),
      submissionDate: new Date().toISOString(),
      status: "Open",
      attachmentCount: validAttachments.length,
      attachments: validAttachments,
      userAgent: request.headers.get("user-agent") || "Unknown",
      ipAddress: request.headers.get("x-forwarded-for") || request.ip || "Unknown",
    }

    // Send to Power Automate with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "NextPhase-IT-HelpDesk/1.0",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`)
      }

      return NextResponse.json({
        success: true,
        ticketReference,
        message: "Ticket submitted successfully. You will receive a confirmation email shortly.",
      })
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json({ success: false, message: "Request timeout. Please try again." }, { status: 408 })
      }

      throw error
    }
  } catch (error) {
    // Log error securely (in production, use proper logging service)
    if (process.env.NODE_ENV === "production") {
      console.error("Ticket submission error:", {
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        // Don't log sensitive data in production
      })
    }

    return NextResponse.json(
      { success: false, message: "An error occurred while submitting your ticket. Please try again." },
      { status: 500 },
    )
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
}
