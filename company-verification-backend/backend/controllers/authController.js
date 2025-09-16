const { validationResult } = require('express-validator');
const pool = require('../config/db');
const generateToken = require('../utils/jwtHelper');
const { jwtDecode } = require('jwt-decode');

// --- Register a new user ---
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firebase_uid, email, full_name, gender, mobile_number, signup_type } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = await pool.query(
      `INSERT INTO users (firebase_uid, email, full_name, gender, mobile_number, signup_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, mobile_number, firebase_uid`,
      [firebase_uid, email, full_name, gender, mobile_number, signup_type || 'e']
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// --- Login an existing user ---
const loginUser = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID token is required.' });
  }

  try {
    const decodedToken = jwtDecode(idToken);
    const firebase_uid = decodedToken.user_id;

    const userResult = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [firebase_uid]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found in our database. Please register first.' });
    }

    const user = userResult.rows[0];
    const appToken = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token: appToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        mobileNumber: user.mobile_number,
        firebase_uid: user.firebase_uid,
        isMobileVerified: user.is_mobile_verified,
        isEmailVerified: user.is_email_verified,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// --- Update the logged-in user's profile ---
const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { full_name, mobile_number } = req.body;

  try {
    const updatedUser = await pool.query(
      `UPDATE users
       SET full_name = $1, mobile_number = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, email, full_name, mobile_number, firebase_uid`,
      [full_name, mobile_number, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: updatedUser.rows[0] });
  } catch (error) {
    console.error('Error during user profile update:', error);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
};