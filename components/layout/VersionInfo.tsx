'use client';

// Version info - update these values when deploying new versions
const VERSION = '1.0.0';
const LAST_UPDATED = '2024-03-19';

export default function VersionInfo() {
  return (
    <footer className="py-2 px-4 border-t border-border dark:border-dark-border bg-background dark:bg-dark-background">
      <div className="flex justify-end">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          v{VERSION} — Last updated: {LAST_UPDATED}
        </p>
      </div>
    </footer>
  );
}
