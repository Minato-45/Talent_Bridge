const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');
const EmployerProfile = require('../models/EmployerProfile');

exports.createJobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['full-time', 'part-time', 'remote', 'contract', 'internship']).withMessage('Invalid job type'),
];

exports.getJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    // Keyword search
    if (req.query.keyword) {
      filter.$text = { $search: req.query.keyword };
    }

    // Filters
    if (req.query.jobType) {
      filter.jobType = req.query.jobType;
    }
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }
    if (req.query.salaryMin) {
      filter.salaryMax = { $gte: parseInt(req.query.salaryMin) };
    }
    if (req.query.salaryMax) {
      filter.salaryMin = { ...filter.salaryMin, $lte: parseInt(req.query.salaryMax) };
    }

    const sort = req.query.sort === 'salary' ? { salaryMax: -1 } : { createdAt: -1 };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate({
          path: 'employerId',
          select: 'name',
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(filter),
    ]);

    // Attach company names
    const jobIds = jobs.map(j => j.employerId?._id).filter(Boolean);
    const profiles = await EmployerProfile.find({ userId: { $in: jobIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.userId.toString()] = p; });

    const enrichedJobs = jobs.map(job => ({
      ...job,
      company: profileMap[job.employerId?._id?.toString()]?.companyName || 'Unknown Company',
      companyLogo: profileMap[job.employerId?._id?.toString()]?.logo || '',
    }));

    res.json({
      jobs: enrichedJobs,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employerId', 'name email')
      .lean();

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const profile = await EmployerProfile.findOne({ userId: job.employerId._id }).lean();
    job.company = profile?.companyName || 'Unknown Company';
    job.companyDescription = profile?.companyDescription || '';
    job.companyWebsite = profile?.website || '';

    res.json(job);
  } catch (error) {
    next(error);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const jobData = {
      ...req.body,
      employerId: req.user._id,
    };

    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const allowedFields = ['title', 'description', 'qualifications', 'responsibilities',
      'location', 'jobType', 'salaryMin', 'salaryMax', 'deadline', 'isActive'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    res.json(job);
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};
