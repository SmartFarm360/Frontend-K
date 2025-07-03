const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const authMiddleware = require('../middleware/authMiddleware');
const Farmer = require('../models/Farmer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { cropImageUpload, landDocumentUpload } = require('../middleware/s3Upload');
const { uploadImage, getImages } = require('../controllers/imageController');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Upload Crop Image
router.post('/upload', authMiddleware, cropImageUpload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const fileKey = `crop-images/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer, // Upload buffer directly
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    req.file = {
      ...req.file,
      key: fileKey,
      location: s3Url,
    };

    await uploadImage(req, res); // Save S3 URL in MongoDB via existing controller

  } catch (err) {
    console.error('S3 Upload error:', err);
    res.status(500).json({ message: 'Failed to upload image to S3' });
  }
});

// ✅ Upload Land Document
router.post('/upload-land-document', authMiddleware, landDocumentUpload.single('landDocument'), async (req, res) => {
  try {
    const file = req.file;
    const fileKey = `land-documents/${Date.now()}-${file.originalname}`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer, // Upload buffer directly
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    // Hash directly from buffer
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Update farmer record
    const updatedFarmer = await Farmer.findOneAndUpdate(
      { _id: req.user.id },
      { landDocumentUrl: s3Url, landDocumentHash: hash },
      { new: true }
    );

    if (!updatedFarmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.status(200).json({ message: 'Land document uploaded successfully', farmer: updatedFarmer });

  } catch (err) {
    console.error('Land Document Upload error:', err);
    res.status(500).json({ message: 'Failed to upload land document' });
  }
});

// Existing route to get all images
router.get('/', authMiddleware, getImages);

module.exports = router;
