const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['recruiter'],
      default: 'recruiter',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    registrationOrder: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true, collection: 'recruiters' }
);

// Index for first-come-first-served order
recruiterSchema.index({ createdAt: 1 });
recruiterSchema.index({ registrationOrder: 1 });
recruiterSchema.index({ email: 1, isEmailVerified: 1 });
recruiterSchema.index({ passwordResetToken: 1, passwordResetExpires: 1 });

recruiterSchema.pre('save', async function (next) {
  // Auto-assign registration order
  if (!this.registrationOrder) {
    const lastRecruiter = await this.constructor.findOne({}, {}, { sort: { registrationOrder: -1 } });
    this.registrationOrder = lastRecruiter ? lastRecruiter.registrationOrder + 1 : 1;
  }
  
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

recruiterSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

recruiterSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

recruiterSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

recruiterSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return token;
};

module.exports = mongoose.model('Recruiter', recruiterSchema);
