import { useState, useEffect } from 'react';
import { getMyApplications } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { HiBriefcase, HiLocationMarker, HiCalendar, HiClock, HiCheckCircle, HiXCircle, HiTrendingUp } from 'react-icons/hi';

const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const filteredApps = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const statusConfig = {
    pending: { color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', icon: HiClock },
    shortlisted: { color: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: HiCheckCircle },
    rejected: { color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', icon: HiXCircle },
    accepted: { color: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700', icon: HiCheckCircle },
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${filterStatus === 'all' ? 'ring-2 ring-emerald-500' : ''} cursor-pointer transition-all hover:shadow-md`} onClick={() => setFilterStatus('all')}>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-1">Total</p>
        </div>
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${filterStatus === 'pending' ? 'ring-2 ring-yellow-500' : ''} cursor-pointer transition-all hover:shadow-md`} onClick={() => setFilterStatus('pending')}>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600 mt-1">Pending</p>
        </div>
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${filterStatus === 'shortlisted' ? 'ring-2 ring-emerald-500' : ''} cursor-pointer transition-all hover:shadow-md`} onClick={() => setFilterStatus('shortlisted')}>
          <p className="text-2xl font-bold text-emerald-600">{stats.shortlisted}</p>
          <p className="text-sm text-gray-600 mt-1">Shortlisted</p>
        </div>
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${filterStatus === 'accepted' ? 'ring-2 ring-green-500' : ''} cursor-pointer transition-all hover:shadow-md`} onClick={() => setFilterStatus('accepted')}>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
          <p className="text-sm text-gray-600 mt-1">Accepted</p>
        </div>
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${filterStatus === 'rejected' ? 'ring-2 ring-red-500' : ''} cursor-pointer transition-all hover:shadow-md`} onClick={() => setFilterStatus('rejected')}>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <p className="text-sm text-gray-600 mt-1">Rejected</p>
        </div>
      </div>

      {/* Applications Grid */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiBriefcase className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No applications yet</p>
          <p className="text-gray-500 text-sm mb-4">
            {filterStatus === 'all' 
              ? "You haven't applied to any jobs yet. Start by exploring available positions!"
              : `No applications with "${filterStatus}" status.`}
          </p>
          <Link to="/jobs" className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const config = statusConfig[app.status];
            return (
              <div
                key={app._id}
                className={`border rounded-xl p-6 transition-all hover:shadow-md ${config.color}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
                        <HiBriefcase className="text-white text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/jobs/${app.jobId?._id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors block mb-1"
                        >
                          {app.jobId?.title || 'Job removed'}
                        </Link>
                        <p className="text-gray-600 mb-3">{app.jobId?.employerId?.name || 'Company removed'}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-gray-400 shrink-0" />
                            {app.jobId?.location || 'No location'}
                          </div>
                          <div className="flex items-center gap-1">
                            <HiCalendar className="text-gray-400 shrink-0" />
                            Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                          </div>
                          {app.jobId?.jobType && (
                            <div className="flex items-center gap-1">
                              <HiTrendingUp className="text-gray-400 shrink-0" />
                              <span className="capitalize">{app.jobId.jobType}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize inline-flex items-center gap-2 ${config.badge}`}>
                      {app.status}
                    </span>
                    {app.jobId?._id && (
                      <Link
                        to={`/jobs/${app.jobId._id}`}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                      >
                        View Job →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SeekerApplications;
