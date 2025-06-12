export interface AuditLog {
  id: string;
  action: string;
  performed_by: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  action?: string;
  performed_by?: string;
} 