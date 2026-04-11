import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, applyToJob, getProfile } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { sampleJobs } from '../data/sampleJobs';
import {
  HiLocationMarker, HiClock, HiCurrencyDollar, HiCalendar,
  HiGlobe, HiMail, HiArrowLeft, HiCheckCircle, HiX,
} from 'react-icons/hi';

const jobTypeColors = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-yellow-100 text-yellow-700',
  'remote': 'bg-emerald-100 text-emerald-600',
  'contract': 'bg-orange-100 text-orange-700',
  'internship': 'bg-emerald-100 text-emerald-600',
};

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Check if it's a sample job (ID starts with 's')
        if (id?.startsWith('s')) {
          const sampleJob = sampleJobs.find(j => j._id === id);
          if (sampleJob) {
            setJob(sampleJob);
            setLoading(false);
            return;
          }
        }

        // Try to fetch from API
        const { data } = await getJob(id);
        setJob(data);
      } catch (err) {
        console.error('Failed to fetch job:', err);
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  // Fetch user profile when modal opens
  useEffect(() => {
    if (showApplyForm && user) {
      getProfile()
        .then(({ data }) => setUserProfile(data))
        .catch((err) => console.error('Failed to fetch profile:', err));
    }
  }, [showApplyForm, user]);

  const handleEditProfile = () => {
    setShowApplyForm(false);
    navigate('/seeker/dashboard/profile');
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    // Check if job deadline has passed
    if (job.deadline && new Date(job.deadline) < new Date()) {
      toast.error('This job posting has expired');
      return;
    }

    setApplying(true);
    try {
      // For sample jobs, simulate successful application
      if (job?._id?.startsWith('s')) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success('Application submitted successfully!');
      } else {
        // For real jobs, use actual API
        await applyToJob({ jobId: id, coverLetter });
        toast.success('Application submitted successfully!');
      }
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified';
    const fmt = (n) => {
      // Format as Indian currency with lakhs/crores
      if (n >= 1000000) {
        return `₹${(n / 1000000).toFixed(1)}Cr`;
      }
      return `₹${(n / 100000).toFixed(1)}L`;
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  const isDeadlineExpired = job?.deadline && new Date(job.deadline) < new Date();
  const daysUntilDeadline = job?.deadline ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  if (loading) return <LoadingSpinner size="lg" />;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/jobs')} className="flex items-center gap-1 text-gray-500 hover:text-emerald-600 mb-6 font-medium">
        <HiArrowLeft /> Back to Jobs
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-emerald-600 font-semibold text-lg mt-1">{job.company}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize self-start ${jobTypeColors[job.jobType] || 'bg-gray-100 text-gray-700'}`}>
              {job.jobType}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><HiLocationMarker /> {job.location}</span>
            <span className="flex items-center gap-1"><HiCurrencyDollar /> {formatSalary(job.salaryMin, job.salaryMax)}</span>
            <span className="flex items-center gap-1"><HiCalendar /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            {job.deadline && (
              <span className={`flex items-center gap-1 ${isDeadlineExpired ? 'text-red-600' : daysUntilDeadline <= 3 ? 'text-orange-600' : ''}`}>
                <HiClock /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                {daysUntilDeadline !== null && !isDeadlineExpired && daysUntilDeadline <= 3 && (
                  <span className="ml-2 text-xs font-semibold">(Closes in {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''})</span>
                )}
                {isDeadlineExpired && <span className="ml-2 text-xs font-semibold">(EXPIRED)</span>}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {job.responsibilities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {job.qualifications?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {job.qualifications.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}

          {/* Company Info */}
          {job.companyDescription && (
            <div className="bg-gray-50 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About {job.company}</h2>
              <p className="text-gray-600 text-sm">{job.companyDescription}</p>
              {job.companyWebsite && (
                <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-600 text-sm mt-2 hover:underline">
                  <HiGlobe /> Visit Website
                </a>
              )}
            </div>
          )}

          {/* Apply Section */}
          {user?.role === 'jobseeker' && (
            <div className="border-t pt-6">
              {isDeadlineExpired && (
                <div className="flex items-center gap-2 text-red-600 font-medium p-4 bg-red-50 rounded-lg">
                  <HiClock className="text-xl" /> This job posting has expired
                </div>
              )}
              {applied ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <HiCheckCircle className="text-xl" /> Application submitted!
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyForm(true)}
                  disabled={isDeadlineExpired}
                  className={`${isDeadlineExpired ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg`}
                >
                  Apply Now
                </button>
              )}
            </div>
          )}

          {!user && (
            <div className="border-t pt-6">
              <button
                onClick={() => navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } })}
                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-lg"
              >
                Sign In to Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Apply to {job.title}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{job.company}</p>
              </div>
              <button
                onClick={() => setShowApplyForm(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <HiX className="text-2xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Your Profile Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Your Profile</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Full Name</p>
                      <p className="text-gray-900 font-medium mt-1">{user?.fullName || user?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Email</p>
                      <p className="text-gray-900 font-medium mt-1">{user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Phone</p>
                      <p className="text-gray-900 font-medium mt-1">{userProfile?.contactDetails?.phone || user?.phone || user?.phoneNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Location</p>
                      <p className="text-gray-900 font-medium mt-1">{userProfile?.contactDetails?.address || user?.location || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-300">
                    <button 
                      onClick={handleEditProfile}
                      className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition-colors"
                    >
                      ✎ Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Details Summary */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Job Details</h4>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase">Position</p>
                      <p className="text-gray-900 font-semibold text-sm">{job.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-600 font-medium uppercase">Job Type</p>
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded mt-1 ${jobTypeColors[job.jobType] || 'bg-gray-100 text-gray-700'}`}>
                        {job.jobType}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200">
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase">Salary</p>
                      <p className="text-gray-900 text-sm">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase">Location</p>
                      <p className="text-gray-900 text-sm">{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Letter <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none text-sm"
                  placeholder="Tell the recruiter why you're interested in this role and what you can bring to the team..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {coverLetter.length}/2000 characters
                </p>
              </div>

              {/* Application Checklist */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Your Application Includes</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold">✓</span>
                    Your profile information
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold">✓</span>
                    Resume from your profile
                  </li>
                  {coverLetter && (
                    <li className="flex items-center gap-2 text-gray-700">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 font-bold">✓</span>
                      Your cover letter
                    </li>
                  )}
                </ul>
              </div>

              {/* Info Message */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                <p className="font-medium mb-1">💡 Tip</p>
                <p>A complete profile and personalized cover letter can increase your chances of getting selected.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowApplyForm(false)}
                className="flex-1 px-4 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying || isDeadlineExpired}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <span className="animate-spin">⏳</span> Submitting...
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
