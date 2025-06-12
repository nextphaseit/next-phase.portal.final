'use client';

import { FileText, AlertCircle, Link as LinkIcon, History } from 'lucide-react';

// Example version history data
const versionHistory = [
  {
    version: '1.0.0',
    date: '2024-03-19',
    changes: 'Initial release with core features'
  },
  {
    version: '1.1.0',
    date: '2024-03-20',
    changes: 'Added Audit Log Export functionality'
  },
  {
    version: '1.2.0',
    date: '2024-03-21',
    changes: 'Implemented Dark Mode support'
  }
];

// Example known issues
const knownIssues = [
  {
    id: 'KI-001',
    description: 'Calendar events may not sync immediately after creation',
    severity: 'Low',
    status: 'In Progress'
  },
  {
    id: 'KI-002',
    description: 'PDF export formatting issues in Firefox browser',
    severity: 'Medium',
    status: 'Investigating'
  }
];

// Example change log
const changeLog = [
  {
    date: '2024-03-21',
    changes: [
      'Added Dark Mode support',
      'Improved mobile responsiveness',
      'Enhanced audit log export functionality'
    ]
  },
  {
    date: '2024-03-20',
    changes: [
      'Added CSV export for audit logs',
      'Fixed user profile update issues',
      'Improved error handling in ticket system'
    ]
  }
];

export default function DocumentationPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title */}
      <div className="flex items-center space-x-2">
        <FileText className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-text dark:text-dark-text">Documentation</h1>
      </div>

      {/* Portal Purpose */}
      <section className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text dark:text-dark-text mb-4">Portal Purpose</h2>
        <p className="text-text dark:text-dark-text">
          The NextPhase IT Admin Portal is a comprehensive management platform designed to streamline IT operations,
          enhance security, and improve service delivery. It provides centralized access to user management,
          ticket tracking, document control, and audit logging capabilities, ensuring efficient and compliant
          IT service management.
        </p>
      </section>

      {/* Version History */}
      <section className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-text dark:text-dark-text mb-4">Version History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-dark-border">
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">Version</th>
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">Release Date</th>
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">Changes</th>
              </tr>
            </thead>
            <tbody>
              {versionHistory.map((version) => (
                <tr key={version.version} className="border-b border-border dark:border-dark-border">
                  <td className="py-2 px-4 text-text dark:text-dark-text">v{version.version}</td>
                  <td className="py-2 px-4 text-text dark:text-dark-text">{version.date}</td>
                  <td className="py-2 px-4 text-text dark:text-dark-text">{version.changes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Known Issues */}
      <section className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-text dark:text-dark-text">Known Issues</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border dark:border-dark-border">
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">ID</th>
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">Description</th>
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">Severity</th>
                <th className="text-left py-2 px-4 text-text dark:text-dark-text">Status</th>
              </tr>
            </thead>
            <tbody>
              {knownIssues.map((issue) => (
                <tr key={issue.id} className="border-b border-border dark:border-dark-border">
                  <td className="py-2 px-4 text-text dark:text-dark-text">{issue.id}</td>
                  <td className="py-2 px-4 text-text dark:text-dark-text">{issue.description}</td>
                  <td className="py-2 px-4 text-text dark:text-dark-text">{issue.severity}</td>
                  <td className="py-2 px-4 text-text dark:text-dark-text">{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Useful Links */}
      <section className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <LinkIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-text dark:text-dark-text">Useful Links</h2>
        </div>
        <div className="space-y-2">
          <a
            href="mailto:support@nextphaseit.com"
            className="block text-primary hover:underline"
          >
            Support: support@nextphaseit.com
          </a>
          <a
            href="/privacy-policy"
            className="block text-primary hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="block text-primary hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="https://nextphaseit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            Company Website
          </a>
        </div>
      </section>

      {/* Change Log */}
      <section className="bg-background dark:bg-dark-background border border-border dark:border-dark-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-text dark:text-dark-text">Change Log</h2>
        </div>
        <div className="space-y-6">
          {changeLog.map((entry) => (
            <div key={entry.date} className="border-b border-border dark:border-dark-border last:border-0 pb-4 last:pb-0">
              <h3 className="font-semibold text-text dark:text-dark-text mb-2">{entry.date}</h3>
              <ul className="list-disc list-inside space-y-1 text-text dark:text-dark-text">
                {entry.changes.map((change, index) => (
                  <li key={index}>{change}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
