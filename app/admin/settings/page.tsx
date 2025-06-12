"use client"

import { useState, useEffect } from "react"
import { Save, AlertTriangle, Shield, Bell } from "lucide-react"
import AdminRoute from "@/components/auth/AdminRoute"
import { setMaintenanceMode, getMaintenanceMode, type MaintenanceMode } from "@/lib/systemSettings"
import { createAdminNotice } from "@/lib/adminNotices"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"

export default function SettingsPage() {
  const { data: session } = useSession()
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
        toast.error("Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Save maintenance mode
  const handleSaveMaintenanceMode = async () => {
    if (!session?.user?.email) return

    try {
      setSaving(true)

      await setMaintenanceMode(
        maintenanceConfig.enabled,
        maintenanceConfig.message,
        maintenanceConfig.scheduled_end,
        session.user.email,
      )

      toast.success("Maintenance mode settings saved")
    } catch (error) {
      console.error("Error saving maintenance mode:", error)
      toast.error("Failed to save maintenance mode settings")
    } finally {
      setSaving(false)
    }
  }

  // Create admin notice
  const handleCreateNotice = async () => {
    if (!session?.user?.email || !noticeTitle.trim() || !noticeMessage.trim()) {
      toast.error("Please fill in all notice fields")
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
        session.user.email,
      )

      // Clear form
      setNoticeTitle("")
      setNoticeMessage("")
      setNoticeType("info")
      setNoticePriority(2)

      toast.success("Admin notice created successfully")
    } catch (error) {
      console.error("Error creating notice:", error)
      toast.error("Failed to create admin notice")
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
  const isSuperAdmin = session?.user?.role === "super-admin"

  return (
    <AdminRoute>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#333333] flex items-center">
            <Shield className="w-6 h-6 mr-2 text-[#006699]" />
            System Settings
          </h1>
        </div>

        {/* Maintenance Mode Settings */}
        {isSuperAdmin && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#333333] mb-6 flex items-center">
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
                <label htmlFor="maintenance-enabled" className="text-sm font-medium text-[#333333]">
                  Enable Maintenance Mode
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Maintenance Message</label>
                <textarea
                  value={maintenanceConfig.message}
                  onChange={(e) =>
                    setMaintenanceConfig((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] h-20"
                  placeholder="Enter maintenance message for users..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Scheduled End Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={maintenanceConfig.scheduled_end || ""}
                  onChange={(e) =>
                    setMaintenanceConfig((prev) => ({
                      ...prev,
                      scheduled_end: e.target.value || undefined,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                />
              </div>

              <button
                onClick={handleSaveMaintenanceMode}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Maintenance Settings"}
              </button>
            </div>
          </div>
        )}

        {/* Admin Notices */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-6 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-500" />
            Create Admin Notice
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Notice Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                  placeholder="Enter notice title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#333333] mb-2">Notice Type</label>
                <select
                  value={noticeType}
                  onChange={(e) => setNoticeType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Notice Message</label>
              <textarea
                value={noticeMessage}
                onChange={(e) => setNoticeMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] h-24"
                placeholder="Enter notice message..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#333333] mb-2">Priority (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={noticePriority}
                onChange={(e) => setNoticePriority(Number.parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
              />
            </div>

            <button
              onClick={handleCreateNotice}
              disabled={saving || !noticeTitle.trim() || !noticeMessage.trim()}
              className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50"
            >
              <Bell className="w-4 h-4 mr-2" />
              {saving ? "Creating..." : "Create Notice"}
            </button>
          </div>
        </div>

        {/* Additional Settings Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[#333333] mb-4">Additional Settings</h2>
          <p className="text-gray-600">Additional system settings will be added here in future updates.</p>
        </div>
      </div>
    </AdminRoute>
  )
}
