const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateInsights } = require('../controllers/aiController');

router.route('/insights/:fileId')
  .get(protect, generateInsights)
  .post(protect, generateInsights);

module.exports = router;