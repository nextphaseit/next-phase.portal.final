'use client';

import { Menu, LogOut } from 'lucide-react';

interface AdminTopNavProps {
  onMenuClick: () => void;
}

export default function AdminTopNav({ onMenuClick }: AdminTopNavProps) {
  return (
    <header className="bg-white h-16 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-[#f4f4f4] transition-colors"
          >
            <Menu className="w-6 h-6 text-[#333333]" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-[#333333] font-medium">Admin User</span>
          <button
            className="p-2 rounded-lg hover:bg-[#f4f4f4] transition-colors"
            onClick={() => {/* Add logout handler */}}
          >
            <LogOut className="w-6 h-6 text-[#333333]" />
          </button>
        </div>
      </div>
    </header>
  );
} 