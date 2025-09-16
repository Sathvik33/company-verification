const sanitizeHtml = require('sanitize-html');

// This middleware iterates over the request body and sanitizes every string value.
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Sanitize the string, allowing only basic text and no HTML tags.
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
  }
  next(); // Proceed to the next middleware or controller
};

module.exports = { sanitizeInputs };
