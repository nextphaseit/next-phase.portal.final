import { supabase } from "./supabaseClient"
import { logAuditEvent } from "./audit"

export interface BackupOptions {
  tableName: string
  includeDeleted?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
}

/**
 * Export data to CSV format
 */
export async function exportToCSV(options: BackupOptions, exportedBy: string): Promise<string> {
  try {
    let query = supabase.from(options.tableName).select("*")

    // Apply filters
    if (!options.includeDeleted) {
      query = query.is("deleted_at", null)
    }

    if (options.dateRange) {
      query = query
        .gte("created_at", options.dateRange.start.toISOString())
        .lte("created_at", options.dateRange.end.toISOString())
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to export ${options.tableName}: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error("No data found to export")
    }

    // Convert to CSV
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value || ""
          })
          .join(","),
      ),
    ].join("\n")

    // Log the export action
    await logAuditEvent(`Exported ${options.tableName}`, exportedBy, {
      tableName: options.tableName,
      recordCount: data.length,
      includeDeleted: options.includeDeleted,
      dateRange: options.dateRange,
    })

    return csvContent
  } catch (error) {
    console.error("Error in exportToCSV:", error)
    throw error
  }
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Create backup of multiple tables
 */
export async function createFullBackup(
  tables: string[],
  exportedBy: string,
  options?: { includeDeleted?: boolean },
): Promise<{ [tableName: string]: string }> {
  try {
    const backups: { [tableName: string]: string } = {}

    for (const tableName of tables) {
      const csvContent = await exportToCSV(
        {
          tableName,
          includeDeleted: options?.includeDeleted || false,
        },
        exportedBy,
      )
      backups[tableName] = csvContent
    }

    // Log the full backup action
    await logAuditEvent("Created Full Backup", exportedBy, {
      tables,
      includeDeleted: options?.includeDeleted || false,
      timestamp: new Date().toISOString(),
    })

    return backups
  } catch (error) {
    console.error("Error in createFullBackup:", error)
    throw error
  }
}

/**
 * Import data from CSV (placeholder for future implementation)
 */
export async function importFromCSV(
  tableName: string,
  csvContent: string,
  importedBy: string,
): Promise<{ success: boolean; recordsImported: number; errors: string[] }> {
  // TODO: Implement CSV import functionality
  // This is a placeholder for future implementation

  console.log("Import functionality not yet implemented")

  await logAuditEvent(`Attempted Import to ${tableName}`, importedBy, {
    tableName,
    status: "not_implemented",
    note: "Import functionality is planned for future release",
  })

  return {
    success: false,
    recordsImported: 0,
    errors: ["Import functionality not yet implemented"],
  }
}
