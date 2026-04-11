import { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile, uploadResume } from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiUpload, HiDocumentText, HiPlus, HiTrash } from 'react-icons/hi';

const SeekerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    bio: '',
    skills: [],
    education: [],
    experience: [],
    contactDetails: { phone: '', address: '', linkedin: '', github: '' },
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        setProfile(data);
        setForm({
          bio: data.bio || '',
          skills: data.skills || [],
          education: data.education || [],
          experience: data.experience || [],
          contactDetails: {
            phone: data.contactDetails?.phone || '',
            address: data.contactDetails?.address || '',
            linkedin: data.contactDetails?.linkedin || '',
            github: data.contactDetails?.github || '',
          },
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
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await uploadResume(formData);
      setProfile({ ...profile, resumeUrl: data.resumeUrl });
      toast.success('Resume uploaded!');
    } catch {
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { institution: '', degree: '', field: '', startYear: '', endYear: '' }],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...form.education];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, education: updated });
  };

  const removeEducation = (index) => {
    setForm({ ...form, education: form.education.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { company: '', title: '', description: '', startDate: '', endDate: '', current: false }],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...form.experience];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, experience: updated });
  };

  const removeExperience = (index) => {
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl">
      {/* Resume Upload */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Resume</h2>
        {profile?.resumeUrl ? (
          <div className="flex items-center gap-3">
            <HiDocumentText className="text-red-500 text-xl" />
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-sm">
              View current resume
            </a>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No resume uploaded</p>
        )}
        <div className="mt-3">
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
          >
            <HiUpload /> {uploading ? 'Uploading...' : 'Upload Resume (PDF, max 5MB)'}
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={1000} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Tell recruiters about yourself..." />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.skills.map((skill, i) => (
              <span key={i} className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                {skill}
                <button type="button" onClick={() => removeSkill(i)} className="text-emerald-500 hover:text-emerald-600">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Add a skill" />
            <button type="button" onClick={addSkill} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200">Add</button>
          </div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Education</label>
            <button type="button" onClick={addEducation} className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"><HiPlus /> Add</button>
          </div>
          {form.education.map((edu, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Education #{i + 1}</span>
                <button type="button" onClick={() => removeEducation(i)} className="text-red-500 hover:text-red-700"><HiTrash /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={edu.institution || ''} onChange={e => updateEducation(i, 'institution', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Institution" />
                <input value={edu.degree || ''} onChange={e => updateEducation(i, 'degree', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Degree" />
                <input value={edu.field || ''} onChange={e => updateEducation(i, 'field', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Field of Study" />
                <div className="flex gap-2">
                  <input type="number" value={edu.startYear || ''} onChange={e => updateEducation(i, 'startYear', e.target.value)} className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Start Year" />
                  <input type="number" value={edu.endYear || ''} onChange={e => updateEducation(i, 'endYear', e.target.value)} className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="End Year" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Experience</label>
            <button type="button" onClick={addExperience} className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1"><HiPlus /> Add</button>
          </div>
          {form.experience.map((exp, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Experience #{i + 1}</span>
                <button type="button" onClick={() => removeExperience(i)} className="text-red-500 hover:text-red-700"><HiTrash /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={exp.company || ''} onChange={e => updateExperience(i, 'company', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Company" />
                <input value={exp.title || ''} onChange={e => updateExperience(i, 'title', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Job Title" />
              </div>
              <textarea value={exp.description || ''} onChange={e => updateExperience(i, 'description', e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Description" />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={exp.current || false} onChange={e => updateExperience(i, 'current', e.target.checked)} id={`current-${i}`} className="rounded border-gray-300" />
                <label htmlFor={`current-${i}`} className="text-sm text-gray-600">Currently working here</label>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Details */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Contact Details</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.contactDetails.phone} onChange={e => setForm({ ...form, contactDetails: { ...form.contactDetails, phone: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Phone" />
            <input value={form.contactDetails.address} onChange={e => setForm({ ...form, contactDetails: { ...form.contactDetails, address: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Address" />
            <input value={form.contactDetails.linkedin} onChange={e => setForm({ ...form, contactDetails: { ...form.contactDetails, linkedin: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="LinkedIn URL" />
            <input value={form.contactDetails.github} onChange={e => setForm({ ...form, contactDetails: { ...form.contactDetails, github: e.target.value } })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="GitHub URL" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default SeekerProfilePage;
