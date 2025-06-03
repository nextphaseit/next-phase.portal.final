import { type NextRequest, NextResponse } from "next/server"

// SharePoint configuration
const SHAREPOINT_SITE_URL = process.env.SHAREPOINT_SITE_URL || "https://yourtenant.sharepoint.com/sites/helpdesk"
const SHAREPOINT_LIST_NAME = "Help Desk Tickets"

interface SharePointTicket {
  Id: number
  Title: string
  Description: string
  Status: string
  Priority: string
  Category: string
  Department: string
  UserEmail: string
  UserName: string
  AssignedToId?: number
  AssignedToName?: string
  Created: string
  Modified: string
  DueDate?: string
}

// Mock SharePoint data for demonstration
const mockSharePointTickets: SharePointTicket[] = [
  {
    Id: 1,
    Title: "Cannot access email",
    Description: "User unable to access Outlook email application",
    Status: "Open",
    Priority: "High",
    Category: "Email",
    Department: "Sales",
    UserEmail: "alice.brown@company.com",
    UserName: "Alice Brown",
    AssignedToId: 1,
    AssignedToName: "John Doe",
    Created: "2024-01-15T10:30:00Z",
    Modified: "2024-01-15T10:30:00Z",
    DueDate: "2024-01-17T17:00:00Z",
  },
  {
    Id: 2,
    Title: "Software installation request",
    Description: "Need Adobe Creative Suite installed on workstation",
    Status: "In Progress",
    Priority: "Medium",
    Category: "Software",
    Department: "Marketing",
    UserEmail: "bob.wilson@company.com",
    UserName: "Bob Wilson",
    AssignedToId: 2,
    AssignedToName: "Jane Smith",
    Created: "2024-01-14T14:20:00Z",
    Modified: "2024-01-15T09:15:00Z",
    DueDate: "2024-01-18T17:00:00Z",
  },
]

async function getAccessToken() {
  // In a real implementation, you would get an access token using Azure AD
  // This is a placeholder for the authentication logic
  return "mock_access_token"
}

async function fetchSharePointTickets() {
  try {
    // In a real implementation, you would make an actual API call to SharePoint
    // const accessToken = await getAccessToken()
    // const response = await fetch(`${SHAREPOINT_SITE_URL}/_api/web/lists/getbytitle('${SHAREPOINT_LIST_NAME}')/items`, {
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Accept': 'application/json;odata=verbose'
    //   }
    // })
    // const data = await response.json()
    // return data.d.results

    // For now, return mock data
    return mockSharePointTickets
  } catch (error) {
    console.error("Error fetching SharePoint tickets:", error)
    throw error
  }
}

async function updateSharePointTicket(ticketId: number, updates: Partial<SharePointTicket>) {
  try {
    // In a real implementation, you would make an actual API call to SharePoint
    // const accessToken = await getAccessToken()
    // const response = await fetch(`${SHAREPOINT_SITE_URL}/_api/web/lists/getbytitle('${SHAREPOINT_LIST_NAME}')/items(${ticketId})`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'Accept': 'application/json;odata=verbose',
    //     'Content-Type': 'application/json;odata=verbose',
    //     'X-RequestDigest': 'form_digest_value',
    //     'X-HTTP-Method': 'MERGE',
    //     'If-Match': '*'
    //   },
    //   body: JSON.stringify(updates)
    // })
    // return response.ok

    // For now, simulate success
    console.log(`Updating ticket ${ticketId} with:`, updates)
    return true
  } catch (error) {
    console.error("Error updating SharePoint ticket:", error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const tickets = await fetchSharePointTickets()

    // Transform SharePoint data to our format
    const transformedTickets = tickets.map((ticket) => ({
      id: ticket.Id.toString(),
      reference: `TKT-${ticket.Id.toString().padStart(3, "0")}`,
      title: ticket.Title,
      description: ticket.Description,
      status: ticket.Status.toLowerCase().replace(" ", "-"),
      priority: ticket.Priority.toLowerCase(),
      category: ticket.Category,
      department: ticket.Department,
      userId: `user${ticket.Id}`,
      userEmail: ticket.UserEmail,
      userName: ticket.UserName,
      assignedToId: ticket.AssignedToId?.toString(),
      assignedToName: ticket.AssignedToName,
      createdAt: ticket.Created,
      updatedAt: ticket.Modified,
      dueDate: ticket.DueDate,
    }))

    return NextResponse.json({ tickets: transformedTickets })
  } catch (error) {
    console.error("Error in GET /api/tickets/sharepoint:", error)
    return NextResponse.json({ error: "Failed to fetch tickets from SharePoint" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, updates } = body

    // Transform our format back to SharePoint format
    const sharePointUpdates: Partial<SharePointTicket> = {}

    if (updates.status) {
      sharePointUpdates.Status = updates.status.charAt(0).toUpperCase() + updates.status.slice(1).replace("-", " ")
    }

    if (updates.assignedToId) {
      sharePointUpdates.AssignedToId = Number.parseInt(updates.assignedToId)
    }

    if (updates.assignedToName) {
      sharePointUpdates.AssignedToName = updates.assignedToName
    }

    sharePointUpdates.Modified = new Date().toISOString()

    const success = await updateSharePointTicket(Number.parseInt(ticketId), sharePointUpdates)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to update ticket in SharePoint" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in PUT /api/tickets/sharepoint:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}
