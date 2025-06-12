import { AuditLog } from '@/types/audit';

export function generateCSV(auditLogs: AuditLog[]): string {
  // Define CSV headers
  const headers = ['Action', 'Performed By', 'Timestamp', 'Metadata'];
  
  // Convert audit logs to CSV rows
  const rows = auditLogs.map(log => [
    log.action,
    log.performed_by,
    new Date(log.timestamp).toLocaleString(),
    JSON.stringify(log.metadata)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string) {
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Set up download
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
