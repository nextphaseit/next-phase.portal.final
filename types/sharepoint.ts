// SharePoint List Item Structure
export interface SharePointTicket {
  id: string
  ticketReference: string
  fullName: string
  email: string
  issueCategory: string
  description: string
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  priority?: "Low" | "Medium" | "High"
  assignedTechnician?: string
  submissionDate: string
  lastUpdated: string
  attachmentUrls?: string[]
  department?: string
  notes?: string
}

// Power Automate Response Types
export interface PowerAutomateResponse {
  success: boolean
  message: string
  ticketReference?: string
  error?: string
}

// Ticket Status Response
export interface TicketStatusResponse {
  success: boolean
  message: string
  ticket?: SharePointTicket
}

// SharePoint Configuration
export interface SharePointConfig {
  siteUrl: string
  listId: string
  clientId: string
  clientSecret: string
  tenantId: string
}

// File Upload Response
export interface FileUploadResponse {
  success: boolean
  fileUrl?: string
  fileName?: string
  error?: string
}
