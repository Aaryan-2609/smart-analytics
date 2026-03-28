const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  clearStorage,
  deleteUser,
  updateUserRole
} = require('../controllers/adminController');

// Test route first
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes working' });
});

router.route('/stats').get(protect, admin, getAdminStats);
router.route('/clear-storage').delete(protect, admin, clearStorage);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/users/:id/role').patch(protect, admin, updateUserRole);

module.exports = router;
