import { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiTrash, HiSearch } from 'react-icons/hi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async (p = page, role = roleFilter) => {
    setLoading(true);
    try {
      const { data } = await getAdminUsers(p, role);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setPage(1); 
    fetchUsers(1, roleFilter);
  }, [roleFilter]);

  useEffect(() => { 
    fetchUsers(page, roleFilter); 
  }, [page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminUser(id);
      toast.success('User deleted');
      fetchUsers(page, roleFilter);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <HiSearch className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">All Roles</option>
          <option value="jobseeker">Job Seekers</option>
          <option value="employer">Recruiters</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'employer' ? 'bg-emerald-100 text-emerald-600' : u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDelete(u._id, u.name)} className="text-red-500 hover:text-red-700 p-1" title="Delete user">
                        <HiTrash className="text-lg" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-200">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40">Prev</button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
