// Backend API endpoint (Express.js + MongoDB example)
// Add this to your auth routes or create a separate location route

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// GET farmer location endpoint
router.get('/farmer-location', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT payload contains user id
    
    // Find user by ID and ensure they are a farmer
    const farmer = await User.findById(userId);
    
    if (!farmer) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (farmer.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied. Only farmers can access this endpoint.' });
    }
    
    // Return the farmer's location data
    const locationData = {
      latitude: farmer.latitude,
      longitude: farmer.longitude,
      location: farmer.farm_location || farmer.location,
      landSize: farmer.landSize,
      cropType: farmer.cropType
    };
    
    // Check if location data exists
    if (!locationData.latitude || !locationData.longitude) {
      return res.status(404).json({ message: 'No location data found for this farmer' });
    }
    
    res.json(locationData);
  } catch (error) {
    console.error('Error fetching farmer location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT endpoint to update farmer location (optional)
router.put('/farmer-location', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, location } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const farmer = await User.findById(userId);
    
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update farmer location
    farmer.latitude = latitude;
    farmer.longitude = longitude;
    if (location) farmer.farm_location = location;
    
    await farmer.save();
    
    res.json({ message: 'Location updated successfully', location: farmer.farm_location });
  } catch (error) {
    console.error('Error updating farmer location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;











// ===== User Model Schema (MongoDB/Mongoose example) =====
// Make sure your User model includes these fields:

/*
// const userSchema = new mongoose.Schema(
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin', 'drone controller'], required: true },
  
  // Farmer-specific fields
  farm_location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  landSize: { type: String },
  cropType: { type: String },
  experience: { type: Number },
  
  // Drone controller fields
  licenseId: { type: String },
  baseLocation: { type: String },
  availableDrones: { type: Number },
  flightExperience: { type: Number },
  
  createdAt: { type: Date, default: Date.now }
});
*/