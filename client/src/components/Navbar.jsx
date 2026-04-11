import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { HiBell, HiMenu, HiX, HiViewGrid, HiUser, HiCog, HiLogout, HiHome } from "react-icons/hi";
import { getNotifications, markNotificationsRead } from "../api/axios";
import { useSocket } from "../hooks/useSocket";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Fetch existing notifications
      getNotifications()
        .then(({ data }) => {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        })
        .catch(() => {});

      // Listen for real-time notifications
      if (socket) {
        socket.on('new_notification', (notification) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        });

        return () => {
          if (socket) {
            socket.off('new_notification');
          }
        };
      }
    }
  }, [user, socket]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotifClick = async () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen && unreadCount > 0) {
      await markNotificationsRead();
      setUnreadCount(0);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "recruiter") return "/employer/dashboard";
    return "/seeker/dashboard";
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "?");

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
      isActive(path)
        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl"
        : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-2xl group"
            >
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg p-2 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <HiViewGrid className="text-white text-2xl" />
              </div>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600 text-2xl font-black">TalentBridge</span>
            </Link>
          </div>

          {/* Center Nav */}
          <div className="hidden lg:flex items-center gap-2 bg-white/50 backdrop-blur-xl rounded-lg px-3 py-2 border border-white/20 shadow-lg hover:bg-white/60 transition-all">
            <Link
              to="/jobs"
              className={navLinkClass("/jobs")}
            >
              Find Jobs
            </Link>
            {!user && (
              <>
                <Link
                  to="/find-talent"
                  className={navLinkClass("/find-talent")}
                >
                  Find Talent
                </Link>
                <Link
                  to="/upload-job"
                  className={navLinkClass("/upload-job")}
                >
                  Upload Job
                </Link>
              </>
            )}
            {user?.role === "recruiter" && (
              <Link
                to="/employer/dashboard/create-job"
                className={navLinkClass("/employer/dashboard/create-job")}
              >
                Post Job
              </Link>
            )}
            {user && (
              <Link
                to={getDashboardLink()}
                className={navLinkClass(getDashboardLink())}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={handleNotifClick}
                    className="relative p-2 text-gray-600 hover:text-emerald-600 bg-white/50 backdrop-blur-xl hover:bg-emerald-50/80 rounded-lg transition-all duration-300 group border border-white/20 hover:border-emerald-300/50 hover:shadow-lg"
                  >
                    <HiBell className="text-2xl group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-1 bg-linear-to-br from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/30 max-h-80 overflow-y-auto z-50 animate-slide-up">
                      <div className="sticky top-0 bg-white/95 backdrop-blur-sm p-3 border-b border-white/30 font-bold text-gray-900 rounded-t-xl text-base">
                        Notifications
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-5xl mb-2 opacity-20">🔔</div>
                          <p className="text-gray-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n._id}
                            className={`p-3 border-b border-white/20 text-sm hover:bg-emerald-50/50 transition-colors ${!n.read ? "bg-emerald-50/50 border-emerald-100" : ""}`}
                          >
                            <p className="text-gray-800 font-semibold text-sm">{n.message}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative flex items-center gap-3 pl-6 border-l border-white/20" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50/50 transition-all duration-300 group cursor-pointer hover:shadow-lg bg-white/50 backdrop-blur-xl border border-white/20"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-125">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name.split(' ')[0]}</p>
                      <p className="text-xs text-gray-500 capitalize font-medium">{user.role}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-all duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 z-50 top-full overflow-hidden animate-slide-up">
                      {/* User Profile Section - Premium Header */}
                      <div className="bg-linear-to-br from-emerald-500 via-emerald-500 to-teal-600 p-4 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
                        </div>
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40">
                            <span className="text-white font-bold text-2xl">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-white text-lg truncate">{user.name}</p>
                            <p className="text-emerald-50 text-sm mt-0.5 truncate">{user.email}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <span className="inline-flex text-xs font-black bg-white/25 backdrop-blur-md text-white px-3 py-1 rounded-full capitalize border border-white/50 shadow-lg">
                                {user.role}
                              </span>
                              <span className="inline-flex text-lg text-emerald-100">●</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate(getDashboardLink());
                            setProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50/80 flex items-center gap-3 transition-all duration-200 group font-semibold"
                        >
                          <div className="text-lg text-gray-400 group-hover:text-emerald-600 group-hover:scale-125 transition-all">
                            <HiHome />
                          </div>
                          <span className="group-hover:text-emerald-700">Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate(getDashboardLink() + '/profile');
                            setProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50/80 flex items-center gap-3 transition-all duration-200 group font-semibold"
                        >
                          <div className="text-lg text-gray-400 group-hover:text-emerald-600 group-hover:scale-125 transition-all">
                            <HiUser />
                          </div>
                          <span className="group-hover:text-emerald-700">My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate(getDashboardLink() + '/settings');
                            setProfileOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-emerald-50/80 flex items-center gap-3 transition-all duration-200 group font-semibold"
                        >
                          <div className="text-lg text-gray-400 group-hover:text-emerald-600 group-hover:scale-125 transition-all">
                            <HiCog />
                          </div>
                          <span className="group-hover:text-emerald-700">Settings</span>
                        </button>
                      </div>

                      {/* Logout Section */}
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all duration-200 group font-semibold rounded-lg"
                        >
                          <div className="text-lg text-red-500 group-hover:text-red-700 group-hover:scale-125 transition-all">
                            <HiLogout />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-emerald-600 font-semibold text-sm transition-colors duration-300 px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 font-semibold text-sm hover:scale-105 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-300 bg-white/50 backdrop-blur-xl border border-white/20"
            >
              {mobileOpen ? (
                <HiX className="text-2xl" />
              ) : (
                <HiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-white/30 animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/jobs"
              className="block text-gray-700 hover:text-emerald-600 font-bold text-base transition-colors duration-300"
              onClick={() => setMobileOpen(false)}
            >
              Find Jobs
            </Link>
            {!user && (
              <>
                <Link
                  to="/find-talent"
                  className="block text-gray-700 hover:text-emerald-600 font-bold text-base transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Find Talent
                </Link>
                <Link
                  to="/upload-job"
                  className="block text-gray-700 hover:text-emerald-600 font-bold text-base transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Upload Job
                </Link>
              </>
            )}
            {user?.role === "recruiter" && (
              <Link
                to="/employer/dashboard/create-job"
                className="block text-gray-700 hover:text-emerald-600 font-bold text-base transition-colors duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Post Job
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block text-gray-700 hover:text-emerald-600 font-bold text-base transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-red-600 font-bold text-base hover:text-red-700 transition-colors duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-emerald-600 font-bold text-base transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block text-emerald-600 font-semibold text-base hover:text-emerald-700 transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
