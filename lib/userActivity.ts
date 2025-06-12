import { supabase } from "./supabaseClient"

export interface UserActivityLog {
  id: string
  user_id?: string
  user_email: string
  action: "Login" | "Logout" | "Page View" | "Action"
  page?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  timestamp: string
  created_at: string
}

/**
 * Logs user activity to the database
 * @param userEmail - Email of the user performing the action
 * @param action - Type of action being performed
 * @param page - Page name (for Page View actions)
 * @param metadata - Additional context data
 */
export async function logUserActivity(
  userEmail: string,
  action: UserActivityLog["action"],
  page?: string,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    // Get client IP and user agent if available
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : undefined

    const { error } = await supabase.from("user_activity_log").insert([
      {
        user_email: userEmail,
        action,
        page,
        metadata: metadata || {},
        user_agent: userAgent,
        timestamp: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Failed to log user activity:", error)
      // Don't throw error to avoid breaking user experience
    }
  } catch (error) {
    console.error("Error in logUserActivity:", error)
    // Don't throw error to avoid breaking user experience
  }
}

/**
 * Retrieves user activity logs with optional filtering
 */
export async function getUserActivityLogs(filters?: {
  userEmail?: string
  action?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  try {
    let query = supabase.from("user_activity_log").select("*").order("timestamp", { ascending: false })

    if (filters) {
      if (filters.userEmail) {
        query = query.eq("user_email", filters.userEmail)
      }
      if (filters.action) {
        query = query.eq("action", filters.action)
      }
      if (filters.startDate) {
        query = query.gte("timestamp", filters.startDate.toISOString())
      }
      if (filters.endDate) {
        query = query.lte("timestamp", filters.endDate.toISOString())
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Failed to fetch user activity logs:", error)
      throw new Error(`Failed to fetch user activity logs: ${error.message}`)
    }

    return data as UserActivityLog[]
  } catch (error) {
    console.error("Error in getUserActivityLogs:", error)
    throw error
  }
}

/**
 * Hook for tracking page views automatically
 */
export function usePageTracking(userEmail?: string) {
  const trackPageView = (pageName: string) => {
    if (userEmail) {
      logUserActivity(userEmail, "Page View", pageName, {
        timestamp: new Date().toISOString(),
        url: typeof window !== "undefined" ? window.location.pathname : undefined,
      })
    }
  }

  return { trackPageView }
}
