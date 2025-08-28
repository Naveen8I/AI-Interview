
const express = require('express');
const router  = express.Router();

const {
  generateQuestion,
  submitAnswer,
  getHistory,
  getPerformanceBySession,
} = require('../controllers/questionController');

const protect = require('../middleware/authMiddleware'); // ✅ Middleware to extract user from token

// ✅ Protect all routes that need user info
router.post('/generate', protect, generateQuestion);
router.post('/submit', protect, submitAnswer);
router.get('/history', protect, getHistory);
router.get('/performance-chart', protect, getPerformanceBySession);

module.exports = router;
