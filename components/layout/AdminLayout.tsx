'use client';

import { ReactNode } from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import VersionInfo from './VersionInfo';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-text dark:text-dark-text transition-theme flex flex-col">
      <TopNav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <VersionInfo />
    </div>
  );
}
