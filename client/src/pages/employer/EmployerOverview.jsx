import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyJobs } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiBriefcase, HiClock, HiUserGroup, HiPlusCircle, HiEye, HiPencil, HiTrash, HiArrowRight, HiCalendar, HiLocationMarker, HiCurrencyDollar, HiTrendingUp, HiFire } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployerOverview = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('EmployerOverview - Fetching jobs for user:', user);
    getMyJobs()
      .then(({ data }) => {
        console.log('EmployerOverview - Jobs fetched:', data);
        setJobs(data);
      })
      .catch((error) => {
        console.error('EmployerOverview - Failed to load jobs:', error.response?.data || error.message);
        toast.error(`Failed to load jobs: ${error.response?.data?.message || error.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const activeJobs = jobs.filter(j => !j.filled).length;
  const filledJobs = jobs.filter(j => j.filled).length;
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-600 text-sm">Manage your job postings and track applicants</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Jobs</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <HiBriefcase className="text-blue-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{activeJobs}</p>
                  <p className="text-sm text-gray-600 mt-1">Active</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <HiClock className="text-emerald-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
                  <p className="text-sm text-gray-600 mt-1">Applications</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <HiUserGroup className="text-purple-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6 mb-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">📢 Looking to expand your team?</h3>
                <p className="text-sm text-gray-600">Post a new job and reach thousands of qualified candidates</p>
              </div>
              <Link
                to="/employer/dashboard/create-job"
                className="ml-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2 font-semibold"
              >
                <HiPlusCircle /> Post Job
              </Link>
            </div>
          </div>

          {/* Recent Jobs Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
                  <p className="text-sm text-gray-600 mt-1">Your latest job listings and their performance</p>
                </div>
                <Link to="/employer/dashboard/jobs" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                  View All <HiArrowRight />
                </Link>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiBriefcase className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No jobs posted yet</p>
                <p className="text-gray-500 text-sm mb-4">Start building your dream team by posting your first job opening</p>
                <Link to="/employer/dashboard/create-job" className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job._id} className="hover:bg-gray-50 transition-colors p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
                            <HiBriefcase className="text-white text-xl" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                              <HiLocationMarker className="text-gray-400 shrink-0" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <HiCurrencyDollar className="text-gray-400 shrink-0" />
                              {job.salaryMin && job.salaryMax ? `${job.salaryMin}-${job.salaryMax}` : 'Not specified'}
                            </div>
                            <div className="flex items-center gap-1">
                              <HiUserGroup className="text-gray-400 shrink-0" />
                                {job.applications?.length || 0} applications
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          !job.filled ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {job.filled ? '✓ Filled' : '🔴 Hiring'}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            to={`/employer/dashboard/jobs/${job._id}/applicants`}
                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                            title="View Applicants"
                          >
                            <HiEye className="text-lg" />
                          </Link>
                          <Link
                            to={`/employer/dashboard/jobs/${job._id}/edit`}
                            className="p-2 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <HiPencil className="text-lg" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Post Job CTA */}
          <div className="bg-linear-to-br from-blue-600 to-emerald-600 rounded-xl text-white p-6">
            <div className="mb-4">
              <HiFire className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold mb-1">Grow Your Team</h3>
              <p className="text-emerald-100 text-sm">Post a job and attract top talent in minutes</p>
            </div>
            <Link to="/employer/dashboard/create-job" className="block w-full py-2 px-4 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold text-center">
              Post a Job
            </Link>
          </div>

          {/* Job Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm font-medium">Active Jobs</span>
                  <span className="font-semibold text-gray-900">{activeJobs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${jobs.length > 0 ? (activeJobs / jobs.length) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm font-medium">Filled Positions</span>
                  <span className="font-semibold text-gray-900">{filledJobs}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${jobs.length > 0 ? (filledJobs / jobs.length) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Insights */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">\ud83d\udcca Quick Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>
                  {totalApplications > 0
                    ? `You have ${totalApplications} new applications to review`
                    : 'No applications yet. Share your jobs!'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>
                  {activeJobs > 0
                    ? `${activeJobs} position${activeJobs !== 1 ? 's' : ''} actively hiring`
                    : 'Post a new job to start recruiting'}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Update job descriptions to attract more candidates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerOverview;
