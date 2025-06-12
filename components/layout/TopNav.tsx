'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bell, LogOut } from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="h-16 border-b border-border dark:border-dark-border bg-background dark:bg-dark-background shadow-sm z-30">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="NextPhase IT"
            width={180}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-dark-text transition-theme"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <Image
              src="https://via.placeholder.com/40"
              alt="Admin Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-text dark:text-dark-text font-medium">Admin User</span>
          </div>

          <button
            onClick={() => {/* Add logout logic */}}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-text dark:text-dark-text transition-theme"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 mt-2 w-80 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg shadow-lg">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-text dark:text-dark-text mb-2">Notifications</h3>
            <p className="text-text dark:text-dark-text">No new notifications</p>
          </div>
        </div>
      )}
    </nav>
  );
} 