"use client";

import { useState, useMemo } from "react";
import AdminRoute from "@/components/auth/AdminRoute";
import { FileText, Search, Filter } from "lucide-react";
import { format } from "date-fns";

// Example users for filter dropdown
const exampleUsers = [
  { id: "user-1", email: "admin1@nextphase.com" },
  { id: "user-2", email: "admin2@nextphase.com" },
  { id: "user-3", email: "user3@nextphase.com" },
];

// Example action types
const actionTypes = [
  "Login",
  "Logout",
  "Created Ticket",
  "Updated Ticket",
  "Deleted Ticket",
  "Created User",
  "Updated User",
  "Deleted User",
  "Uploaded Document",
  "Deleted Document",
  "Changed Settings",
];

// Example audit log data
const exampleAuditLogs = [
  {
    id: "1",
    action: "Login",
    performed_by: "admin1@nextphase.com",
    timestamp: "2024-06-01T10:15:00Z",
    metadata: null,
  },
  {
    id: "2",
    action: "Created Ticket",
    performed_by: "admin2@nextphase.com",
    timestamp: "2024-06-01T10:20:00Z",
    metadata: JSON.stringify({ ticketId: "TKT-123", title: "Printer not working" }),
  },
  {
    id: "3",
    action: "Updated User",
    performed_by: "admin1@nextphase.com",
    timestamp: "2024-06-01T10:25:00Z",
    metadata: JSON.stringify({ userId: "user-3", changes: { role: "admin" } }),
  },
  {
    id: "4",
    action: "Deleted Document",
    performed_by: "admin2@nextphase.com",
    timestamp: "2024-06-01T10:30:00Z",
    metadata: JSON.stringify({ documentId: "DOC-456" }),
  },
  {
    id: "5",
    action: "Changed Settings",
    performed_by: "admin1@nextphase.com",
    timestamp: "2024-06-01T10:35:00Z",
    metadata: JSON.stringify({ setting: "portal_theme", value: "dark" }),
  },
];

export default function AuditLogsPage() {
  // State for filters and search
  const [loading, setLoading] = useState(false); // Set to true if fetching from Supabase
  const [error, setError] = useState<string | null>(null);
  const [logs] = useState(exampleAuditLogs); // Replace with fetched data later
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Filtering logic
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search
      if (search && !log.action.toLowerCase().includes(search.toLowerCase()) && !log.metadata?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // User filter
      if (userFilter && log.performed_by !== userFilter) {
        return false;
      }
      // Action type filter
      if (actionFilter && log.action !== actionFilter) {
        return false;
      }
      // Date range filter
      if (dateFrom && new Date(log.timestamp) < new Date(dateFrom)) {
        return false;
      }
      if (dateTo && new Date(log.timestamp) > new Date(dateTo)) {
        return false;
      }
      return true;
    });
  }, [logs, search, userFilter, actionFilter, dateFrom, dateTo]);

  return (
    <AdminRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#333333] flex items-center">
            <FileText className="w-6 h-6 mr-2 text-[#006699]" /> Audit Logs
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">User</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] min-w-[160px]"
            >
              <option value="">All Users</option>
              {exampleUsers.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] min-w-[160px]"
            >
              <option value="">All Actions</option>
              {actionTypes.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search actions or metadata..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] pr-10"
              />
              <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-red-600">{error}</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-gray-600">No audit logs found for the selected filters.</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadata</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{log.performed_by}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600 font-mono max-w-xs break-all">
                      {log.metadata ? (
                        <pre className="whitespace-pre-wrap">{log.metadata}</pre>
                      ) : (
                        <span className="italic text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
