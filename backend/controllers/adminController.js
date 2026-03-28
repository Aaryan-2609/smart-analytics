const User = require('../models/UserModel');
const File = require('../models/FileModel');
const Chart = require('../models/ChartModel');

// Simple test function first
const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalFiles, totalCharts, files, users] = await Promise.all([
      User.countDocuments(),
      File.countDocuments({ deleted: false }),
      Chart.countDocuments(),
      File.find({}).select('size deleted shared user'),
      User.find({}).select('name email role createdAt')
    ]);

    const totalStorageBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const storageInMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);
    const deletedFiles = files.filter(f => f.deleted).length;
    const sharedFiles = files.filter(f => f.shared).length;

    // uploads per user
    const uploadsByUserId = files.reduce((acc, f) => {
      const key = String(f.user);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const userRows = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      uploads: uploadsByUserId[String(u._id)] || 0,
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalFiles,
        totalCharts,
        storageUsed: `${storageInMB} MB`,
        users: userRows,
        summary: {
          sharedFiles,
          deletedFiles,
          activeUsers: users.length // simple placeholder
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch admin stats',
      error: error.message 
    });
  }
};

const clearStorage = async (req, res) => {
  try {
    // Soft-delete all files
    await File.updateMany({}, { $set: { deleted: true } });
    res.json({ success: true, message: 'Storage cleared successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to clear storage'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Promise.all([
      User.findByIdAndDelete(id),
      File.updateMany({ user: id }, { $set: { deleted: true } }),
      Chart.deleteMany({ user: id })
    ]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user'
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['Admin', 'User'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    await User.findByIdAndUpdate(id, { role });
    res.json({ success: true, message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user role'
    });
  }
};

module.exports = {
  getAdminStats,
  clearStorage,
  deleteUser,
  updateUserRole
};

