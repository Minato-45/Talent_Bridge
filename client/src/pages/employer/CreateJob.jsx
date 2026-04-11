import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  location: z.string().min(1, 'Location is required'),
  jobType: z.enum(['full-time', 'part-time', 'remote', 'contract', 'internship']),
  salaryMin: z.string().optional().transform(v => v ? parseInt(v) : 0),
  salaryMax: z.string().optional().transform(v => v ? parseInt(v) : 0),
  deadline: z.string().optional(),
  qualifications: z.string().optional(),
  responsibilities: z.string().optional(),
});

const CreateJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { jobType: 'full-time' },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        qualifications: data.qualifications ? data.qualifications.split('\n').filter(Boolean) : [],
        responsibilities: data.responsibilities ? data.responsibilities.split('\n').filter(Boolean) : [],
      };
      await createJob(payload);
      toast.success('Job posted successfully!');
      navigate('/employer/dashboard/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
          <input {...register('title')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Senior React Developer" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea {...register('description')} rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Describe the role, team, and what success looks like..." />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input {...register('location')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. New York, NY" />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
            <select {...register('jobType')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($)</label>
            <input type="number" {...register('salaryMin')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 50000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary ($)</label>
            <input type="number" {...register('salaryMax')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. 80000" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
          <input type="date" {...register('deadline')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (one per line)</label>
          <textarea {...register('qualifications')} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Bachelor's degree in Computer Science&#10;3+ years of experience in React&#10;Strong communication skills" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
          <textarea {...register('responsibilities')} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Design and implement user interfaces&#10;Collaborate with product team&#10;Write clean, maintainable code" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 font-medium px-4">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
