"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSidebar } from "@/app/context/SidebarContext"
import {
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  FileText,
  Calendar,
  Megaphone,
  Wrench,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Tickets",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Knowledge Base",
    href: "/admin/knowledge",
    icon: FileText,
  },
  {
    name: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Wrench,
  },
  {
    name: "Files",
    href: "/admin/files",
    icon: FolderOpen,
  },
  {
    name: "Automation",
    href: "/admin/automation",
    icon: Settings,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { collapsed, toggleCollapsed } = useSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="bg-background">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-background border-r transition-all duration-300 ease-in-out",
          "md:relative md:z-auto",
          collapsed ? "md:w-16" : "md:w-64",
          mobileOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NP</span>
                </div>
                <span className="font-semibold text-lg">NextPhase IT</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="hidden md:flex">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
