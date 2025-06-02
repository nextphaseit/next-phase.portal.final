"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Logo } from "@/components/ui/logo"
import {
  BarChart3,
  Inbox,
  LifeBuoy,
  Settings,
  Users,
  FileText,
  Bell,
  Workflow,
  FolderOpen,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="border-b p-4">
          <Logo size="sm" />
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin" && "bg-accent text-accent-foreground",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/tickets"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/tickets" && "bg-accent text-accent-foreground",
              )}
            >
              <Inbox className="h-4 w-4" />
              Tickets
            </Link>
            <Link
              href="/admin/users"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/users" && "bg-accent text-accent-foreground",
              )}
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
            <Link
              href="/admin/knowledge"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/knowledge" && "bg-accent text-accent-foreground",
              )}
            >
              <FileText className="h-4 w-4" />
              Knowledge Base
            </Link>
            <Link
              href="/admin/announcements"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/announcements" && "bg-accent text-accent-foreground",
              )}
            >
              <Bell className="h-4 w-4" />
              Announcements
            </Link>
            <Link
              href="/admin/services"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/services" && "bg-accent text-accent-foreground",
              )}
            >
              <LifeBuoy className="h-4 w-4" />
              Services
            </Link>
            <Link
              href="/admin/files"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/files" && "bg-accent text-accent-foreground",
              )}
            >
              <FolderOpen className="h-4 w-4" />
              Files
            </Link>
            <Link
              href="/admin/automation"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/automation" && "bg-accent text-accent-foreground",
              )}
            >
              <Workflow className="h-4 w-4" />
              Automation
            </Link>
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/settings" && "bg-accent text-accent-foreground",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
