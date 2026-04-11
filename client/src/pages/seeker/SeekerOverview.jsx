import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications, getProfile } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiDocumentText, HiCheckCircle, HiClock, HiXCircle, HiBriefcase, HiStar, HiArrowRight, HiUser, HiCalendar, HiLocationMarker, HiTrendingUp } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const SeekerOverview = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyApplications().then(({ data }) => setApplications(data)).catch(() => {}),
      getProfile().then(({ data }) => setProfile(data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const pending = applications.filter(a => a.status === 'pending').length;
  const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
  const rejected = applications.filter(a => a.status === 'rejected').length;
  const accepted = applications.filter(a => a.status === 'accepted').length;

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completion = 0;

    // Bio (20%)
    if (profile.bio?.trim()) completion += 20;

    // Skills (20%) - at least 1 skill needed
    if (Array.isArray(profile.skills) && profile.skills.length > 0) completion += 20;

    // Education (20%) - at least 1 education entry
    if (Array.isArray(profile.education) && profile.education.length > 0) completion += 20;

    // Experience (20%) - at least 1 experience entry
    if (Array.isArray(profile.experience) && profile.experience.length > 0) completion += 20;

    // Contact Details (20%) - at least one contact method
    const hasContactInfo = profile.contactDetails?.phone?.trim() || profile.contactDetails?.address?.trim() || profile.contactDetails?.linkedin?.trim() || profile.contactDetails?.github?.trim();
    if (hasContactInfo) completion += 20;

    return completion;
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-12 mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-600 text-sm">Here's what's happening with your job search</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  <p className="text-sm text-gray-600 mt-2">Total Applied</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <HiDocumentText className="text-blue-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{shortlisted}</p>
                  <p className="text-sm text-gray-600 mt-2">Shortlist</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <HiCheckCircle className="text-green-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{pending}</p>
                  <p className="text-sm text-gray-600 mt-2">Pending</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <HiClock className="text-yellow-600 text-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{accepted}</p>
                  <p className="text-sm text-gray-600 mt-2">Accepted</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <HiStar className="text-emerald-600 text-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-8 mb-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Complete Your Profile</h3>
                <p className="text-sm text-gray-600 mb-5">Profiles with more details get 5x more job recommendations</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-linear-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">{profileCompletion}% Complete</p>
              </div>
              <Link
                to="/seeker/dashboard/profile"
                className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                Complete <HiArrowRight />
              </Link>
            </div>
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                  <p className="text-sm text-gray-600 mt-2">Track your job applications in real-time</p>
                </div>
                <Link to="/seeker/dashboard/applications" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                  View All <HiArrowRight />
                </Link>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiBriefcase className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No applications yet</p>
                <p className="text-gray-500 text-sm mb-4">Start exploring jobs and apply to positions that match your skills</p>
                <Link to="/jobs" className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="hover:bg-gray-50 transition-colors p-8">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{app.jobId?.title || 'Job removed'}</h3>
                        <p className="text-gray-600 text-sm mb-3">{app.jobId?.employerId?.name}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-gray-400" />
                            {app.jobId?.location || 'No location'}
                          </div>
                          <div className="flex items-center gap-1">
                            <HiCalendar className="text-gray-400" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                          app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Quick Action */}
          <div className="bg-linear-to-br from-emerald-600 to-teal-600 rounded-xl text-white p-8">
            <div className="mb-5">
              <HiTrendingUp className="text-2xl mb-2" />
              <h3 className="text-lg font-semibold mb-1">Keep searching</h3>
              <p className="text-emerald-100 text-sm">Update your profile and apply for more jobs</p>
            </div>
            <Link to="/jobs" className="block w-full py-2 px-4 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold text-center">
              Browse Jobs
            </Link>
          </div>

          {/* Application Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="font-semibold text-gray-900 mb-6">Application Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Pending Review</span>
                </div>
                <span className="font-semibold text-gray-900">{pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Shortlisted</span>
                </div>
                <span className="font-semibold text-gray-900">{shortlisted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Accepted</span>
                </div>
                <span className="font-semibold text-gray-900">{accepted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Rejected</span>
                </div>
                <span className="font-semibold text-gray-900">{rejected}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Update your profile to get more recommendations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Apply early for better chances</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                <span>Track your applications regularly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerOverview;
