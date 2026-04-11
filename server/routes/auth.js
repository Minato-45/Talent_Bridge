const express = require('express');
const router = express.Router();
const { register, login, getMe, registerValidation, loginValidation, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail, deleteAccount } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);
router.delete('/delete-account', auth, deleteAccount);

module.exports = router;
