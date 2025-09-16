const express = require("express");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// GET /api/dashboard (protected)
router.get("/", protect, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.email}!`,
    user: req.user,
  });
});

module.exports = router;
