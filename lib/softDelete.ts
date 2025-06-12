import { supabase } from "./supabaseClient"
import { logAuditEvent } from "./audit"

export interface SoftDeleteOptions {
  tableName: string
  id: string
  deletedBy: string
  reason?: string
}

export interface RestoreOptions {
  tableName: string
  id: string
  restoredBy: string
  reason?: string
}

/**
 * Soft delete a record by setting deleted_at timestamp
 */
export async function softDelete({ tableName, id, deletedBy, reason }: SoftDeleteOptions): Promise<void> {
  try {
    const { error } = await supabase
      .from(tableName)
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
      })
      .eq("id", id)

    if (error) {
      throw new Error(`Failed to soft delete ${tableName}: ${error.message}`)
    }

    // Log the soft delete action
    await logAuditEvent(
      `Soft Deleted ${tableName.slice(0, -1)}`, // Remove 's' from table name
      deletedBy,
      {
        id,
        tableName,
        reason: reason || "No reason provided",
        action: "soft_delete",
      },
    )
  } catch (error) {
    console.error("Error in softDelete:", error)
    throw error
  }
}

/**
 * Restore a soft-deleted record by clearing deleted_at timestamp
 */
export async function restoreRecord({ tableName, id, restoredBy, reason }: RestoreOptions): Promise<void> {
  try {
    const { error } = await supabase
      .from(tableName)
      .update({
        deleted_at: null,
        deleted_by: null,
      })
      .eq("id", id)

    if (error) {
      throw new Error(`Failed to restore ${tableName}: ${error.message}`)
    }

    // Log the restore action
    await logAuditEvent(
      `Restored ${tableName.slice(0, -1)}`, // Remove 's' from table name
      restoredBy,
      {
        id,
        tableName,
        reason: reason || "No reason provided",
        action: "restore",
      },
    )
  } catch (error) {
    console.error("Error in restoreRecord:", error)
    throw error
  }
}

/**
 * Get deleted records for a table
 */
export async function getDeletedRecords(tableName: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch deleted ${tableName}: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Error in getDeletedRecords:", error)
    throw error
  }
}

/**
 * Permanently delete old soft-deleted records (cleanup)
 * This should be run periodically to clean up old deleted records
 */
export async function permanentlyDeleteOldRecords(tableName: string, olderThanDays = 90): Promise<number> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .not("deleted_at", "is", null)
      .lt("deleted_at", cutoffDate.toISOString())
      .select("id")

    if (error) {
      throw new Error(`Failed to permanently delete old ${tableName}: ${error.message}`)
    }

    return data?.length || 0
  } catch (error) {
    console.error("Error in permanentlyDeleteOldRecords:", error)
    throw error
  }
}
