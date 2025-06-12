'use client';

import { Ticket, Users, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';

const dashboardTiles = [
  {
    title: 'Support Tickets',
    description: 'Manage and track support requests',
    icon: Ticket,
    href: '/admin/tickets',
    color: 'bg-blue-500',
  },
  {
    title: 'User Management',
    description: 'View and manage user accounts',
    icon: Users,
    href: '/admin/users',
    color: 'bg-green-500',
  },
  {
    title: 'Document Uploads',
    description: 'Access and manage documents',
    icon: FileText,
    href: '/admin/documents',
    color: 'bg-purple-500',
  },
  {
    title: 'Analytics',
    description: 'View system analytics and reports',
    icon: BarChart2,
    href: '/admin/analytics',
    color: 'bg-orange-500',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#333333]">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.title}
              href={tile.href}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${tile.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#333333]">
                    {tile.title}
                  </h2>
                  <p className="text-sm text-gray-600">{tile.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
