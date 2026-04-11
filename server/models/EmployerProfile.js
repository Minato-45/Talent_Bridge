const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters'],
  },
  companyDescription: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  contactEmail: {
    type: String,
    default: '',
  },
  logo: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);
