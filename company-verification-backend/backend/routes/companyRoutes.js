const express = require('express');
const { 
  createCompanyProfile, 
  getCompanyProfiles, // 1. Import the correct plural function name
  updateCompanyProfile,
  deleteCompanyProfile
} = require('../controllers/companyController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// 2. Use the correct function for the GET route
router.route('/profiles')
  .get(protect, getCompanyProfiles);
  
router.route('/register')
  .post(protect, createCompanyProfile);

// Routes to update or delete a SPECIFIC profile by its ID
router.route('/profile/:id')
  .put(protect, updateCompanyProfile)
  .delete(protect, deleteCompanyProfile);

module.exports = router;

