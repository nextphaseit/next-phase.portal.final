export type UserRole = "admin" | "tech" | "manager" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  createdAt: string
  updatedAt: string
}

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high"

export interface Ticket {
  id: string
  reference: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: string
  department?: string
  userId: string
  assignedToId?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  files?: TicketFile[]
  comments?: TicketComment[]
}

export interface TicketFile {
  id: string
  ticketId: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: string
}

export interface TicketComment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: string
  isInternal: boolean
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  authorId: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  isActive: boolean
  isInternal: boolean
  createdAt: string
  expiresAt?: string
}

export interface ServiceCatalogItem {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end?: string
  allDay?: boolean
  type: "ticket" | "alert" | "holiday" | "maintenance"
  ticketId?: string
  color?: string
}
