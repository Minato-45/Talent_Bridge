const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'rejected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
