const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile, getUserFiles, getFileById, deleteFile, downloadFile } = require('../controllers/fileController');

// File upload route with middleware
router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, getUserFiles);
router.get('/:id', protect, getFileById);
router.delete('/:id', protect, deleteFile);
router.get('/:id/download', protect, downloadFile);

module.exports = router;
