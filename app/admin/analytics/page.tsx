'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Types
interface AnalyticsData {
  ticketsByStatus: {
    status: string;
    count: number;
  }[];
  ticketsByPriority: {
    priority: string;
    count: number;
  }[];
  ticketsByDepartment: {
    department: string;
    count: number;
  }[];
  ticketsOverTime: {
    date: string;
    count: number;
  }[];
  averageResolutionTime: number;
  totalTickets: number;
  resolvedTickets: number;
  openTickets: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  // Fetch analytics data from Supabase
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get date range based on selected time range
        const endDate = new Date();
        const startDate = new Date();
        switch (timeRange) {
          case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(startDate.getDate() - 90);
            break;
          default:
            startDate.setDate(startDate.getDate() - 7);
        }

        // Fetch tickets data
        const { data: tickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (ticketsError) throw ticketsError;

        // Process data for charts
        const ticketsByStatus = processTicketsByStatus(tickets);
        const ticketsByPriority = processTicketsByPriority(tickets);
        const ticketsByDepartment = processTicketsByDepartment(tickets);
        const ticketsOverTime = processTicketsOverTime(tickets, startDate, endDate);
        const { averageResolutionTime, totalTickets, resolvedTickets, openTickets } = processTicketMetrics(tickets);

        setData({
          ticketsByStatus,
          ticketsByPriority,
          ticketsByDepartment,
          ticketsOverTime,
          averageResolutionTime,
          totalTickets,
          resolvedTickets,
          openTickets,
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Helper functions to process ticket data
  const processTicketsByStatus = (tickets: any[]) => {
    const statusCounts = tickets.reduce((acc: any, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  };

  const processTicketsByPriority = (tickets: any[]) => {
    const priorityCounts = tickets.reduce((acc: any, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
    }));
  };

  const processTicketsByDepartment = (tickets: any[]) => {
    const departmentCounts = tickets.reduce((acc: any, ticket) => {
      acc[ticket.department] = (acc[ticket.department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
    }));
  };

  const processTicketsOverTime = (tickets: any[], startDate: Date, endDate: Date) => {
    const dateCounts = tickets.reduce((acc: any, ticket) => {
      const date = new Date(ticket.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Fill in missing dates with zero counts
    const result = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: dateCounts[dateStr] || 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  const processTicketMetrics = (tickets: any[]) => {
    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const openTickets = tickets.filter(t => t.status === 'open').length;

    const resolvedTicketsWithTime = tickets.filter(t => t.status === 'resolved' && t.resolved_at);
    const averageResolutionTime = resolvedTicketsWithTime.length > 0
      ? resolvedTicketsWithTime.reduce((acc, ticket) => {
          const created = new Date(ticket.created_at);
          const resolved = new Date(ticket.resolved_at);
          return acc + (resolved.getTime() - created.getTime());
        }, 0) / resolvedTicketsWithTime.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    return {
      averageResolutionTime,
      totalTickets,
      resolvedTickets,
      openTickets,
    };
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#333333]">Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
              <p className="text-2xl font-bold text-[#333333] mt-2">{data.totalTickets}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Resolved Tickets</h3>
              <p className="text-2xl font-bold text-[#333333] mt-2">{data.resolvedTickets}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
              <p className="text-2xl font-bold text-[#333333] mt-2">{data.openTickets}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500">Avg. Resolution Time</h3>
              <p className="text-2xl font-bold text-[#333333] mt-2">
                {data.averageResolutionTime.toFixed(1)}h
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tickets Over Time */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Tickets Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.ticketsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#006699"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tickets by Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Tickets by Status</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.ticketsByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {data.ticketsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tickets by Priority */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Tickets by Priority</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.ticketsByPriority}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#006699" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tickets by Department */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Tickets by Department</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.ticketsByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#006699" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      )}
    </div>
  );
}
