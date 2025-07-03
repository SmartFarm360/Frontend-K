const multer = require('multer');

// ✅ Memory storage (no local storage at all)
const storage = multer.memoryStorage();

// ✅ Crop image upload
const cropImageUpload = multer({
  storage: storage,
});

// ✅ Land document upload (PDF only)
const landDocumentUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

module.exports = { cropImageUpload, landDocumentUpload };
