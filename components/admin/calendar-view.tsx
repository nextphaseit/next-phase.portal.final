"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import type { Ticket } from "@/types"

// Define event types
type EventType = "ticket" | "alert" | "holiday" | "maintenance"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  description?: string
  type: EventType
  ticketId?: string
  priority?: string
}

export function CalendarView() {
  const { theme } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "alert" as EventType,
    date: new Date(),
  })

  // Fetch tickets and events on component mount
  useEffect(() => {
    fetchTickets()
    fetchEvents()
  }, [])

  // Mock function to fetch tickets from SharePoint
  const fetchTickets = async () => {
    try {
      const mockTickets: Ticket[] = [
        {
          id: "ticket-1",
          reference: "TKT-001",
          title: "Network outage in Building A",
          description: "Users in Building A are experiencing network connectivity issues",
          status: "open",
          priority: "high",
          category: "Network",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
        {
          id: "ticket-2",
          reference: "TKT-002",
          title: "Software installation request",
          description: "Need Adobe Creative Suite installed on marketing team computers",
          status: "in-progress",
          priority: "medium",
          category: "Software",
          userId: "user-2",
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
        {
          id: "ticket-3",
          reference: "TKT-003",
          title: "Printer maintenance",
          description: "Scheduled maintenance for office printers",
          status: "scheduled",
          priority: "low",
          category: "Hardware",
          userId: "user-3",
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      ] as Ticket[]

      setTickets(mockTickets)

      // Convert tickets to calendar events
      const ticketEvents: CalendarEvent[] = mockTickets
        .filter((ticket) => ticket.dueDate)
        .map((ticket) => ({
          id: `ticket-${ticket.id}`,
          title: `${ticket.reference}: ${ticket.title}`,
          date: ticket.dueDate!,
          description: ticket.description,
          type: "ticket" as EventType,
          ticketId: ticket.id,
          priority: ticket.priority,
        }))

      setEvents((prevEvents) => {
        const nonTicketEvents = prevEvents.filter((event) => event.type !== "ticket")
        return [...nonTicketEvents, ...ticketEvents]
      })
    } catch (error) {
      console.error("Error fetching tickets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets. Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Mock function to fetch events
  const fetchEvents = async () => {
    try {
      const mockEvents: CalendarEvent[] = [
        {
          id: "event-1",
          title: "Scheduled Maintenance",
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          description: "Scheduled server maintenance. Expect brief service interruptions.",
          type: "maintenance",
        },
        {
          id: "event-2",
          title: "Company Holiday",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          description: "Company-wide holiday. Office closed.",
          type: "holiday",
        },
        {
          id: "event-3",
          title: "Security Alert",
          date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          description: "Security system update scheduled.",
          type: "alert",
        },
      ]

      setEvents((prevEvents) => {
        const ticketEvents = prevEvents.filter((event) => event.type === "ticket")
        return [...ticketEvents, ...mockEvents]
      })
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Helper function to get color based on event type and priority
  const getEventColor = (event: CalendarEvent) => {
    if (event.type === "ticket") {
      switch (event.priority) {
        case "high":
          return "bg-red-500 text-white"
        case "medium":
          return "bg-orange-500 text-white"
        case "low":
          return "bg-green-500 text-white"
        default:
          return "bg-blue-500 text-white"
      }
    }

    switch (event.type) {
      case "alert":
        return "bg-red-500 text-white"
      case "holiday":
        return "bg-green-500 text-white"
      case "maintenance":
        return "bg-orange-500 text-white"
      default:
        return "bg-blue-500 text-white"
    }
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  // Handle date click to add new event
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setNewEvent({
      ...newEvent,
      date: date,
    })
    setIsAddEventOpen(true)
  }

  // Handle event click to view details
  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === "ticket") {
      toast({
        title: "Ticket Details",
        description: `${event.title}\n${event.description || "No description"}`,
      })
    } else {
      toast({
        title: event.title,
        description: event.description || "No description",
      })
    }
  }

  // Handle adding a new event
  const handleAddEvent = () => {
    const eventId = `event-${Date.now()}`
    const newCalendarEvent: CalendarEvent = {
      id: eventId,
      title: newEvent.title,
      date: newEvent.date,
      description: newEvent.description,
      type: newEvent.type,
    }

    setEvents([...events, newCalendarEvent])
    setIsAddEventOpen(false)

    // Reset form
    setNewEvent({
      title: "",
      description: "",
      type: "alert",
      date: new Date(),
    })

    toast({
      title: "Event Added",
      description: "The event has been added to the calendar.",
    })
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <>
      <div className="flex flex-col h-full bg-background">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setIsAddEventOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-7 gap-1 h-full">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[120px] p-1 border border-border cursor-pointer hover:bg-muted/50 transition-colors",
                    !isCurrentMonth && "text-muted-foreground bg-muted/20",
                    isToday && "bg-primary/10 border-primary",
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  <div className={cn("text-sm font-medium mb-1", isToday && "text-primary font-bold")}>
                    {format(day, "d")}
                  </div>

                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={cn("text-xs p-1 rounded cursor-pointer truncate", getEventColor(event))}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEventClick(event)
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-muted/20">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>High Priority / Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Medium Priority / Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Low Priority / Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Other Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value) => setNewEvent({ ...newEvent, type: value as EventType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">IT Alert</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newEvent.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newEvent.date}
                    onSelect={(date) => date && setNewEvent({ ...newEvent, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Event description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={!newEvent.title}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
