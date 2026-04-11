import { useState, useEffect } from 'react';
import { getAdminStats } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiUsers, HiBriefcase, HiDocumentText, HiUserGroup } from 'react-icons/hi';
import { toast } from 'react-toastify';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch((err) => {
        console.error('Failed to load stats:', err);
        toast.error('Failed to load dashboard statistics');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: HiUsers, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Recruiters', value: stats?.totalEmployers ?? 0, icon: HiUserGroup, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Job Seekers', value: stats?.totalSeekers ?? 0, icon: HiUsers, color: 'bg-green-50 text-green-600' },
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: HiBriefcase, color: 'bg-orange-50 text-orange-600' },
    { label: 'Active Jobs', value: stats?.activeJobs ?? 0, icon: HiBriefcase, color: 'bg-teal-50 text-teal-600' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, icon: HiDocumentText, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2.5 rounded-lg ${color}`}>
                <Icon className="text-xl" />
              </div>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {stats?.recentUsers?.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b border-gray-200"><th className="pb-2 pr-4">Name</th><th className="pb-2 pr-4">Email</th><th className="pb-2 pr-4">Role</th><th className="pb-2">Joined</th></tr></thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-gray-900">{u.name}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{u.email}</td>
                    <td className="py-2.5 pr-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'employer' ? 'bg-emerald-100 text-emerald-600' : u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span></td>
                    <td className="py-2.5 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOverview;
