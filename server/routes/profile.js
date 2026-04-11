const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  getNotifications,
  markNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} = require('../controllers/profileController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.post('/resume', auth, authorize('jobseeker'), upload.single('resume'), uploadResume);
router.get('/notifications', auth, getNotifications);
router.put('/notifications/read', auth, markNotificationsRead);
router.delete('/notifications/:id', auth, deleteNotification);
router.delete('/notifications', auth, clearAllNotifications);

module.exports = router;
