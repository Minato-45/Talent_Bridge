const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  qualifications: {
    type: [String],
    default: [],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'contract', 'internship'],
    required: [true, 'Job type is required'],
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    default: 'mid',
  },
  remoteWorkPolicy: {
    type: String,
    enum: ['on-site', 'hybrid', 'remote'],
    default: 'on-site',
  },
  benefits: [{
    type: String,
    enum: ['health-insurance', '401k', 'dental', 'vision', 'stock-options', 'flexible-hours', 'free-lunch', 'gym-membership', 'home-office', 'paid-leave']
  }],
  requiredSkills: {
    type: [String],
    default: [],
  },
  salaryMin: {
    type: Number,
    default: 0,
  },
  salaryMax: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicantCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.index({ title: 'text', description: 'text', location: 'text' });
jobSchema.index({ jobType: 1, isActive: 1, createdAt: -1 });
jobSchema.index({ employerId: 1, isActive: 1 });
jobSchema.index({ experienceLevel: 1, remoteWorkPolicy: 1 });
jobSchema.index({ salaryMin: 1, salaryMax: 1 });
jobSchema.index({ isActive: 1, deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);
