const express = require('express');
const multer = require('multer');
const { uploadFileToDrive } = require('../utils/googleDrive');
const { protect } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const driveResponse = await uploadFileToDrive(req.file);
    
    // Optionally remove file from local storage after upload to Drive
    fs.unlinkSync(req.file.path);

    res.json(driveResponse);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
