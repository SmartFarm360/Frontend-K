const fs = require('fs');
const exifr = require('exifr'); 
const Image = require('../models/Image');

const uploadImage = async (req, res) => {
  try {
    const { key, location } = req.file;

    if (!key || !location) {
      return res.status(400).json({ message: 'S3 metadata missing from req.file' });
    }

    // Path to the temporarily saved file (still on disk at this point)
    const localFilePath = `uploads/${req.file.filename}`;

    // Extract GPS metadata from the local image file
    let gpsData = {};
    try {
      gpsData = await exifr.gps(localFilePath);
    } catch (gpsError) {
      console.warn('GPS extraction failed:', gpsError.message);
    }

    const image = new Image({
      user: req.user.id,
      filename: key,
      imageUrl: location,
      cropType: req.body.cropType,
      location: req.body.location,
      gps: {
        latitude: gpsData?.latitude || null,
        longitude: gpsData?.longitude || null,
        altitude: gpsData?.altitude || null,
      },
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploaded and saved to MongoDB with GPS',
      image,
    });
  } catch (error) {
    console.error('MongoDB save error:', error);
    res.status(500).json({ message: 'Server error during image save' });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.id });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching images' });
  }
};

module.exports = { uploadImage, getImages };
