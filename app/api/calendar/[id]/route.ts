import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Path to the JSON file that stores events
const dataFilePath = path.join(process.cwd(), "data", "calendar-events.json")

// Get a specific event by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const data = fs.readFileSync(dataFilePath, "utf8")
    const events = JSON.parse(data)

    const event = events.find((e: any) => e.id === params.id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

// Update an event
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const data = fs.readFileSync(dataFilePath, "utf8")
    const events = JSON.parse(data)

    const eventIndex = events.findIndex((e: any) => e.id === params.id)

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const updatedEventData = await request.json()

    // Update the event
    events[eventIndex] = {
      ...events[eventIndex],
      ...updatedEventData,
      updatedAt: new Date().toISOString(),
    }

    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2), "utf8")

    return NextResponse.json(events[eventIndex])
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

// Delete an event
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const data = fs.readFileSync(dataFilePath, "utf8")
    const events = JSON.parse(data)

    const eventIndex = events.findIndex((e: any) => e.id === params.id)

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Remove the event
    events.splice(eventIndex, 1)

    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2), "utf8")

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
