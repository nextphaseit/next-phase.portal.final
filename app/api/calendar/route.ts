import { type NextRequest, NextResponse } from "next/server"
import type { CalendarEvent } from "@/types"

// Mock calendar events data
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "System Maintenance",
    description: "Scheduled server maintenance window",
    start: "2024-12-15T02:00:00.000Z",
    end: "2024-12-15T04:00:00.000Z",
    allDay: false,
    type: "maintenance",
    color: "#f59e0b",
  },
  {
    id: "2",
    title: "Security Update",
    description: "Critical security patches deployment",
    start: "2024-12-20T18:00:00.000Z",
    end: "2024-12-20T20:00:00.000Z",
    allDay: false,
    type: "alert",
    color: "#ef4444",
  },
  {
    id: "3",
    title: "Company Holiday",
    description: "Christmas Day - Office Closed",
    start: "2024-12-25T00:00:00.000Z",
    allDay: true,
    type: "holiday",
    color: "#10b981",
  },
  {
    id: "4",
    title: "Network Upgrade",
    description: "Infrastructure upgrade - possible brief outages",
    start: "2024-12-28T01:00:00.000Z",
    end: "2024-12-28T05:00:00.000Z",
    allDay: false,
    type: "maintenance",
    color: "#f59e0b",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")
    const type = searchParams.get("type")

    let filteredEvents = mockEvents

    // Filter by date range if provided
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      filteredEvents = filteredEvents.filter((event) => {
        const eventStart = new Date(event.start)
        return eventStart >= startDate && eventStart <= endDate
      })
    }

    // Filter by type if provided
    if (type && type !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.type === type)
    }

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      total: filteredEvents.length,
    })
  } catch (error) {
    console.error("Calendar API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch calendar events",
        events: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, start, end, allDay, type } = body

    // Validate required fields
    if (!title || !start || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, start, type",
        },
        { status: 400 },
      )
    }

    // Create new event
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      description,
      start: new Date(start).toISOString(),
      end: end ? new Date(end).toISOString() : undefined,
      allDay: allDay || false,
      type,
      color: getColorForType(type),
    }

    // In a real app, save to database
    // For now, just return the created event
    return NextResponse.json({
      success: true,
      event: newEvent,
      message: "Event created successfully",
    })
  } catch (error) {
    console.error("Calendar Create Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create calendar event",
      },
      { status: 500 },
    )
  }
}

function getColorForType(type: string): string {
  const colors = {
    maintenance: "#f59e0b",
    alert: "#ef4444",
    holiday: "#10b981",
    ticket: "#3b82f6",
  }
  return colors[type as keyof typeof colors] || "#6b7280"
}
