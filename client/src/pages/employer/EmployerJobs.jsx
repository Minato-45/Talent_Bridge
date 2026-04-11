import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyJobs, deleteJob } from '../../api/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiPencil, HiTrash, HiUsers, HiEye, HiBriefcase, HiLocationMarker, HiCurrencyDollar, HiCalendar, HiCheckCircle, HiClock, HiPlus } from 'react-icons/hi';

const EmployerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchJobs = async () => {
    try {
      console.log('Fetching jobs for user:', user);
      const { data } = await getMyJobs();
      console.log('Jobs fetched:', data);
      setJobs(data);
    } catch (error) {
      console.error('Failed to load jobs:', error.response?.data || error.message);
      toast.error(`Failed to load jobs: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchJobs(); 
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job deleted successfully');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  if (loading) return <LoadingSpinner />;

  const filteredJobs = filterStatus === 'all' 
    ? jobs 
    : filterStatus === 'active'
    ? jobs.filter(j => !j.filled)
    : jobs.filter(j => j.filled);

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => !j.filled).length,
    filled: jobs.filter(j => j.filled).length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Post Job Button */}
      <div className="flex justify-end mb-8">
        <Link to="/employer/dashboard/create-job" className="flex items-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold">
          <HiPlus className="text-xl" /> Post Job
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div 
          className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'all' ? 'ring-2 ring-emerald-500' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600 mt-1">Total Jobs</p>
        </div>
        <div 
          className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'active' ? 'ring-2 ring-emerald-500' : ''}`}
          onClick={() => setFilterStatus('active')}
        >
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-sm text-gray-600 mt-1">Active</p>
        </div>
        <div 
          className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'filled' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilterStatus('filled')}
        >
          <p className="text-2xl font-bold text-blue-600">{stats.filled}</p>
          <p className="text-sm text-gray-600 mt-1">Filled</p>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiBriefcase className="text-gray-400 text-2xl" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No jobs found</p>
          <p className="text-gray-500 text-sm mb-4">
            {filterStatus === 'all' 
              ? "You haven't posted any jobs yet. Start recruiting!"
              : filterStatus === 'active'
              ? "No active job listings at the moment."
              : "No filled positions yet."}
          </p>
          <Link to="/employer/dashboard/create-job" className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job._id} className={`border rounded-xl p-6 hover:shadow-md transition-all ${!job.filled ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
                      <HiBriefcase className="text-white text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-3">
                        <div className="flex items-center gap-1">
                          <HiLocationMarker className="text-gray-400 shrink-0" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <HiCurrencyDollar className="text-gray-400 shrink-0" />
                          {job.salary ? `₹${job.salary.min?.toLocaleString()}-${job.salary.max?.toLocaleString()}` : 'Salary not specified'}
                        </div>
                        <div className="flex items-center gap-1">
                          <HiCalendar className="text-gray-400 shrink-0" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                    </div>
                  </div>
                </div>

                {/* Stats and Actions */}
                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                        !job.filled 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {!job.filled ? (
                          <><HiClock className="text-sm" /> Hiring</>
                        ) : (
                          <><HiCheckCircle className="text-sm" /> Filled</>
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="font-semibold text-gray-900">{job.applications?.length || 0}</div>
                      <div>Applications</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/employer/dashboard/jobs/${job._id}/applicants`}
                      className="p-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View Applicants"
                    >
                      <HiUsers className="text-lg" />
                    </Link>
                    <Link
                      to={`/employer/dashboard/jobs/${job._id}/edit`}
                      className="p-2 bg-white border border-yellow-200 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Edit Job"
                    >
                      <HiPencil className="text-lg" />
                    </Link>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="p-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Job"
                    >
                      <HiTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
