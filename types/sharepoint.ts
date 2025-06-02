export interface TicketSubmission {
  fullName: string
  email: string
  issueCategory: string
  description: string
  attachments?: File[]
}

export interface SharePointTicket {
  id: string
  ticketReference: string
  fullName: string
  email: string
  issueCategory: string
  description: string
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  submissionDate: string
  assignedTechnician?: string
  lastUpdated: string
  attachmentUrls?: string[]
}

export interface PowerAutomateResponse {
  success: boolean
  ticketReference?: string
  message: string
  error?: string
}

export interface TicketStatusResponse {
  success: boolean
  ticket?: SharePointTicket
  message: string
  error?: string
}
