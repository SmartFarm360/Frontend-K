const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { cropImageUpload, landDocumentUpload } = require('../middleware/s3Upload');
const { register, login, logout } = require('../controllers/authController');

// Register: Accept landDocument if farmer uploads it, but won't crash if missing
router.post('/register', landDocumentUpload.single('landDocument'), register);

// Login: Open to all roles
router.post('/login', login);

// Logout: Needs a valid token (auth middleware checks this)
router.post('/logout', authMiddleware, logout);

module.exports = router;
