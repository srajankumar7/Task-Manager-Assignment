const express = require('express');
const { register, login, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', register);
router.post('/register', register); // Alternative route
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/password', protect, changePassword); // ← This was missing!

module.exports = router;