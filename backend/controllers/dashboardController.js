const File = require('../models/FileModel');
const Chart = require('../models/ChartModel');
const User = require('../models/UserModel');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's file count
    const totalUploads = await File.countDocuments({ user: userId });
    
    // Get user's chart count
    const chartsCreated = await Chart.countDocuments({ user: userId });
    
    // Get last upload date
    const lastUpload = await File.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select('createdAt');
    
    // Get recent uploads (last 5)
    const recentUploads = await File.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName createdAt size');
    
    // Calculate total storage used (in MB)
    const files = await File.find({ user: userId }).select('size');
    const totalStorage = files.reduce((total, file) => total + (file.size || 0), 0);
    const storageInMB = (totalStorage / (1024 * 1024)).toFixed(2);
    
    res.json({
      success: true,
      data: {
        totalUploads,
        chartsCreated,
        lastUpload: lastUpload ? lastUpload.createdAt : null,
        storageUsed: `${storageInMB} MB`,
        recentUploads: recentUploads.map(file => ({
          name: file.originalName,
          date: file.createdAt,
          size: file.size
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(400).json({ message: error.message });
  }
};

const getRecentCharts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const recentCharts = await Chart.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('fileId', 'originalName')
      .select('chartType xAxis yAxis createdAt fileName');
    
    res.json({
      success: true,
      data: recentCharts
    });
  } catch (error) {
    console.error('Error fetching recent charts:', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getRecentCharts };