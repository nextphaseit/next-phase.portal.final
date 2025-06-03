import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Path to the JSON file that will store events
const dataFilePath = path.join(process.cwd(), "data", "calendar-events.json")

// Ensure the data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Get all events
export async function GET() {
  try {
    ensureDataDir()

    // Check if the file exists, if not create it with an empty array
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]), "utf8")
      return NextResponse.json([])
    }

    // Read the file
    const data = fs.readFileSync(dataFilePath, "utf8")
    const events = JSON.parse(data)

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error reading events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

// Create a new event
export async function POST(request: NextRequest) {
  try {
    ensureDataDir()

    const eventData = await request.json()

    // Validate required fields
    if (!eventData.title || !eventData.start || !eventData.type) {
      return NextResponse.json(
        { error: "Missing required fields: title, start, and type are required" },
        { status: 400 },
      )
    }

    // Generate a unique ID for the event
    const newEvent = {
      id: uuidv4(),
      ...eventData,
      createdAt: new Date().toISOString(),
    }

    // Read existing events
    let events = []
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, "utf8")
      events = JSON.parse(data)
    }

    // Add the new event
    events.push(newEvent)

    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2), "utf8")

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
