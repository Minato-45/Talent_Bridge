const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllJobs, deleteJob } = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
