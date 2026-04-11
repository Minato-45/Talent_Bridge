import { useState, useEffect } from 'react';
import { getMyApplications } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';

const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedApps = applications.slice(startIndex, endIndex);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{applications.length} applications total</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <HiArrowRight className="text-2xl text-gray-400" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-500 mb-6">Start your job search and apply to positions that interest you</p>
          <Link to="/jobs" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
            Browse Jobs <HiArrowRight />
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedApps.map((app) => (
              <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <Link to={`/jobs/${app.jobId?._id}`} className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-1">
                          {app.jobId?.title || 'Job removed'}
                        </Link>
                        <p className="text-sm text-gray-600">{app.jobId?.employerId?.name || '-'}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{app.jobId?.location}</span>
                          <span>•</span>
                          <span className="capitalize">{app.jobId?.jobType}</span>
                          <span>•</span>
                          <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} size="sm" />
                    <Link to={`/jobs/${app.jobId?._id}`} className="text-emerald-600 hover:text-emerald-700">
                      <HiArrowRight className="text-xl" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-emerald-500 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeekerApplications;
