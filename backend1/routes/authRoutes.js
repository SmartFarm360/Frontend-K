const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const otpVerifiedCheck = require('../middleware/otpVerifiedMiddleware');
const { cropImageUpload, landDocumentUpload } = require('../middleware/backBlazeUpload');
const { register, login, logout, sendOTP, verifyOTP } = require('../controllers/authController');

// Register Route (with OTP check)
router.post('/register', otpVerifiedCheck, landDocumentUpload.single('landDocument'), register);

// Login Route
router.post('/login', login);

// Logout Route
router.post('/logout', authMiddleware, logout);

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
