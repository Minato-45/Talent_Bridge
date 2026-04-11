const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: Number,
    endYear: Number,
  }],
  experience: [{
    company: String,
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
  }],
  resumeUrl: {
    type: String,
    default: '',
  },
  contactDetails: {
    phone: String,
    address: String,
    linkedin: String,
    github: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);
