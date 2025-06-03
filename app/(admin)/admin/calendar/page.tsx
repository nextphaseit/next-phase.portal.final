import type { Metadata } from "next"
import { CalendarView } from "@/components/admin/calendar-view"

export const metadata: Metadata = {
  title: "Calendar | Admin Dashboard",
  description: "View and manage tickets and events in calendar view",
}

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View tickets and schedule events in calendar view</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-md border">
        <CalendarView />
      </div>
    </div>
  )
}
