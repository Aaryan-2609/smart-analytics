const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDashboardStats, getRecentCharts } = require('../controllers/dashboardController');

router.route('/stats').get(protect, getDashboardStats);
router.route('/recent-charts').get(protect, getRecentCharts);

module.exports = router;