import { useState, useEffect } from 'react';
import { getAdminJobs, deleteAdminJob } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiTrash, HiSearch } from 'react-icons/hi';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async (p = page, search = searchQuery) => {
    setLoading(true);
    try {
      const { data } = await getAdminJobs(p, search);
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    setPage(1);
    fetchJobs(1, searchQuery);
  }, [searchQuery]);

  useEffect(() => { 
    fetchJobs(page, searchQuery); 
  }, [page]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete job "${title}"? This cannot be undone.`)) return;
    try {
      await deleteAdminJob(id);
      toast.success('Job deleted');
      fetchJobs(page, searchQuery);
    } catch {
      toast.error('Failed to delete job');
    }
  };

  if (loading && jobs.length === 0) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Jobs</h1>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex">
        <HiSearch className="absolute text-gray-400 m-3 left-2" />
        <input 
          type="text"
          placeholder="Search by job title or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Recruiter</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Posted</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-50 truncate">{job.title}</td>
                  <td className="px-4 py-3 text-gray-600">{job.employerId?.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-600">{job.location}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {job.isActive ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{job.applicantCount || 0}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(job._id, job.title)} className="text-red-500 hover:text-red-700 p-1" title="Delete job">
                      <HiTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No jobs found</td></tr>
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

export default AdminJobs;
