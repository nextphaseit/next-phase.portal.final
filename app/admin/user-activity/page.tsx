"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import AdminRoute from "@/components/auth/AdminRoute"
import { Activity, Search, Download, Eye } from "lucide-react"
import { getUserActivityLogs, type UserActivityLog } from "@/lib/userActivity"
import { toast } from "react-hot-toast"

// Action type colors
const actionColors = {
  Login: "bg-green-100 text-green-800",
  Logout: "bg-red-100 text-red-800",
  "Page View": "bg-blue-100 text-blue-800",
  Action: "bg-purple-100 text-purple-800",
}

export default function UserActivityPage() {
  const [logs, setLogs] = useState<UserActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedLog, setSelectedLog] = useState<UserActivityLog | null>(null)

  // Fetch activity logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        const filters: any = {}
        if (actionFilter) filters.action = actionFilter
        if (dateFrom) filters.startDate = new Date(dateFrom)
        if (dateTo) filters.endDate = new Date(dateTo)
        if (!search && !actionFilter && !dateFrom && !dateTo) {
          filters.limit = 100 // Limit to recent 100 if no filters
        }

        const data = await getUserActivityLogs(filters)
        setLogs(data || [])
      } catch (err) {
        console.error("Error fetching activity logs:", err)
        setError("Failed to load activity logs. Please try again later.")
        toast.error("Failed to load activity logs")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [actionFilter, dateFrom, dateTo])

  // Filter logs by search
  const filteredLogs = useMemo(() => {
    if (!search) return logs

    return logs.filter(
      (log) =>
        log.user_email.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.page?.toLowerCase().includes(search.toLowerCase()),
    )
  }, [logs, search])

  // Export to CSV
  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "User Email", "Action", "Page", "User Agent", "Metadata"],
      ...filteredLogs.map((log) => [
        format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
        log.user_email,
        log.action,
        log.page || "",
        log.user_agent || "",
        JSON.stringify(log.metadata || {}),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `user-activity-${format(new Date(), "yyyy-MM-dd")}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("Activity logs exported successfully")
  }

  return (
    <AdminRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#333333] flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[#006699]" />
            User Activity Logs
          </h1>
          <button
            onClick={handleExport}
            disabled={filteredLogs.length === 0}
            className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
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
            <label className="block text-xs font-medium text-gray-600 mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] min-w-[140px]"
            >
              <option value="">All Actions</option>
              <option value="Login">Login</option>
              <option value="Logout">Logout</option>
              <option value="Page View">Page View</option>
              <option value="Action">Action</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by user email, action, or page..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] pr-10"
              />
              <Search className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Activity Logs Table */}
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
              <span className="text-gray-600">No activity logs found for the selected filters.</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{log.user_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${actionColors[log.action]}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">{log.page || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-[#006699] hover:text-[#005588] flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Activity Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#333333]">Activity Details</h2>
                  <button onClick={() => setSelectedLog(null)} className="text-gray-500 hover:text-gray-700 text-2xl">
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Timestamp</h3>
                      <p className="text-[#333333]">{format(new Date(selectedLog.timestamp), "yyyy-MM-dd HH:mm:ss")}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">User Email</h3>
                      <p className="text-[#333333]">{selectedLog.user_email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Action</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${actionColors[selectedLog.action]}`}
                      >
                        {selectedLog.action}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Page</h3>
                      <p className="text-[#333333]">{selectedLog.page || "-"}</p>
                    </div>
                  </div>

                  {selectedLog.user_agent && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">User Agent</h3>
                      <p className="text-[#333333] text-sm break-all">{selectedLog.user_agent}</p>
                    </div>
                  )}

                  {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Metadata</h3>
                      <pre className="text-[#333333] text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  )
}
