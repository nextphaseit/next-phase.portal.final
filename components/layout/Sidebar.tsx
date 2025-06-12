'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BarChart2,
  Ticket,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/documentation', label: 'Documentation', icon: BookOpen },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen border-r border-border dark:border-dark-border bg-background dark:bg-dark-background transition-theme ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 text-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-theme ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
