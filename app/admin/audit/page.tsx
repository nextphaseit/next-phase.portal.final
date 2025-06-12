'use client';

import { useState, useEffect } from 'react';
import { Download, Filter, Search } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { AuditLog, AuditLogFilters } from '@/types/audit';
import { generateCSV, downloadCSV } from '@/lib/utils/csvExport';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Fetch audit logs
  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.performed_by) {
        query = query.eq('performed_by', filters.performed_by);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `audit_logs-${date}.csv`;
      
      // Generate and download CSV
      const csvContent = generateCSV(logs);
      downloadCSV(csvContent, filename);
      
      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast.error('Failed to export audit logs');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text dark:text-dark-text">Audit Logs</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-theme"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || logs.length === 0}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-theme disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1">
                Action
              </label>
              <input
                type="text"
                value={filters.action || ''}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-3 py-2 border border-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Filter by action"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text dark:text-dark-text mb-1">
                Performed By
              </label>
              <input
                type="text"
                value={filters.performed_by || ''}
                onChange={(e) => setFilters({ ...filters, performed_by: e.target.value })}
                className="w-full px-3 py-2 border border-border dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Filter by user"
              />
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-text dark:text-dark-text uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text dark:text-dark-text uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text dark:text-dark-text uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text dark:text-dark-text uppercase tracking-wider">
                  Metadata
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-text dark:text-dark-text">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text dark:text-dark-text">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text dark:text-dark-text">
                      {log.performed_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text dark:text-dark-text">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-text dark:text-dark-text">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
