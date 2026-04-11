import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { HiChartBar, HiUsers, HiBriefcase } from 'react-icons/hi';
import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminJobs from './admin/AdminJobs';

const links = [
  { to: '/admin/overview', label: 'Overview', icon: HiChartBar },
  { to: '/admin/users', label: 'Users', icon: HiUsers },
  { to: '/admin/jobs', label: 'Jobs', icon: HiBriefcase },
];

const AdminDashboard = () => {
  return (
    <div className="flex min-h-[calc(100vh-128px)]">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Panel</h2>
        <nav className="space-y-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="text-lg" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="jobs" element={<AdminJobs />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
