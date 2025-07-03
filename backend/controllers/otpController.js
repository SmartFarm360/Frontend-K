// controllers/otpController.js
const Otp = require("../models/otp");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// SEND OTP (Email or Phone)
exports.sendOtp = async (req, res) => {
  const { email, phone } = req.body;
  const target = email || phone;

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({ emailOrPhone: target, otp: otpCode });

  try {
    if (email) {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otpCode}`,
      });
    } else if (phone) {
      await twilioClient.messages.create({
        body: `Your OTP is ${otpCode}`,
        from: process.env.TWILIO_PHONE,
        to: `+91${phone}`,
      });
    }
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { emailOrPhone, otp } = req.body;

  const validOtp = await Otp.findOne({ emailOrPhone, otp });
  if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

  await Otp.deleteOne({ _id: validOtp._id });
  res.status(200).json({ message: "OTP verified successfully" });
};
