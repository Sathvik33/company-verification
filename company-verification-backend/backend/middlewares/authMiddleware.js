const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Extract the token from the header (e.g., "Bearer [token]")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the secret key from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Use the user ID from the token to fetch the user's details from the database
      // This ensures the user still exists and attaches their info to the request.
      const userResult = await pool.query('SELECT id, email, full_name FROM users WHERE id = $1', [decoded.id]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      req.user = userResult.rows[0];

      // 4. Proceed to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is found in the header, deny access
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };