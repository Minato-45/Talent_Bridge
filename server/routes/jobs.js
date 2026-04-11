const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs, createJobValidation } = require('../controllers/jobController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/my', auth, authorize('recruiter'), getMyJobs);
router.get('/:id', getJob);
router.post('/', auth, authorize('recruiter'), createJobValidation, createJob);
router.put('/:id', auth, authorize('recruiter'), updateJob);
router.delete('/:id', auth, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
