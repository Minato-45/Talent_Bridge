import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../../api/axios';
import { toast } from 'react-toastify';
import { HiBell, HiExclamation, HiCog, HiShieldCheck, HiTrash } from 'react-icons/hi';

const SeekerSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    jobRecommendations: true,
    applicationUpdates: true,
    weeklyDigest: false,
    instantNotifications: true,
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    allowMessages: true,
    showApplicationHistory: false,
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  // Handle notification changes (auto-save)
  const handleNotificationChange = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    saveNotificationSettings(updated);
  };

  // Handle privacy changes (auto-save)
  const handlePrivacyChange = (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    savePrivacySettings(updated);
  };

  // Auto-save notification settings
  const saveNotificationSettings = async (settings) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.success('Notification preferences updated');
    } catch (err) {
      toast.error('Failed to save preferences');
    }
  };

  // Auto-save privacy settings
  const savePrivacySettings = async (settings) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      toast.success('Privacy settings updated');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Email & Notifications Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <HiBell className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email & Notifications</h2>
            <p className="text-sm text-gray-600">Control how you receive updates about your account</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'emailNotifications',
              label: 'Email Notifications',
              desc: 'Receive email updates about your applications and profile',
            },
            {
              key: 'jobRecommendations',
              label: 'Job Recommendations',
              desc: 'Get personalized job recommendations based on your profile',
            },
            {
              key: 'applicationUpdates',
              label: 'Application Updates',
              desc: 'Recruiters\' responses and actions on your applications',
            },
            {
              key: 'instantNotifications',
              label: 'Instant Notifications',
              desc: 'Get notified immediately when recruiters engage with your profile',
            },
            {
              key: 'weeklyDigest',
              label: 'Weekly Digest',
              desc: 'Summary of job matches and platform updates every week',
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={() => handleNotificationChange(key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <HiShieldCheck className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
            <p className="text-sm text-gray-600">Control who can see your profile and information</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'profileVisible',
              label: 'Public Profile',
              desc: 'Allow recruiters to find and view your profile publicly',
            },
            {
              key: 'allowMessages',
              label: 'Direct Messages',
              desc: 'Allow recruiters to send you direct messages about opportunities',
            },
            {
              key: 'showApplicationHistory',
              label: 'Show Application History',
              desc: 'Recruiters can see your past applications and activity',
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                <input
                  type="checkbox"
                  checked={privacy[key]}
                  onChange={() => handlePrivacyChange(key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-3 rounded-lg">
            <HiExclamation className="text-red-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
            <p className="text-sm text-gray-600">Manage your account security and password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="bg-red-50 rounded-lg border border-red-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <HiTrash className="text-red-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
            <p className="text-sm text-red-600/70">Permanently delete your account</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Once you delete your account, there is no going back. Please be certain. All your data, applications, and profile will be permanently deleted.
        </p>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          <HiTrash /> Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <HiTrash className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Account?</h3>
              </div>

              <p className="text-gray-700 mb-2">
                This action <span className="font-semibold">cannot be undone</span>. All your data will be permanently deleted:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
                <li>Your profile and resume</li>
                <li>All job applications</li>
                <li>Application history</li>
                <li>Messages and notifications</li>
              </ul>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-semibold text-red-600">DELETE MY ACCOUNT</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type here..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerSettings;
