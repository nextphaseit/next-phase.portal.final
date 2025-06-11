'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminRoute from '@/components/auth/AdminRoute';
import RoleRoute from '@/components/auth/RoleRoute';
import { Users, FileText, Calendar, Ticket } from 'lucide-react';
import { hasFeatureAccess } from '@/lib/auth/roles';

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: 'user',
      description: 'New user registration',
      timestamp: '2024-03-20T10:30:00',
      user: 'John Doe',
    },
    {
      id: 2,
      type: 'document',
      description: 'Document uploaded',
      timestamp: '2024-03-20T09:15:00',
      user: 'Jane Smith',
    },
    {
      id: 3,
      type: 'ticket',
      description: 'Ticket resolved',
      timestamp: '2024-03-19T16:45:00',
      user: 'Mike Johnson',
    },
  ]);

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <RoleRoute feature="user:view">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">1,234</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </RoleRoute>

          <RoleRoute feature="document:view">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documents</p>
                  <p className="text-2xl font-semibold text-gray-900">567</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </RoleRoute>

          <RoleRoute feature="calendar:view">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-2xl font-semibold text-gray-900">12</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </RoleRoute>

          <RoleRoute feature="ticket:view">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                  <p className="text-2xl font-semibold text-gray-900">45</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Ticket className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </RoleRoute>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      by {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activity.type === 'user' && (
                      <Users className="h-5 w-5 text-blue-600" />
                    )}
                    {activity.type === 'document' && (
                      <FileText className="h-5 w-5 text-green-600" />
                    )}
                    {activity.type === 'ticket' && (
                      <Ticket className="h-5 w-5 text-orange-600" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 