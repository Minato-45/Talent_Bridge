const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, activeJobs, usersByRole] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ isActive: true }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    ]);

    const roleStats = {};
    usersByRole.forEach(r => { roleStats[r._id] = r.count; });

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      totalSeekers: roleStats.jobseeker || 0,
      totalEmployers: roleStats.employer || 0,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    res.json({ users, page, totalPages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('employerId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, page, totalPages: Math.ceil(total / limit), total });
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
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};
