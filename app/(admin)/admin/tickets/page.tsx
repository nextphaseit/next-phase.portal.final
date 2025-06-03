"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Plus,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Ticket {
  id: string
  reference: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  category: string
  department?: string
  userId: string
  userEmail: string
  userName: string
  assignedToId?: string
  assignedToName?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

interface Technician {
  id: string
  name: string
  email: string
  department: string
}

const mockTechnicians: Technician[] = [
  { id: "1", name: "John Doe", email: "john@company.com", department: "IT Support" },
  { id: "2", name: "Jane Smith", email: "jane@company.com", department: "Network" },
  { id: "3", name: "Mike Johnson", email: "mike@company.com", department: "Security" },
  { id: "4", name: "Sarah Wilson", email: "sarah@company.com", department: "Hardware" },
]

const generateMockTickets = (): Ticket[] => {
  const now = new Date()
  return [
    {
      id: "1",
      reference: "TKT-001",
      title: "Cannot access email",
      description: "User unable to access Outlook email application",
      status: "open",
      priority: "high",
      category: "Email",
      department: "Sales",
      userId: "user1",
      userEmail: "user1@company.com",
      userName: "Alice Brown",
      assignedToId: "1",
      assignedToName: "John Doe",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      reference: "TKT-002",
      title: "Software installation request",
      description: "Need Adobe Creative Suite installed on workstation",
      status: "in-progress",
      priority: "medium",
      category: "Software",
      department: "Marketing",
      userId: "user2",
      userEmail: "user2@company.com",
      userName: "Bob Wilson",
      assignedToId: "2",
      assignedToName: "Jane Smith",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      reference: "TKT-003",
      title: "Network connectivity issues",
      description: "Intermittent network disconnections in conference room",
      status: "resolved",
      priority: "high",
      category: "Network",
      department: "Operations",
      userId: "user3",
      userEmail: "user3@company.com",
      userName: "Carol Davis",
      assignedToId: "2",
      assignedToName: "Jane Smith",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      reference: "TKT-004",
      title: "Password reset request",
      description: "User forgot password and needs reset",
      status: "closed",
      priority: "low",
      category: "Account",
      department: "HR",
      userId: "user4",
      userEmail: "user4@company.com",
      userName: "David Miller",
      assignedToId: "1",
      assignedToName: "John Doe",
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assignedFilter, setAssignedFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: "",
    assignedToId: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Initialize tickets on mount
  useEffect(() => {
    const mockTickets = generateMockTickets()
    setTickets(mockTickets)
    setFilteredTickets(mockTickets)
  }, [])

  // Filter tickets based on search and filters
  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
      const matchesAssigned = assignedFilter === "all" || ticket.assignedToId === assignedFilter

      let matchesDate = true
      if (dateFilter === "today") {
        const today = new Date().toDateString()
        matchesDate = new Date(ticket.createdAt).toDateString() === today
      } else if (dateFilter === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesDate = new Date(ticket.createdAt) >= weekAgo
      } else if (dateFilter === "overdue") {
        matchesDate = ticket.dueDate ? new Date(ticket.dueDate) < new Date() && ticket.status !== "closed" : false
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned && matchesDate
    })

    setFilteredTickets(filtered)
  }, [tickets, searchTerm, statusFilter, priorityFilter, assignedFilter, dateFilter])

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { variant: "destructive" as const, icon: AlertCircle },
      "in-progress": { variant: "default" as const, icon: RefreshCw },
      resolved: { variant: "secondary" as const, icon: CheckCircle },
      closed: { variant: "outline" as const, icon: XCircle },
    }

    const config = variants[status as keyof typeof variants] || { variant: "default" as const, icon: AlertCircle }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace("-", " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const

    return <Badge variant={variants[priority as keyof typeof variants] || "default"}>{priority}</Badge>
  }

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return

    setLoading(true)
    try {
      // Simulate API call to SharePoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedTickets = tickets.map((ticket) => {
        if (ticket.id === selectedTicket.id) {
          const assignedTech = mockTechnicians.find((t) => t.id === updateForm.assignedToId)
          return {
            ...ticket,
            status: updateForm.status as any,
            assignedToId: updateForm.assignedToId || ticket.assignedToId,
            assignedToName: assignedTech?.name || ticket.assignedToName,
            updatedAt: new Date().toISOString(),
          }
        }
        return ticket
      })

      setTickets(updatedTickets)
      setIsUpdateDialogOpen(false)
      setSelectedTicket(null)
      setUpdateForm({ status: "", assignedToId: "", notes: "" })

      toast({
        title: "Ticket Updated",
        description: "The ticket has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshData = async () => {
    setLoading(true)
    try {
      // Simulate API call to SharePoint
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Data Refreshed",
        description: "Ticket data has been refreshed from SharePoint.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in-progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      overdue: tickets.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "closed").length,
    }
    return stats
  }

  const stats = getTicketStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
          <p className="text-muted-foreground">Manage and track all support tickets from SharePoint.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.overdue}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>View and manage all support tickets from SharePoint.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets, references, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {mockTechnicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className={
                      ticket.dueDate && new Date(ticket.dueDate) < new Date() && ticket.status !== "closed"
                        ? "bg-red-50 dark:bg-red-950/20"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">{ticket.reference}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{ticket.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{ticket.userName}</span>
                        <span className="text-sm text-muted-foreground">{ticket.userEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {ticket.assignedToName || "Unassigned"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ticket.dueDate ? (
                        <div
                          className={`flex items-center gap-2 ${new Date(ticket.dueDate) < new Date() && ticket.status !== "closed" ? "text-red-600" : ""}`}
                        >
                          <Calendar className="h-4 w-4" />
                          {new Date(ticket.dueDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No due date</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTicket(ticket)
                              setIsViewDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTicket(ticket)
                              setUpdateForm({
                                status: ticket.status,
                                assignedToId: ticket.assignedToId || "",
                                notes: "",
                              })
                              setIsUpdateDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Update Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tickets found matching your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ticket Details - {selectedTicket?.reference}</DialogTitle>
            <DialogDescription>View complete ticket information and history.</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="mt-1">{selectedTicket.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p className="mt-1">{selectedTicket.department || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assigned To</Label>
                  <p className="mt-1">{selectedTicket.assignedToName || "Unassigned"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p className="mt-1">
                    {selectedTicket.dueDate ? new Date(selectedTicket.dueDate).toLocaleDateString() : "No due date"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">User Information</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="font-medium">{selectedTicket.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedTicket.userEmail}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="mt-1 font-medium">{selectedTicket.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="mt-1 text-sm">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="mt-1">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="mt-1">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Ticket Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket - {selectedTicket?.reference}</DialogTitle>
            <DialogDescription>Update the ticket status and assignment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(value) => setUpdateForm((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select
                value={updateForm.assignedToId}
                onValueChange={(value) => setUpdateForm((prev) => ({ ...prev, assignedToId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {mockTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name} - {tech.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Update Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this update..."
                value={updateForm.notes}
                onChange={(e) => setUpdateForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTicket} disabled={loading}>
              {loading ? "Updating..." : "Update Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
