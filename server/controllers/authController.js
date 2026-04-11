const { body, validationResult } = require('express-validator');
const JobSeeker = require('../models/JobSeeker');
const Recruiter = require('../models/Recruiter');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');

const validateRequest = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    return false;
  }
  return true;
};

// Strong password validation
const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage('Email is too long'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .custom(isStrongPassword).withMessage('Password must contain: 8+ chars, uppercase, lowercase, number, special char (!@#$%^&*)'),
  
  body('role')
    .isIn(['jobseeker', 'recruiter']).withMessage('Role must be jobseeker or recruiter'),
  
  body('companyName')
    .if(body('role').equals('recruiter'))
    .trim()
    .notEmpty().withMessage('Company name is required for recruiters')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2-100 characters'),
];

exports.loginValidation = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  body('role')
    .isIn(['jobseeker', 'recruiter']).withMessage('Valid role is required'),
];

exports.register = async (req, res, next) => {
  try {
    if (!validateRequest(req, res)) return;

    const { name, email, password, role, companyName } = req.body;

    // Check if email exists in either collection
    let existingJobSeeker = null;
    let existingRecruiter = null;
    
    if (role === 'jobseeker') {
      existingJobSeeker = await JobSeeker.findOne({ email });
      if (existingJobSeeker) {
        // Don't reveal if email exists (security best practice)
        return res.status(400).json({ message: 'This email is already registered. Please log in or use a different email.' });
      }
    } else if (role === 'recruiter') {
      existingRecruiter = await Recruiter.findOne({ email });
      if (existingRecruiter) {
        return res.status(400).json({ message: 'This email is already registered. Please log in or use a different email.' });
      }
    }

    let user;
    if (role === 'jobseeker') {
      user = await JobSeeker.create({ name, email, password, role });
      await JobSeekerProfile.create({ userId: user._id });
    } else {
      user = await Recruiter.create({ name, email, password, role });
      await EmployerProfile.create({ userId: user._id, companyName: companyName || name });
    }

    const token = user.generateToken();

    // Only send non-sensitive user data to frontend
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // Don't expose internal error details to client
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'This email is already registered. Please try another email.' });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    if (!validateRequest(req, res)) return;

    const { email, password, role } = req.body;

    // Find user in the specified role's collection
    let user;
    if (role === 'jobseeker') {
      user = await JobSeeker.findOne({ email }).select('+password');
    } else if (role === 'recruiter') {
      user = await Recruiter.findOne({ email }).select('+password');
    }

    if (!user) {
      // Generic error message - don't reveal if email exists
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Don't reveal specific error (avoid timing attacks)
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = user.generateToken();

    // Only send non-sensitive user data
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // Try to find in both collections
    let user = await JobSeeker.findById(req.user._id);
    if (!user) {
      user = await Recruiter.findById(req.user._id);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Try to find in both collections
    let user = await JobSeeker.findOne({ email });
    if (!user) {
      user = await Recruiter.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    // TODO: Send email with resetUrl
    // For now, just return the token for testing
    res.json({
      message: 'Password reset link sent to email',
      resetToken, // Remove in production, use email instead
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Try to find in both collections
    let user = await JobSeeker.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await Recruiter.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Try to find in both collections
    let user = await JobSeeker.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await Recruiter.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Try to find in both collections
    let user = await JobSeeker.findOne({ email });
    if (!user) {
      user = await Recruiter.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    
    // TODO: Send email with verifyUrl
    res.json({
      message: 'Verification email sent',
      verificationToken, // Remove in production, use email instead
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine user role and delete accordingly
    if (user.role === 'jobseeker') {
      // Delete all applications created by this seeker
      await Application.deleteMany({ seekerId: userId });

      // Delete JobSeekerProfile
      await JobSeekerProfile.deleteOne({ userId });

      // Delete JobSeeker record
      await JobSeeker.deleteOne({ userId });
    } else if (user.role === 'recruiter') {
      // Delete all jobs created by this recruiter
      const jobs = await Job.find({ recruiterId: userId });
      const jobIds = jobs.map(job => job._id);

      // Delete all applications for jobs created by this recruiter
      if (jobIds.length > 0) {
        await Application.deleteMany({ jobId: { $in: jobIds } });
      }

      // Delete all jobs created by this recruiter
      await Job.deleteMany({ recruiterId: userId });

      // Delete EmployerProfile
      await EmployerProfile.deleteOne({ userId });

      // Delete Recruiter record
      await Recruiter.deleteOne({ userId });
    }

    // Delete the User document
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};
