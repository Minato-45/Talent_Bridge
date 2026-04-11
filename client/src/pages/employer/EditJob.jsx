import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { getJob, updateJob } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';

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
  isActive: z.boolean().optional(),
});

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await getJob(id);
        
        // Check if current user is the job owner
        if (data.employerId !== user?._id && data.employerId?._id !== user?._id) {
          toast.error('You do not have permission to edit this job');
          navigate('/employer/dashboard/jobs');
          return;
        }
        
        setJob(data);
        reset({
          title: data.title,
          description: data.description,
          location: data.location,
          jobType: data.jobType,
          salaryMin: data.salaryMin?.toString() || '',
          salaryMax: data.salaryMax?.toString() || '',
          deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '',
          qualifications: data.qualifications?.join('\n') || '',
          responsibilities: data.responsibilities?.join('\n') || '',
          isActive: data.isActive,
        });
      } catch {
        toast.error('Job not found');
        navigate('/employer/dashboard/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        qualifications: data.qualifications ? data.qualifications.split('\n').filter(Boolean) : [],
        responsibilities: data.responsibilities ? data.responsibilities.split('\n').filter(Boolean) : [],
      };
      await updateJob(id, payload);
      toast.success('Job updated!');
      navigate('/employer/dashboard/jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return null;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
          <input {...register('title')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea {...register('description')} rows={6} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input {...register('location')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
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
            <input type="number" {...register('salaryMin')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary ($)</label>
            <input type="number" {...register('salaryMax')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
          <input type="date" {...register('deadline')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (one per line)</label>
          <textarea {...register('qualifications')} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
          <textarea {...register('responsibilities')} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('isActive')} id="isActive" className="rounded border-gray-300" />
          <label htmlFor="isActive" className="text-sm text-gray-700">Job is active and accepting applications</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 font-medium px-4">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
