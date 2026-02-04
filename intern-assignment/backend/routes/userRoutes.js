const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/v1/me
router.get('/me', protect, getProfile);

// @route   PUT /api/v1/me
router.put('/me', protect, updateProfile);

module.exports = router;
