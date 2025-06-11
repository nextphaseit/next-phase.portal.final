'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Ticket,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  UserCheck,
  FileUp,
  CalendarCheck,
} from 'lucide-react';

// Types
interface TicketData {
  date: string;
  tickets: number;
}

interface UserRoleData {
  role: string;
  count: number;
}

// Example data for tickets over time
const ticketData: TicketData[] = [
  { date: 'Mar 1', tickets: 4 },
  { date: 'Mar 2', tickets: 3 },
  { date: 'Mar 3', tickets: 5 },
  { date: 'Mar 4', tickets: 2 },
  { date: 'Mar 5', tickets: 6 },
  { date: 'Mar 6', tickets: 4 },
  { date: 'Mar 7', tickets: 7 },
  { date: 'Mar 8', tickets: 5 },
  { date: 'Mar 9', tickets: 3 },
  { date: 'Mar 10', tickets: 4 },
  { date: 'Mar 11', tickets: 6 },
  { date: 'Mar 12', tickets: 5 },
  { date: 'Mar 13', tickets: 4 },
  { date: 'Mar 14', tickets: 3 },
  { date: 'Mar 15', tickets: 5 },
];

// Example data for users by role
const userRoleData: UserRoleData[] = [
  { role: 'Admin', count: 5 },
  { role: 'Manager', count: 12 },
  { role: 'Developer', count: 25 },
  { role: 'Support', count: 15 },
  { role: 'User', count: 150 },
];

// KPI Cards Data
const kpiData = {
  totalTickets: 45,
  activeUsers: 207,
  documentsUploaded: 28,
  upcomingEvents: 3,
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#333333]">Analytics Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tickets Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {kpiData.totalTickets}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Ticket className="w-6 h-6 text-[#006699]" />
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {kpiData.activeUsers}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% from last month
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Documents Uploaded Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents Uploaded</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {kpiData.documentsUploaded}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-[#333333] mt-1">
                {kpiData.upcomingEvents}
              </p>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Next: System Maintenance
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <CalendarCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets Over Time Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333333] mb-4">
            Tickets Created Over Time
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ticketData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#006699"
                  strokeWidth={2}
                  dot={{ fill: '#006699' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users by Role Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333333] mb-4">
            Users by Role
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userRoleData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#006699"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 