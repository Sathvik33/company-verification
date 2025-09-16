const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser, updateUserProfile } = require('../controllers/authController');

// --- THIS IS THE CRITICAL FIX ---
// We need to import the 'protect' middleware before we can use it.
const { protect } = require('../middlewares/authMiddleware');
// --------------------------------

const { sanitizeInputs } = require('../middlewares/sanitizationMiddleware');

const router = express.Router();

// --- Registration and Login routes remain the same ---
router.post(
  '/register',
  sanitizeInputs,
  [
    body('firebase_uid', 'Firebase UID is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('full_name', 'Full name is required').not().isEmpty(),
  ],
  registerUser
);
router.post('/login', loginUser);
router.put('/profile', protect, sanitizeInputs, updateUserProfile);


module.exports = router;