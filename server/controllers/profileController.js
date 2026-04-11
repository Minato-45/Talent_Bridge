const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res, next) => {
  try {
    let profile;
    if (req.user.role === 'recruiter') {
      profile = await EmployerProfile.findOne({ userId: req.user._id });
    } else {
      profile = await JobSeekerProfile.findOne({ userId: req.user._id });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    let profile;

    if (req.user.role === 'recruiter') {
      const allowedFields = ['companyName', 'companyDescription', 'website', 'location', 'contactEmail'];
      const updates = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      profile = await EmployerProfile.findOneAndUpdate(
        { userId: req.user._id },
        updates,
        { new: true, runValidators: true }
      );
    } else {
      const allowedFields = ['bio', 'skills', 'education', 'experience', 'contactDetails'];
      const updates = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      profile = await JobSeekerProfile.findOneAndUpdate(
        { userId: req.user._id },
        updates,
        { new: true, runValidators: true }
      );
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { resumeUrl },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ resumeUrl, profile });
  } catch (error) {
    next(error);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

exports.markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Notification.deleteOne({ _id: req.params.id });
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

exports.clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    next(error);
  }
};
