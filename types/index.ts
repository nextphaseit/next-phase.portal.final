export type UserRole = "admin" | "tech" | "manager" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  createdAt: Date
  updatedAt: Date
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
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
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
  uploadedAt: Date
}

export interface TicketComment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: Date
  isInternal: boolean
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
  authorId: string
}

// Helper type for creating/updating knowledge articles
export interface KnowledgeArticleInput {
  id?: string
  title: string
  content: string
  category: string
  tags: string[]
  publishedAt?: Date | null
  authorId?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  isActive: boolean
  isInternal: boolean
  createdAt: Date
  expiresAt?: Date
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
  start: Date
  end?: Date
  allDay?: boolean
  type: "ticket" | "alert" | "holiday" | "maintenance"
  ticketId?: string
  color?: string
}
