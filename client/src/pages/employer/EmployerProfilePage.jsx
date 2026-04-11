import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

const EmployerProfilePage = () => {
  const [_profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    companyDescription: '',
    website: '',
    location: '',
    contactEmail: '',
  });

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setProfile(data);
        setForm({
          companyName: data.companyName || '',
          companyDescription: data.companyDescription || '',
          website: data.website || '',
          location: data.location || '',
          contactEmail: data.contactEmail || '',
        });
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        toast.error('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      setProfile(data);
      toast.success('Profile updated!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.companyDescription} onChange={e => setForm({ ...form, companyDescription: e.target.value })} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default EmployerProfilePage;
