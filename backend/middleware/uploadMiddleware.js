const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('File being uploaded:', file.originalname);
    console.log('File mimetype:', file.mimetype);
    
    // Allow Excel files (.xlsx, .xls) and CSV files
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv', // .csv
      'application/csv'
    ];
    
    const filetypes = /xlsx|xls|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimes.includes(file.mimetype);

    console.log('Extension check:', extname);
    console.log('Mimetype check:', mimetype);

    if (mimetype || extname) {
      return cb(null, true);
    } else {
      console.log('File rejected - not an Excel/CSV file');
      cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;
