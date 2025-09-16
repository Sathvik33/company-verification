const jwt = require('jsonwebtoken');

// This function creates a signed JWT using your secret key.
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

// This line makes the function available to other files.
module.exports = generateToken;

