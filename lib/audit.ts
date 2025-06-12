import { supabase } from './supabaseClient';

interface AuditLogMetadata {
  [key: string]: any;
}

/**
 * Logs an audit event to the Supabase audit_logs table
 * @param action - The action being performed (e.g., 'Created Ticket', 'Deleted User')
 * @param performedBy - The email or UUID of the user performing the action
 * @param metadata - Additional context about the action (optional)
 * @returns Promise<void>
 * @throws Error if logging fails
 */
export async function logAuditEvent(
  action: string,
  performedBy: string,
  metadata?: AuditLogMetadata
): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([
        {
          action,
          performed_by: performedBy,
          metadata: metadata || {},
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Failed to log audit event:', error);
      throw new Error(`Failed to log audit event: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in logAuditEvent:', error);
    throw error;
  }
}

/**
 * Retrieves audit logs with optional filtering
 * @param filters - Optional filters for the query
 * @returns Promise<Array<AuditLog>>
 */
export async function getAuditLogs(filters?: {
  action?: string;
  performedBy?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (filters) {
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.performedBy) {
        query = query.eq('performed_by', filters.performedBy);
      }
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      throw new Error(`Failed to fetch audit logs: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getAuditLogs:', error);
    throw error;
  }
}

/**
 * Creates a higher-order function that automatically logs audit events
 * @param action - The action to log
 * @param getPerformedBy - Function to get the user who performed the action
 * @returns Function that wraps the original function with audit logging
 */
export function withAuditLogging<T extends (...args: any[]) => Promise<any>>(
  action: string,
  getPerformedBy: (...args: Parameters<T>) => string
) {
  return async (fn: T, ...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      const result = await fn(...args);
      const performedBy = getPerformedBy(...args);
      
      // Extract relevant metadata from the result
      const metadata = typeof result === 'object' ? result : { result };
      
      await logAuditEvent(action, performedBy, metadata);
      return result;
    } catch (error) {
      // Log the error as an audit event
      const performedBy = getPerformedBy(...args);
      await logAuditEvent(
        `${action} Failed`,
        performedBy,
        { error: error instanceof Error ? error.message : String(error) }
      );
      throw error;
    }
  };
} 