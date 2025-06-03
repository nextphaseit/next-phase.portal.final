"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { config } from "@/lib/config"

export function MaintenanceBanner() {
  // Safe check for maintenance mode with default to false
  const isMaintenanceMode = config.features.enableMaintenance

  if (!isMaintenanceMode) {
    return null
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        The system is currently undergoing maintenance. Some features may be temporarily unavailable.
      </AlertDescription>
    </Alert>
  )
}
