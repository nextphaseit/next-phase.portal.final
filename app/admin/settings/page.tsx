"use client"

import { useState, useEffect } from "react"
import { Save, AlertTriangle, Shield, Bell } from "lucide-react"
import AdminRoute from "@/components/auth/AdminRoute"
import { setMaintenanceMode, getMaintenanceMode, type MaintenanceMode } from "@/lib/systemSettings"
import { createAdminNotice } from "@/lib/adminNotices"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Maintenance Mode
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceMode>({
    enabled: false,
    message: "System is currently under maintenance. Please check back later.",
  })

  // Admin Notice
  const [noticeTitle, setNoticeTitle] = useState("")
  const [noticeMessage, setNoticeMessage] = useState("")
  const [noticeType, setNoticeType] = useState<"info" | "warning" | "error" | "success">("info")
  const [noticePriority, setNoticePriority] = useState(2)

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)

        // Load maintenance mode settings
        const maintenance = await getMaintenanceMode()
        setMaintenanceConfig(maintenance)
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({ title: "Error", description: "Failed to load settings", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Save maintenance mode
  const handleSaveMaintenanceMode = async () => {
    if (!user?.email) {
      toast({ title: "Error", description: "User not authenticated", variant: "destructive" })
      return
    }

    try {
      setSaving(true)

      await setMaintenanceMode(
        maintenanceConfig.enabled,
        maintenanceConfig.message,
        maintenanceConfig.scheduled_end,
        user.email,
      )

      toast({ title: "Success", description: "Maintenance mode settings saved" })
    } catch (error) {
      console.error("Error saving maintenance mode:", error)
      toast({ title: "Error", description: "Failed to save maintenance mode settings", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  // Create admin notice
  const handleCreateNotice = async () => {
    if (!user?.email || !noticeTitle.trim() || !noticeMessage.trim()) {
      toast({ title: "Error", description: "Please fill in all notice fields", variant: "destructive" })
      return
    }

    try {
      setSaving(true)

      await createAdminNotice(
        {
          title: noticeTitle,
          message: noticeMessage,
          type: noticeType,
          is_active: true,
          priority: noticePriority,
          target_roles: ["admin", "super-admin"],
        },
        user.email,
      )

      // Clear form
      setNoticeTitle("")
      setNoticeMessage("")
      setNoticeType("info")
      setNoticePriority(2)

      toast({ title: "Success", description: "Admin notice created successfully" })
    } catch (error) {
      console.error("Error creating notice:", error)
      toast({ title: "Error", description: "Failed to create admin notice", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminRoute>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
        </div>
      </AdminRoute>
    )
  }

  // Check if user is super admin for maintenance mode
  const isSuperAdmin = user?.role === "super-admin" || user?.role === "admin" // Allow admin for demo

  return (
    <AdminRoute>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#333333] dark:text-white flex items-center">
            <Shield className="w-6 h-6 mr-2 text-[#006699]" />
            System Settings
          </h1>
        </div>

        {/* User Info Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Logged in as: <strong>{user?.email}</strong> ({user?.role})
            </span>
          </div>
        </div>

        {/* Maintenance Mode Settings */}
        {isSuperAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#333333] dark:text-white mb-6 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Maintenance Mode
            </h2>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="maintenance-enabled"
                  checked={maintenanceConfig.enabled}
                  onChange={(e) =>
                    setMaintenanceConfig((prev) => ({
                      ...prev,
                      enabled: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-[#006699] border-gray-300 rounded focus:ring-[#006699]"
                />
                <label htmlFor="maintenance-enabled" className="text-sm font-medium text-[#333333] dark:text-white">
                  Enable Maintenance Mode
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] dark:text-white mb-2">
                  Maintenance Message
                </label>
                <textarea
                  value={maintenanceConfig.message}
                  onChange={(e) =>
                    setMaintenanceConfig((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] h-20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter maintenance message for users..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] dark:text-white mb-2">
                  Scheduled End Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={maintenanceConfig.scheduled_end || ""}
                  onChange={(e) =>
                    setMaintenanceConfig((prev) => ({
                      ...prev,
                      scheduled_end: e.target.value || undefined,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleSaveMaintenanceMode}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Maintenance Settings"}
              </button>
            </div>
          </div>
        )}

        {/* Admin Notices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#333333] dark:text-white mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            Create Admin Notice
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] dark:text-white mb-2">Notice Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter notice title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] dark:text-white mb-2">Notice Type</label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] dark:text-white mb-2">Notice Message</label>
              <textarea
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter notice message..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] dark:text-white mb-2">Priority (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={noticePriority}
                onChange={(e) => setNoticePriority(Number.parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleCreateNotice}
              disabled={saving || !noticeTitle.trim() || !noticeMessage.trim()}
              className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 transition-colors"
            >
              <Bell className="w-4 h-4 mr-2" />
              {saving ? "Creating..." : "Create Notice"}
            </button>
          </div>
        </div>

        {/* Additional Settings Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#333333] dark:text-white mb-4">Additional Settings</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Additional system settings will be added here in future updates.
          </p>
        </div>
      </div>
    </AdminRoute>
  )
}
