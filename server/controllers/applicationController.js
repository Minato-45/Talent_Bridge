const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const JobSeekerProfile = require('../models/JobSeekerProfile');

exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    const existingApplication = await Application.findOne({
      jobId,
      seekerId: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Get seeker's resume
    const profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    const resumeUrl = profile?.resumeUrl || '';

    const application = await Application.create({
      jobId,
      seekerId: req.user._id,
      resumeUrl,
      coverLetter: coverLetter || '',
    });

    // Update applicant count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    // Create notification for employer
    const notification = await Notification.create({
      userId: job.employerId,
      type: 'new_application',
      message: `New application received for "${job.title}"`,
      relatedId: application._id,
    });

    // Send real-time notification
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const employerSocketId = onlineUsers.get(job.employerId.toString());
    if (employerSocketId) {
      io.to(employerSocketId).emit('new_notification', notification);
    }

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

exports.getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('seekerId', 'name email')
      .sort({ appliedAt: -1 })
      .lean();

    // Attach seeker profiles
    const seekerIds = applications.map(a => a.seekerId?._id).filter(Boolean);
    const profiles = await JobSeekerProfile.find({ userId: { $in: seekerIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.userId.toString()] = p; });

    const enriched = applications.map(app => ({
      ...app,
      seekerProfile: profileMap[app.seekerId?._id?.toString()] || null,
    }));

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ seekerId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title location jobType salaryMin salaryMax employerId company createdAt',
        populate: { path: 'employerId', select: 'name' },
      })
      .sort({ appliedAt: -1 })
      .lean();

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    // Notify the job seeker
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    const notification = await Notification.create({
      userId: application.seekerId,
      type: 'status_change',
      message: `Your application for "${application.jobId.title}" has been ${statusText}`,
      relatedId: application._id,
    });

    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const seekerSocketId = onlineUsers.get(application.seekerId.toString());
    if (seekerSocketId) {
      io.to(seekerSocketId).emit('new_notification', notification);
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};
