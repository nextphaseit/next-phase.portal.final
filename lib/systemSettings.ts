import { supabase } from "./supabaseClient"
import { logAuditEvent } from "./audit"

export interface SystemSetting {
  id: string
  setting_key: string
  setting_value: any
  description?: string
  created_by: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface MaintenanceMode {
  enabled: boolean
  message: string
  scheduled_end?: string
}

/**
 * Get a system setting by key
 */
export async function getSystemSetting(key: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("setting_value")
      .eq("setting_key", key)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Setting not found, return null
        return null
      }
      throw new Error(`Failed to get system setting: ${error.message}`)
    }

    return data?.setting_value
  } catch (error) {
    console.error("Error in getSystemSetting:", error)
    throw error
  }
}

/**
 * Update a system setting
 */
export async function updateSystemSetting(
  key: string,
  value: any,
  updatedBy: string,
  description?: string,
): Promise<void> {
  try {
    const { error } = await supabase.from("system_settings").upsert({
      setting_key: key,
      setting_value: value,
      description,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
      created_by: updatedBy, // For new records
    })

    if (error) {
      throw new Error(`Failed to update system setting: ${error.message}`)
    }

    // Log the action
    await logAuditEvent("Updated System Setting", updatedBy, {
      setting_key: key,
      new_value: value,
      description,
    })
  } catch (error) {
    console.error("Error in updateSystemSetting:", error)
    throw error
  }
}

/**
 * Get maintenance mode status
 */
export async function getMaintenanceMode(): Promise<MaintenanceMode> {
  try {
    const setting = await getSystemSetting("maintenance_mode")

    if (!setting) {
      return {
        enabled: false,
        message: "System is currently under maintenance. Please check back later.",
      }
    }

    return setting
  } catch (error) {
    console.error("Error in getMaintenanceMode:", error)
    // Return safe default
    return {
      enabled: false,
      message: "System is currently under maintenance. Please check back later.",
    }
  }
}

/**
 * Set maintenance mode
 */
export async function setMaintenanceMode(
  enabled: boolean,
  message?: string,
  scheduledEnd?: string,
  updatedBy?: string,
): Promise<void> {
  try {
    const maintenanceConfig: MaintenanceMode = {
      enabled,
      message: message || "System is currently under maintenance. Please check back later.",
      scheduled_end: scheduledEnd,
    }

    await updateSystemSetting(
      "maintenance_mode",
      maintenanceConfig,
      updatedBy || "system",
      "Maintenance mode configuration",
    )
  } catch (error) {
    console.error("Error in setMaintenanceMode:", error)
    throw error
  }
}

/**
 * Check if system is in maintenance mode
 */
export async function isMaintenanceMode(): Promise<boolean> {
  try {
    const config = await getMaintenanceMode()

    // Check if maintenance mode is enabled
    if (!config.enabled) {
      return false
    }

    // Check if scheduled end time has passed
    if (config.scheduled_end) {
      const endTime = new Date(config.scheduled_end)
      const now = new Date()

      if (now > endTime) {
        // Automatically disable maintenance mode if scheduled end has passed
        await setMaintenanceMode(false, config.message, undefined, "system")
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Error in isMaintenanceMode:", error)
    // Return false on error to avoid blocking access
    return false
  }
}
