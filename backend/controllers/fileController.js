const File = require('../models/FileModel');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadFile = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('User:', req.user);
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const file = new File({
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      user: req.user._id
    });

    await file.save();
    console.log('File saved:', file);

    res.json({ 
      message: 'File uploaded successfully',
      fileId: file._id,
      fileName: file.originalName,
      success: true
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id, deleted: false });
    res.json(files);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Mark as deleted instead of actually deleting
    file.deleted = true;
    await file.save();
    
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ _id: id, user: req.user._id, deleted: false });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const absolutePath = path.isAbsolute(file.path)
      ? file.path
      : path.join(__dirname, '..', file.path);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(absolutePath, file.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
};

module.exports = { uploadFile, getUserFiles, getFileById, deleteFile, downloadFile };
