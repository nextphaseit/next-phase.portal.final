import { NextResponse } from "next/server"

// Mock data directly in the API route
const mockArticles = {
  "1": {
    id: "1",
    title: "How to Reset Your Password",
    content:
      "## Password Reset Instructions\n\nFollow these steps to reset your password:\n\n1. Click on the 'Forgot Password' link on the login page\n2. Enter your email address\n3. Check your email for a reset link\n4. Click the link and enter your new password\n5. Log in with your new password",
    category: "Account Management",
    tags: ["password", "account", "security"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    publishedAt: "2024-01-15T10:30:00Z",
    authorId: "admin",
  },
  "2": {
    id: "2",
    title: "VPN Setup Guide",
    content:
      "## VPN Configuration\n\nThis guide will help you set up VPN access:\n\n1. Download the VPN client from the downloads section\n2. Install the client on your device\n3. Open the application and enter your credentials\n4. Select the appropriate server location\n5. Click Connect to establish a secure connection",
    category: "Network",
    tags: ["vpn", "network", "security"],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    publishedAt: "2024-01-14T09:15:00Z",
    authorId: "admin",
  },
  "3": {
    id: "3",
    title: "Email Configuration on Mobile",
    content:
      "## Mobile Email Setup\n\nConfigure your work email on your mobile device:\n\n1. Open the email app on your device\n2. Select 'Add Account'\n3. Choose 'Exchange' or 'Office 365'\n4. Enter your email address and password\n5. Accept the server settings\n6. Choose which data to sync (email, contacts, calendar)",
    category: "Email",
    tags: ["email", "mobile", "configuration"],
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z",
    publishedAt: "2024-01-13T14:20:00Z",
    authorId: "admin",
  },
  "4": {
    id: "4",
    title: "Software Installation Requests",
    content:
      "## Requesting New Software\n\nTo request installation of new software:\n\n1. Navigate to the Service Desk portal\n2. Create a new ticket with category 'Software Request'\n3. Provide the name and version of the software\n4. Explain the business justification\n5. Wait for approval from your manager\n6. IT will schedule the installation once approved",
    category: "Software",
    tags: ["software", "installation", "requests"],
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-12T11:45:00Z",
    publishedAt: "2024-01-12T11:45:00Z",
    authorId: "admin",
  },
}

export async function GET(request, { params }) {
  try {
    const id = params.id

    // Check if article exists
    if (!mockArticles[id]) {
      return new NextResponse(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // Return the article
    return new NextResponse(JSON.stringify(mockArticles[id]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in GET /api/knowledge/[id]:", error)

    return new NextResponse(JSON.stringify({ error: "Failed to fetch article" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if article exists
    if (!mockArticles[id]) {
      return new NextResponse(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // In a real app, we would update the article here
    // For now, just return success
    return new NextResponse(JSON.stringify({ ...mockArticles[id], ...body, updatedAt: new Date().toISOString() }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in PUT /api/knowledge/[id]:", error)

    return new NextResponse(JSON.stringify({ error: "Failed to update article" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id

    // Check if article exists
    if (!mockArticles[id]) {
      return new NextResponse(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // In a real app, we would delete the article here
    // For now, just return success
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in DELETE /api/knowledge/[id]:", error)

    return new NextResponse(JSON.stringify({ error: "Failed to delete article" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
