import { type NextRequest, NextResponse } from "next/server"
import type { TicketSubmission, PowerAutomateResponse } from "@/types/sharepoint"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const ticketData: TicketSubmission = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      issueCategory: formData.get("issueCategory") as string,
      description: formData.get("description") as string,
    }

    // Validate required fields
    if (!ticketData.fullName || !ticketData.email || !ticketData.issueCategory || !ticketData.description) {
      return NextResponse.json({ success: false, message: "All required fields must be filled" }, { status: 400 })
    }

    // Handle file attachments
    const files = formData.getAll("attachments") as File[]
    const attachments = files.filter((file) => file.size > 0)

    // Generate ticket reference
    const ticketReference = `TKT-${Date.now().toString().slice(-6)}`

    // Prepare payload for Power Automate
    const powerAutomatePayload = {
      ticketReference,
      fullName: ticketData.fullName,
      email: ticketData.email,
      issueCategory: ticketData.issueCategory,
      description: ticketData.description,
      submissionDate: new Date().toISOString(),
      status: "Open",
      attachmentCount: attachments.length,
      // Convert files to base64 for Power Automate if needed
      attachments: await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          content: Buffer.from(await file.arrayBuffer()).toString("base64"),
        })),
      ),
    }

    // Send to Power Automate webhook
    const webhookUrl = process.env.POWER_AUTOMATE_WEBHOOK_URL
    if (!webhookUrl) {
      throw new Error("Power Automate webhook URL not configured")
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(powerAutomatePayload),
    })

    if (!response.ok) {
      throw new Error(`Power Automate webhook failed: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      ticketReference,
      message: "Ticket submitted successfully",
    } as PowerAutomateResponse)
  } catch (error) {
    console.error("Ticket submission error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit ticket",
        error: error instanceof Error ? error.message : "Unknown error",
      } as PowerAutomateResponse,
      { status: 500 },
    )
  }
}
