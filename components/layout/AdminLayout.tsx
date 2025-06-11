'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BarChart2,
  Ticket,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f4] dark:bg-[#1a1a1a]">
      {/* Top Navigation */}
      <nav className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-[#2d2d2d] shadow-sm z-30 flex items-center justify-between px-4 md:px-6">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[#333333] dark:text-[#e0e0e0]"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center space-x-3">
            <Image
              src="https://via.placeholder.com/40"
              alt="Admin Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-[#333333] dark:text-[#e0e0e0] font-medium">Admin User</span>
          </div>
          <button
            onClick={() => {/* Add logout logic */}}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-[#333333] dark:text-[#e0e0e0]"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-[#2d2d2d] shadow-sm z-20 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <Image
            src="/logo.png"
            alt="NextPhase IT"
            width={180}
            height={40}
            className="mx-auto"
          />
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#006699] dark:bg-[#0088cc] text-white'
                    : 'text-[#333333] dark:text-[#e0e0e0] hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
} 