import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const DashboardLayout = ({ children, links }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get dashboard title and subtitle based on role and current route
  const getDashboardInfo = () => {
    const isSeekerRoute = location.pathname.includes('/seeker');
    const isRecruiterRoute = location.pathname.includes('/employer');

    if (isSeekerRoute) {
      if (location.pathname.includes('applications')) {
        return {
          title: 'My Applications',
          subtitle: 'Track your job applications',
          roleLabel: 'Job Seeker'
        };
      } else if (location.pathname.includes('profile')) {
        return {
          title: 'My Profile',
          subtitle: 'Update your professional information',
          roleLabel: 'Job Seeker'
        };
      } else if (location.pathname.includes('settings')) {
        return {
          title: 'Settings',
          subtitle: 'Manage your preferences and privacy',
          roleLabel: 'Job Seeker'
        };
      }
      return {
        title: 'Job Applications Dashboard',
        subtitle: 'Manage your job search journey',
        roleLabel: 'Job Seeker'
      };
    } else if (isRecruiterRoute) {
      if (location.pathname.includes('jobs')) {
        return {
          title: 'My Job Postings',
          subtitle: 'Manage your open positions',
          roleLabel: 'Recruiter'
        };
      } else if (location.pathname.includes('create-job')) {
        return {
          title: 'Post a New Job',
          subtitle: 'Create an opportunity for top talent',
          roleLabel: 'Recruiter'
        };
      } else if (location.pathname.includes('applicants')) {
        return {
          title: 'Applicants',
          subtitle: 'Review and manage applications',
          roleLabel: 'Recruiter'
        };
      } else if (location.pathname.includes('profile')) {
        return {
          title: 'Company Profile',
          subtitle: 'Manage your company information',
          roleLabel: 'Recruiter'
        };
      } else if (location.pathname.includes('settings')) {
        return {
          title: 'Settings',
          subtitle: 'Manage your preferences and privacy',
          roleLabel: 'Recruiter'
        };
      }
      return {
        title: 'Recruitment Dashboard',
        subtitle: 'Manage your hiring process',
        roleLabel: 'Recruiter'
      };
    }

    return {
      title: 'Dashboard',
      subtitle: 'Welcome back',
      roleLabel: 'User'
    };
  };

  const dashboardInfo = getDashboardInfo();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-white/30 px-4 py-2 flex items-center shadow-lg">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-emerald-50 rounded-lg text-gray-600 transition-all hover:text-emerald-600 bg-white/50 border border-white/30 hover:border-emerald-300/50"
        >
          {sidebarOpen ? <HiX className="text-lg" /> : <HiMenu className="text-lg" />}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transform transition-transform duration-300 fixed lg:sticky left-0 top-16 lg:top-0 w-64 h-[calc(100vh-4rem)] lg:h-screen bg-white/80 backdrop-blur-xl border-r border-white/30 z-30 overflow-y-auto shadow-xl`}
        >
          <nav className="p-4 space-y-1.5">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-emerald-50/70 hover:text-emerald-700 hover:shadow-md'
                  }`
                }
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto flex flex-col">
          {/* Dashboard Header */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-white/30 sticky top-0 z-20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {dashboardInfo.title}
                  </h1>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg ${
                  dashboardInfo.roleLabel === 'Job Seeker' 
                    ? 'bg-linear-to-r from-blue-100 to-blue-200 text-blue-700' 
                    : 'bg-linear-to-r from-purple-100 to-purple-200 text-purple-700'
                }`}>
                  {dashboardInfo.roleLabel}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">{dashboardInfo.subtitle}</p>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
