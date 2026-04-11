import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobApplicants, updateApplicationStatus } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiArrowLeft, HiDownload, HiMail } from 'react-icons/hi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobApplicants(jobId)
      .then(({ data }) => setApplicants(data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplicants(applicants.map(a =>
        a._id === appId ? { ...a, status } : a
      ));
      toast.success(`Application ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-emerald-600 mb-4 font-medium">
        <HiArrowLeft /> Back
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Applicants ({applicants.length})</h1>

      {applicants.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No applications received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{app.seekerId?.name || 'Unknown'}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <HiMail /> {app.seekerId?.email}
                  </p>
                  {app.seekerProfile?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {app.seekerProfile.skills.map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{skill}</span>
                      ))}
                    </div>
                  )}
                  {app.coverLetter && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{app.coverLetter}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline">
                      <HiDownload /> View Resume
                    </a>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(app._id, 'shortlisted')}
                      disabled={app.status === 'shortlisted'}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
                    >
                      Shortlist
                    </button>
                    <button
                      onClick={() => handleStatusChange(app._id, 'rejected')}
                      disabled={app.status === 'rejected'}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                    >
                      Reject
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

export default Applicants;
