const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../shared/input'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// 🔁 Wait for OCR result from shared/output
const waitForOCRResult = (filename) => {
  return new Promise((resolve, reject) => {
    const jsonName = filename.replace(/\.[^/.]+$/, '.json');
    const outputPath = path.join(__dirname, '../shared/output', jsonName);

    const interval = setInterval(() => {
      if (fs.existsSync(outputPath)) {
        const result = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
        clearInterval(interval);
        resolve(result);
      }
    }, 3000);

    // Timeout after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      reject('❌ Timeout waiting for OCR output');
    }, 30000);
  });
};

// 📥 POST route for file upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const walletAddress = req.body.walletAddress;

    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    console.log(`📩 Received file: ${file.filename}`);

    // ⏳ Wait for Python OCR to process and drop the output
    const ocrResult = await waitForOCRResult(file.filename);

    // Send back the result with hash and extracted data
    res.status(200).json({
      success: true,
      message: 'OCR processed successfully',
      ocrData: ocrResult.ocrData,
      documentHash: ocrResult.documentHash,
      walletAddress
    });

  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ success: false, message: 'Server error or OCR timeout' });
  }
});

module.exports = router;
