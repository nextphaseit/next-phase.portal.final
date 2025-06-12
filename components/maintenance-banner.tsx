"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, X } from "lucide-react"
import { getMaintenanceMode, type MaintenanceMode } from "@/lib/systemSettings"

export default function MaintenanceBanner() {
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceMode | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const config = await getMaintenanceMode()
        setMaintenanceConfig(config)
        setIsVisible(config.enabled && !isDismissed)
      } catch (error) {
        console.error("Error checking maintenance mode:", error)
      }
    }

    checkMaintenanceMode()

    // Check every 30 seconds for maintenance mode updates
    const interval = setInterval(checkMaintenanceMode, 30000)

    return () => clearInterval(interval)
  }, [isDismissed])

  if (!isVisible || !maintenanceConfig?.enabled) {
    return null
  }

  const formatScheduledEnd = (scheduledEnd?: string) => {
    if (!scheduledEnd) return null

    try {
      const endTime = new Date(scheduledEnd)
      return endTime.toLocaleString()
    } catch {
      return null
    }
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 relative">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700 font-medium">Maintenance Mode Active</p>
          <p className="text-sm text-yellow-600 mt-1">{maintenanceConfig.message}</p>
          {maintenanceConfig.scheduled_end && (
            <p className="text-xs text-yellow-600 mt-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Scheduled to end: {formatScheduledEnd(maintenanceConfig.scheduled_end)}
            </p>
          )}
        </div>
        <div className="ml-auto pl-3">
          <button onClick={() => setIsDismissed(true)} className="inline-flex text-yellow-400 hover:text-yellow-600">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
