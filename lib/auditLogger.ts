import { supabase } from '@/lib/supabaseClient';

/**
 * Type for audit log metadata
 */
export type AuditLogMetadata = Record<string, any>;

/**
 * Type for audit log entry
 */
export interface AuditLogEntry {
  action: string;
  performed_by: string;
  timestamp?: string;
  metadata?: AuditLogMetadata;
}

/**
 * Logs an audit event to the Supabase audit_logs table
 * 
 * @param action - The action being performed (e.g., 'Created Ticket', 'Deleted User')
 * @param performedBy - The email or UUID of the user performing the action
 * @param metadata - Additional context about the action (optional)
 * 
 * @example
 * // Basic usage
 * await logAuditEvent('User Login', 'user@example.com');
 * 
 * @example
 * // With metadata
 * await logAuditEvent('Created Ticket', 'admin@example.com', {
 *   ticketId: '123',
 *   title: 'Support Request',
 *   priority: 'High'
 * });
 * 
 * @example
 * // In a try-catch block
 * try {
 *   await createUser(userData);
 *   await logAuditEvent('User Created', currentUser.email, { userId: newUser.id });
 * } catch (error) {
 *   await logAuditEvent('User Creation Failed', currentUser.email, { error: error.message });
 * }
 */
export async function logAuditEvent(
  action: string,
  performedBy: string,
  metadata: AuditLogMetadata = {}
): Promise<void> {
  // Validate inputs
  if (!action || typeof action !== 'string') {
    console.error('Invalid action provided to logAuditEvent');
    return;
  }

  if (!performedBy || typeof performedBy !== 'string') {
    console.error('Invalid performedBy provided to logAuditEvent');
    return;
  }

  // Sanitize metadata to prevent circular references
  const sanitizedMetadata = JSON.parse(JSON.stringify(metadata));

  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([
        {
          action,
          performed_by: performedBy,
          metadata: sanitizedMetadata,
          // Let Supabase handle the timestamp to ensure server-side consistency
        },
      ]);

    if (error) {
      console.error('Failed to log audit event:', {
        action,
        performedBy,
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Unexpected error in logAuditEvent:', {
      action,
      performedBy,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Retrieves audit logs with optional filtering
 * 
 * @param filters - Optional filters for the query
 * @returns Promise<Array<AuditLogEntry>>
 * 
 * @example
 * // Get all logs
 * const logs = await getAuditLogs();
 * 
 * @example
 * // Get logs with filters
 * const logs = await getAuditLogs({
 *   action: 'User Login',
 *   startDate: new Date('2024-01-01'),
 *   limit: 100
 * });
 */
export async function getAuditLogs(filters?: {
  action?: string;
  performedBy?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): Promise<AuditLogEntry[]> {
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
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAuditLogs:', error);
    return [];
  }
}

/**
 * Common audit actions for consistency across the application
 */
export const AuditActions = {
  // User actions
  USER_LOGIN: 'User Login',
  USER_LOGOUT: 'User Logout',
  USER_CREATED: 'User Created',
  USER_UPDATED: 'User Updated',
  USER_DELETED: 'User Deleted',
  
  // Ticket actions
  TICKET_CREATED: 'Ticket Created',
  TICKET_UPDATED: 'Ticket Updated',
  TICKET_DELETED: 'Ticket Deleted',
  TICKET_STATUS_CHANGED: 'Ticket Status Changed',
  
  // Document actions
  DOCUMENT_UPLOADED: 'Document Uploaded',
  DOCUMENT_DELETED: 'Document Deleted',
  DOCUMENT_DOWNLOADED: 'Document Downloaded',
  
  // Settings actions
  SETTINGS_UPDATED: 'Settings Updated',
  
  // System actions
  SYSTEM_ERROR: 'System Error',
  CONFIGURATION_CHANGED: 'Configuration Changed',
} as const; 