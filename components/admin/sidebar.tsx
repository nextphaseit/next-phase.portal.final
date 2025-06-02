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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSidebar } from "@/app/(admin)/admin/layout"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false) // Mobile menu state
  const { collapsed, toggleCollapsed } = useSidebar() // Desktop collapse state from context

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/admin", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/tickets", icon: Inbox, label: "Tickets" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/knowledge", icon: FileText, label: "Knowledge Base" },
    { href: "/admin/announcements", icon: Bell, label: "Announcements" },
    { href: "/admin/services", icon: LifeBuoy, label: "Services" },
    { href: "/admin/files", icon: FolderOpen, label: "Files" },
    { href: "/admin/automation", icon: Workflow, label: "Automation" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-all duration-300",
          // Mobile behavior
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Desktop behavior
          collapsed ? "md:w-16" : "md:w-64",
          "w-64", // Mobile width
          className,
        )}
      >
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center">
            {!collapsed && <Logo size="sm" variant="light" />}
            {collapsed && (
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
            )}
          </div>

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-6 w-6"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleCollapsed()
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive && "bg-accent text-accent-foreground",
                    collapsed && "justify-center px-2",
                  )}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setIsOpen(false)} // Close mobile menu on navigation
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
