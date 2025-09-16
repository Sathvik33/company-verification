const pool = require('../config/db');

// @desc    Create a new company profile
// @route   POST /api/company/register
// @access  Private
const createCompanyProfile = async (req, res) => {
  // --- NEW DIAGNOSTIC LOGS ---
  console.log('--- BACKEND: Received request to create company profile ---');
  console.log('User making request:', req.user); // Let's see if the user object is attached correctly
  console.log('Data received from frontend form:', req.body); // Let's see the exact data being sent
  // ---------------------------

  // This check ensures the middleware attached the user correctly
  if (!req.user || !req.user.id) {
      console.error('CRITICAL ERROR: req.user.id is missing. The auth middleware might have a problem.');
      return res.status(500).json({ message: 'Server error: Could not identify the user.' });
  }

  const owner_id = req.user.id;
  const {
    company_name,
    address,
    city,
    state,
    country,
    zip_code,
    logo_url,
    banner_url,
  } = req.body;

  try {
    console.log(`Attempting to INSERT into database for owner_id: ${owner_id}`);
    const newProfile = await pool.query(
      `INSERT INTO company_profile (owner_id, company_name, address, city, state, country, zip_code, logo_url, banner_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [owner_id, company_name, address, city, state, country, zip_code, logo_url, banner_url]
    );

    console.log('SUCCESS: Database insert was successful.');
    res.status(201).json(newProfile.rows[0]);
  } catch (error) {
    // This is the most important log. If the database fails, this will print the reason.
    console.error('--- DATABASE ERROR during profile creation ---', error);
    res.status(500).json({ message: 'Server error while creating company profile.' });
  }
};

// --- GET, UPDATE, and DELETE functions remain the same ---

const getCompanyProfiles = async (req, res) => {
  try {
    const profiles = await pool.query('SELECT * FROM company_profile WHERE owner_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(profiles.rows);
  } catch (error) {
    console.error('Error fetching company profiles:', error);
    res.status(500).json({ message: 'Server error while fetching company profiles.' });
  }
};

const updateCompanyProfile = async (req, res) => {
  const owner_id = req.user.id;
  const profile_id = req.params.id;
  const {
    company_name,
    address,
    city,
    state,
    country,
    zip_code,
    logo_url,
    banner_url,
  } = req.body;

  try {
    const updatedProfile = await pool.query(
      `UPDATE company_profile 
       SET company_name = $1, address = $2, city = $3, state = $4, country = $5, zip_code = $6, logo_url = $7, banner_url = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND owner_id = $10 RETURNING *`,
      [company_name, address, city, state, country, zip_code, logo_url, banner_url, profile_id, owner_id]
    );

    if (updatedProfile.rows.length === 0) {
      return res.status(404).json({ message: 'Company profile not found or user not authorized.' });
    }

    res.json(updatedProfile.rows[0]);
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error while updating company profile.' });
  }
};

const deleteCompanyProfile = async (req, res) => {
    const owner_id = req.user.id;
    const profile_id = req.params.id;

    try {
        const deleteResult = await pool.query(
            'DELETE FROM company_profile WHERE id = $1 AND owner_id = $2',
            [profile_id, owner_id]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Profile not found or user not authorized.' });
        }

        res.json({ message: 'Company profile deleted successfully.' });
    } catch (error) {
        console.error('Error deleting company profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  createCompanyProfile,
  getCompanyProfiles,
  updateCompanyProfile,
  deleteCompanyProfile,
};

