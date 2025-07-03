// models/Otp.js
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailOrPhone: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // 5 min expiry
});

module.exports = mongoose.model("Otp", otpSchema);
