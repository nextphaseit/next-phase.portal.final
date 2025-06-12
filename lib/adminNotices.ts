import { supabase } from "./supabaseClient"
import { logAuditEvent } from "./audit"

export interface AdminNotice {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
  expires_at?: string
  priority: number
  target_roles: string[]
}

/**
 * Get active admin notices
 */
export async function getActiveAdminNotices(userRole?: string): Promise<AdminNotice[]> {
  try {
    let query = supabase
      .from("admin_notices")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })

    // Filter by expiration date
    query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch admin notices: ${error.message}`)
    }

    // Filter by user role if provided
    if (userRole && data) {
      return data.filter((notice) => notice.target_roles.includes(userRole) || notice.target_roles.includes("all"))
    }

    return data || []
  } catch (error) {
    console.error("Error in getActiveAdminNotices:", error)
    throw error
  }
}

/**
 * Create a new admin notice
 */
export async function createAdminNotice(
  notice: Omit<AdminNotice, "id" | "created_at" | "updated_at">,
  createdBy: string,
): Promise<AdminNotice> {
  try {
    const { data, error } = await supabase
      .from("admin_notices")
      .insert([
        {
          ...notice,
          created_by: createdBy,
        },
      ])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create admin notice: ${error.message}`)
    }

    // Log the action
    await logAuditEvent("Created Admin Notice", createdBy, {
      noticeId: data.id,
      title: notice.title,
      type: notice.type,
      priority: notice.priority,
    })

    return data
  } catch (error) {
    console.error("Error in createAdminNotice:", error)
    throw error
  }
}

/**
 * Update an admin notice
 */
export async function updateAdminNotice(
  id: string,
  updates: Partial<AdminNotice>,
  updatedBy: string,
): Promise<AdminNotice> {
  try {
    const { data, error } = await supabase
      .from("admin_notices")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update admin notice: ${error.message}`)
    }

    // Log the action
    await logAuditEvent("Updated Admin Notice", updatedBy, {
      noticeId: id,
      updates,
    })

    return data
  } catch (error) {
    console.error("Error in updateAdminNotice:", error)
    throw error
  }
}

/**
 * Delete an admin notice
 */
export async function deleteAdminNotice(id: string, deletedBy: string): Promise<void> {
  try {
    const { error } = await supabase.from("admin_notices").delete().eq("id", id)

    if (error) {
      throw new Error(`Failed to delete admin notice: ${error.message}`)
    }

    // Log the action
    await logAuditEvent("Deleted Admin Notice", deletedBy, {
      noticeId: id,
    })
  } catch (error) {
    console.error("Error in deleteAdminNotice:", error)
    throw error
  }
}
