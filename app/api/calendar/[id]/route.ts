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
]

type RouteContext = {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params
    const event = mockEvents.find((e) => e.id === id)

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      event,
    })
  } catch (error) {
    console.error("Calendar Get Event Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch calendar event",
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params
    const body = await request.json()
    const { title, description, start, end, allDay, type } = body

    // Find existing event
    const eventIndex = mockEvents.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 },
      )
    }

    // Update event
    const updatedEvent: CalendarEvent = {
      ...mockEvents[eventIndex],
      title: title || mockEvents[eventIndex].title,
      description: description || mockEvents[eventIndex].description,
      start: start ? new Date(start).toISOString() : mockEvents[eventIndex].start,
      end: end ? new Date(end).toISOString() : mockEvents[eventIndex].end,
      allDay: allDay !== undefined ? allDay : mockEvents[eventIndex].allDay,
      type: type || mockEvents[eventIndex].type,
    }

    // In a real app, update in database
    mockEvents[eventIndex] = updatedEvent

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: "Event updated successfully",
    })
  } catch (error) {
    console.error("Calendar Update Event Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update calendar event",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = context.params
    const eventIndex = mockEvents.findIndex((e) => e.id === id)

    if (eventIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 },
      )
    }

    // In a real app, delete from database
    mockEvents.splice(eventIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    console.error("Calendar Delete Event Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete calendar event",
      },
      { status: 500 },
    )
  }
}
