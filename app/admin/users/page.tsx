'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Pencil, Trash2, UserPlus, Mail, Phone, Building } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Types
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'moderator';
  department: string;
  phone: string;
  created_at: string;
  last_sign_in: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'user',
    department: '',
    phone: '',
  });

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error: supabaseError } = await supabase
        .from('users')
        .insert([formData])
        .select()
        .single();

      if (supabaseError) throw supabaseError;

      setUsers(prev => [data, ...prev]);
      setIsModalOpen(false);
      setFormData({
        email: '',
        full_name: '',
        role: 'user',
        department: '',
        phone: '',
      });
      toast.success('User created successfully');
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error('Failed to create user');
    }
  };

  // Handle user update
  const handleUpdate = async (user: User) => {
    try {
      const { error: supabaseError } = await supabase
        .from('users')
        .update({
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          department: user.department,
          phone: user.phone,
        })
        .eq('id', user.id);

      if (supabaseError) throw supabaseError;

      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
      setIsModalOpen(false);
      setSelectedUser(null);
      toast.success('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
    }
  };

  // Handle user deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error: supabaseError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#333333]">User Management</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setFormData({
              email: '',
              full_name: '',
              role: 'user',
              department: '',
              phone: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] transition-colors"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f4f4f4]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    Last Sign In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-[#006699] flex items-center justify-center text-white">
                            {user.full_name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#333333]">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'moderator' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-[#333333]">
                        <Building className="w-4 h-4 mr-2 text-gray-400" />
                        {user.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-[#333333]">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {new Date(user.last_sign_in).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          title="Edit"
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({
                              email: user.email,
                              full_name: user.full_name,
                              role: user.role,
                              department: user.department,
                              phone: user.phone,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() => handleDelete(user.id)}
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
      )}

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#333333]">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={selectedUser ? handleUpdate : handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#333333] mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
                  >
                    {selectedUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
