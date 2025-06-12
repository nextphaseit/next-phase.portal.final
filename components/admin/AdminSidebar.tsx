"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Ticket,
  Users,
  FileText,
  BarChart2,
  Calendar,
  Activity,
  HelpCircle,
  Settings,
  Shield,
} from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
}

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Support Tickets", href: "/admin/tickets", icon: Ticket },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Document Uploads", href: "/admin/documents", icon: FileText },
  { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart2 },
  { name: "Calendar / Events", href: "/admin/calendar", icon: Calendar },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: Shield },
  { name: "User Activity", href: "/admin/user-activity", icon: Activity },
  { name: "Help Center", href: "/help", icon: HelpCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`bg-white h-[calc(100vh-64px)] shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive ? "bg-[#006699] text-white" : "text-[#333333] hover:bg-[#f4f4f4]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
