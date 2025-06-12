'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopNav from '@/components/admin/AdminTopNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <AdminTopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
