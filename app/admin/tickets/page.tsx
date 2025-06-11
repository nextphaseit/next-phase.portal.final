'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, ChevronUp, ChevronDown, Clock, X } from 'lucide-react';
import AdminRoute from '@/components/auth/AdminRoute';
import { useTheme } from 'components/theme/ThemeProvider';

// Types
interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: string;
  assignedTo: string;
}

// Example data
const exampleTickets: Ticket[] = [
  {
    id: 'TICK-001',
    subject: 'Cannot access SharePoint site',
    description: 'User unable to access the main SharePoint site. Getting 403 error.',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-03-15',
    assignedTo: 'John Smith',
  },
  {
    id: 'TICK-002',
    subject: 'New laptop setup request',
    description: 'New employee needs laptop setup with all required software.',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2024-03-14',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'TICK-003',
    subject: 'Email sync issues',
    description: 'Outlook not syncing emails properly on mobile device.',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2024-03-13',
    assignedTo: 'Mike Wilson',
  },
  {
    id: 'TICK-004',
    subject: 'VPN connection problems',
    description: 'VPN client keeps disconnecting after 5 minutes of use.',
    status: 'Closed',
    priority: 'Critical',
    createdAt: '2024-03-12',
    assignedTo: 'John Smith',
  },
  {
    id: 'TICK-005',
    subject: 'Software license renewal',
    description: 'Adobe Creative Cloud licenses need renewal for design team.',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-03-11',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'TICK-006',
    subject: 'Printer configuration',
    description: 'New office printer needs network configuration and driver setup.',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2024-03-10',
    assignedTo: 'Mike Wilson',
  },
  {
    id: 'TICK-007',
    subject: 'Password reset request',
    description: 'User locked out of account after multiple failed attempts.',
    status: 'Resolved',
    priority: 'High',
    createdAt: '2024-03-09',
    assignedTo: 'John Smith',
  },
  {
    id: 'TICK-008',
    subject: 'Meeting room display issues',
    description: 'Smart TV in conference room not connecting to laptop.',
    status: 'Open',
    priority: 'Medium',
    createdAt: '2024-03-08',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'TICK-009',
    subject: 'Data backup request',
    description: 'Department needs assistance with large data backup.',
    status: 'In Progress',
    priority: 'High',
    createdAt: '2024-03-07',
    assignedTo: 'Mike Wilson',
  },
  {
    id: 'TICK-010',
    subject: 'Software installation',
    description: 'New design software needs installation on multiple machines.',
    status: 'Open',
    priority: 'Medium',
    createdAt: '2024-03-06',
    assignedTo: 'John Smith',
  },
  {
    id: 'TICK-011',
    subject: 'Network connectivity issues',
    description: 'Intermittent network drops in the marketing department.',
    status: 'In Progress',
    priority: 'Critical',
    createdAt: '2024-03-05',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'TICK-012',
    subject: 'Mobile device setup',
    description: 'New company phones need configuration and app installation.',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-03-04',
    assignedTo: 'Mike Wilson',
  }
];

// Priority badge colors
const priorityColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800',
};

// Status badge colors
const statusColors = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-purple-100 text-purple-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-800',
};

// Initial form state
const initialFormState: Omit<Ticket, 'id' | 'createdAt'> = {
  subject: '',
  description: '',
  status: 'Open',
  priority: 'Medium',
  assignedTo: '',
};

// Sort direction type
type SortDirection = 'asc' | 'desc' | null;

// Sortable column type
type SortableColumn = 'id' | 'subject' | 'status' | 'priority' | 'createdAt' | 'assignedTo';

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();

  // Add missing state and refs
  const [formData, setFormData] = useState(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const searchHistoryRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [goToPage, setGoToPage] = useState('');
  const getPageNumbers = () => [];
  const handleGoToPage = (e: React.FormEvent) => { e.preventDefault(); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {};
  const handleSort = (column: SortableColumn) => {};
  const handleFilterChange = (type: string, value: string) => {};
  const handleSearch = (query: string) => {};
  const removeFromHistory = (query: string, e: React.MouseEvent) => {};

  const filteredAndSortedTickets: Ticket[] = [];
  const paginatedTickets: Ticket[] = [];
  const totalPages = 1;
  const handleView = (ticket: Ticket) => {};
  const handleEdit = (ticket: Ticket) => {};
  const handleDelete = (id: string) => {};

  return (
    <AdminRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#333333]">Support Tickets</h1>
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
            />
            
            {/* Search History Dropdown */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div
                ref={searchHistoryRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
              >
                <div className="p-2 border-b border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Searches
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {searchHistory.map((query, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearch(query)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{query}</span>
                      </div>
                      <button
                        onClick={(e) => removeFromHistory(query, e)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={() => setSearchHistory([])}
                    className="w-full text-sm text-red-600 hover:text-red-700"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedTickets.length} tickets
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f4f4]">
                <tr>
                  {[
                    { key: 'id', label: 'Ticket ID' },
                    { key: 'subject', label: 'Subject' },
                    { key: 'status', label: 'Status' },
                    { key: 'priority', label: 'Priority' },
                    { key: 'createdAt', label: 'Created Date' },
                    { key: 'assignedTo', label: 'Assigned To' },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort(key as SortableColumn)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{label}</span>
                        {sortColumn === key && (
                          <span>
                            {sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : sortDirection === 'desc' ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {ticket.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {ticket.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View"
                          onClick={() => handleView(ticket)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                          onClick={() => handleEdit(ticket)}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`px-3 py-1 border rounded-lg ${
                        currentPage === page
                          ? 'bg-[#006699] text-white border-[#006699]'
                          : 'border-gray-300 text-[#333333] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* Go to page */}
            <form onSubmit={handleGoToPage} className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] text-sm"
                placeholder="#"
              />
              <button
                type="submit"
                className="px-3 py-1 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50"
              >
                Go
              </button>
            </form>
          </div>
        )}

        {/* New/Edit Ticket Modal */}
        {(isModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#333333]">
                    {isEditModalOpen ? 'Edit Ticket' : 'Create New Ticket'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsEditModalOpen(false);
                      setFormData(initialFormState);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      placeholder="Enter ticket subject"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699] h-32"
                      placeholder="Enter ticket description"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                        required
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                        required
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#333333] mb-1">
                        Assign To
                      </label>
                      <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                        required
                      >
                        <option value="">Select Assignee</option>
                        <option value="John Smith">John Smith</option>
                        <option value="Sarah Johnson">Sarah Johnson</option>
                        <option value="Mike Wilson">Mike Wilson</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsEditModalOpen(false);
                        setFormData(initialFormState);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
                    >
                      {isEditModalOpen ? 'Update Ticket' : 'Create Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Ticket Modal */}
        {isViewModalOpen && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#333333]">Ticket Details</h2>
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedTicket(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-[#333333]">Ticket ID</h3>
                    <p className="mt-1 text-[#333333]">{selectedTicket.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#333333]">Subject</h3>
                    <p className="mt-1 text-[#333333]">{selectedTicket.subject}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#333333]">Description</h3>
                    <p className="mt-1 text-[#333333] whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-[#333333]">Status</h3>
                      <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${statusColors[selectedTicket.status]}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#333333]">Priority</h3>
                      <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${priorityColors[selectedTicket.priority]}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#333333]">Assigned To</h3>
                      <p className="mt-1 text-[#333333]">{selectedTicket.assignedTo}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#333333]">Created Date</h3>
                    <p className="mt-1 text-[#333333]">{selectedTicket.createdAt}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedTicket(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
} 