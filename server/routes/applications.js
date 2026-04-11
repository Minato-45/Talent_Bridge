const express = require('express');
const router = express.Router();
const {
  applyToJob,
  getJobApplicants,
  getMyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, authorize('jobseeker'), applyToJob);
router.get('/my', auth, authorize('jobseeker'), getMyApplications);
router.get('/job/:jobId', auth, authorize('recruiter'), getJobApplicants);
router.put('/:id/status', auth, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
