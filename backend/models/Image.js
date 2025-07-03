const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,          
    required: true,
  },
  cropType: {
    type: String,
    default:""
  },
  imageUrl: {
    type: String, // optional if using Cloudinary or S3
  },
  gps: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    altitude: {
      type: Number,
    }
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', imageSchema);
