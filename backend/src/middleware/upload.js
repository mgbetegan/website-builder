const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/templates');
fs.ensureDirSync(uploadDir);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'template-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only .docx files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      path.extname(file.originalname).toLowerCase() === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Only .docx files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

module.exports = upload;
