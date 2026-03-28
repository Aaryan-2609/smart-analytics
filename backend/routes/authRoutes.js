const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  sendOTP, 
  verifyOTPAndResetPassword, 
  resendOTP 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.post('/forgot-password', sendOTP);
router.post('/verify-otp', verifyOTPAndResetPassword);
router.post('/resend-otp', resendOTP);

module.exports = router;
