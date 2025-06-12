'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, ChevronUp, ChevronDown, Clock, X } from 'lucide-react';
import AdminRoute from '@/components/auth/AdminRoute';
import { useTheme } from 'components/theme/ThemeProvider';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Types
interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  created_at: string;
  assigned_to: string;
}

// Example data
const exampleTickets: Ticket[] = [
  {
    id: 'TICK-001',
    subject: 'Cannot access SharePoint site',
    description: 'User unable to access the main SharePoint site. Getting 403 error.',
    status: 'Open',
    priority: 'High',
    created_at: '2024-03-15',
    assigned_to: 'John Smith',
  },
  {
    id: 'TICK-002',
    subject: 'New laptop setup request',
    description: 'New employee needs laptop setup with all required software.',
    status: 'In Progress',
    priority: 'Medium',
    created_at: '2024-03-14',
    assigned_to: 'Sarah Johnson',
  },
  {
    id: 'TICK-003',
    subject: 'Email sync issues',
    description: 'Outlook not syncing emails properly on mobile device.',
    status: 'Resolved',
    priority: 'Low',
    created_at: '2024-03-13',
    assigned_to: 'Mike Wilson',
  },
  {
    id: 'TICK-004',
    subject: 'VPN connection problems',
    description: 'VPN client keeps disconnecting after 5 minutes of use.',
    status: 'Closed',
    priority: 'Critical',
    created_at: '2024-03-12',
    assigned_to: 'John Smith',
  },
  {
    id: 'TICK-005',
    subject: 'Software license renewal',
    description: 'Adobe Creative Cloud licenses need renewal for design team.',
    status: 'Open',
    priority: 'High',
    created_at: '2024-03-11',
    assigned_to: 'Sarah Johnson',
  },
  {
    id: 'TICK-006',
    subject: 'Printer configuration',
    description: 'New office printer needs network configuration and driver setup.',
    status: 'In Progress',
    priority: 'Medium',
    created_at: '2024-03-10',
    assigned_to: 'Mike Wilson',
  },
  {
    id: 'TICK-007',
    subject: 'Password reset request',
    description: 'User locked out of account after multiple failed attempts.',
    status: 'Resolved',
    priority: 'High',
    created_at: '2024-03-09',
    assigned_to: 'John Smith',
  },
  {
    id: 'TICK-008',
    subject: 'Meeting room display issues',
    description: 'Smart TV in conference room not connecting to laptop.',
    status: 'Open',
    priority: 'Medium',
    created_at: '2024-03-08',
    assigned_to: 'Sarah Johnson',
  },
  {
    id: 'TICK-009',
    subject: 'Data backup request',
    description: 'Department needs assistance with large data backup.',
    status: 'In Progress',
    priority: 'High',
    created_at: '2024-03-07',
    assigned_to: 'Mike Wilson',
  },
  {
    id: 'TICK-010',
    subject: 'Software installation',
    description: 'New design software needs installation on multiple machines.',
    status: 'Open',
    priority: 'Medium',
    created_at: '2024-03-06',
    assigned_to: 'John Smith',
  },
  {
    id: 'TICK-011',
    subject: 'Network connectivity issues',
    description: 'Intermittent network drops in the marketing department.',
    status: 'In Progress',
    priority: 'Critical',
    created_at: '2024-03-05',
    assigned_to: 'Sarah Johnson',
  },
  {
    id: 'TICK-012',
    subject: 'Mobile device setup',
    description: 'New company phones need configuration and app installation.',
    status: 'Open',
    priority: 'High',
    created_at: '2024-03-04',
    assigned_to: 'Mike Wilson',
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
const initialFormState: Omit<Ticket, 'id' | 'created_at'> = {
  subject: '',
  description: '',
  status: 'Open',
  priority: 'Medium',
  assigned_to: '',
};

// Sort direction type
type SortDirection = 'asc' | 'desc' | null;

// Sortable column type
type SortableColumn = 'id' | 'subject' | 'status' | 'priority' | 'created_at' | 'assigned_to';

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch tickets from Supabase
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        // Apply filters if they exist
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        if (priorityFilter) {
          query = query.eq('priority', priorityFilter);
        }
        if (searchQuery) {
          query = query.or(`subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error: supabaseError } = await query;

        if (supabaseError) {
          throw supabaseError;
        }

        setTickets(data || []);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [statusFilter, priorityFilter, searchQuery]);

  // Handle ticket creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error: supabaseError } = await supabase
        .from('tickets')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setTickets(prev => [data, ...prev]);
      setIsModalOpen(false);
      setFormData(initialFormState);
      toast.success('Ticket created successfully');
    } catch (err) {
      console.error('Error creating ticket:', err);
      toast.error('Failed to create ticket');
    }
  };

  // Handle ticket update
  const handleEdit = async (ticket: Ticket) => {
    try {
      const { error: supabaseError } = await supabase
        .from('tickets')
        .update({
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          assigned_to: ticket.assigned_to,
        })
        .eq('id', ticket.id);

      if (supabaseError) throw supabaseError;

      setTickets(prev => prev.map(t => t.id === ticket.id ? ticket : t));
      setIsEditModalOpen(false);
      setSelectedTicket(null);
      toast.success('Ticket updated successfully');
    } catch (err) {
      console.error('Error updating ticket:', err);
      toast.error('Failed to update ticket');
    }
  };

  // Handle ticket deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      const { error: supabaseError } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      setTickets(prev => prev.filter(t => t.id !== id));
      toast.success('Ticket deleted successfully');
    } catch (err) {
      console.error('Error deleting ticket:', err);
      toast.error('Failed to delete ticket');
    }
  };

  // Filter and sort tickets
  const filteredAndSortedTickets = useMemo(() => {
    let result = [...tickets];

    // Apply sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return result;
  }, [tickets, sortColumn, sortDirection]);

  // Paginate tickets
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedTickets.slice(start, end);
  }, [filteredAndSortedTickets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTickets.length / itemsPerPage);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchHistory(false);
    if (query && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev].slice(0, 5));
    }
  };

  // Handle sort
  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    if (type === 'search') {
      setSearchQuery(value);
    } else if (type === 'status') {
      setStatusFilter(value);
    } else if (type === 'priority') {
      setPriorityFilter(value);
    }
    setCurrentPage(1);
  };

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Handle go to page
  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(goToPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPage('');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(query, e);
                        }}
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
          </div>
        )}

        {/* No data state */}
        {!loading && tickets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No tickets found</p>
          </div>
        )}

        {/* Main content */}
        {!loading && tickets.length > 0 && (
          <>
            {/* Tickets Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f4f4f4]">
                    <tr>
                      {[
                        { key: 'id', label: 'Ticket ID' },
                        { key: 'subject', label: 'Subject' },
                        { key: 'status', label: 'Status' },
                        { key: 'priority', label: 'Priority' },
                        { key: 'created_at', label: 'Created Date' },
                        { key: 'assigned_to', label: 'Assigned To' },
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
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                          {ticket.assigned_to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setIsViewModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-yellow-600 hover:text-yellow-800"
                              title="Edit"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setIsEditModalOpen(true);
                              }}
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
          </>
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
                      onChange={(e) => {
                        setFormData({ ...formData, subject: e.target.value });
                      }}
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
                      onChange={(e) => {
                        setFormData({ ...formData, description: e.target.value });
                      }}
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
                        onChange={(e) => {
                          setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' | 'Critical' });
                        }}
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
                        onChange={(e) => {
                          setFormData({ ...formData, status: e.target.value as 'Open' | 'In Progress' | 'Resolved' | 'Closed' });
                        }}
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
                        name="assigned_to"
                        value={formData.assigned_to}
                        onChange={(e) => {
                          setFormData({ ...formData, assigned_to: e.target.value });
                        }}
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
                      <p className="mt-1 text-[#333333]">{selectedTicket.assigned_to}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#333333]">Created Date</h3>
                    <p className="mt-1 text-[#333333]">{new Date(selectedTicket.created_at).toLocaleDateString()}</p>
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
