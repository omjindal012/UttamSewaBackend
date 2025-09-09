const nodemailer = require("nodemailer");
const provider = require("../../models/Provider");

const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: " email is required." });
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Hello, your OTP code is ${otp}.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(" Error sending OTP:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    } else {
      return res.json({ success: true, message: "OTP sent successfully" });
    }
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp, providerId } = req.body;
  try {
    if (otpStore[email] && otpStore[email] == otp) {
      delete otpStore[email];
      await provider.findByIdAndUpdate(providerId, { email }, { new: true });
      return res.json({
        success: true,
        message: "OTP verified and email saved",
      });
    } else {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
