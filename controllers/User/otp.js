const twilio = require("twilio");
const User = require("../../models/User");
const Address = require("../../models/Address");
const Token = require("../../models/Token");
const { generateTokens } = require("../../utils/generateToken");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP
exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber)
    return res.status(400).json({ message: "Phone number is required" });
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        channel: "sms",
        to: `+91${phoneNumber}`,
      });
    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp)
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        code: `${otp}`,
        to: `+91${phoneNumber}`,
      });
    if (verificationCheck.status != "approved") {
      return res.status(400).json({ message: "OTP Not verified " });
    }

    let userExist = true;
    let user = await User.findOne({ phone_number: phoneNumber });
    if (!user) {
      user = await User.create({
        phone_number: phoneNumber,
      });
      userExist = false;
    }

    if (userExist) {
      const addresses = await Address.find({ user_id: user._id });
      if (!addresses) {
        userExist = false;
      }
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    await Token.create({
      userrId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      message: "OTP verified successfully",
      refreshToken,
      accessToken,
      user: { _id: user._id },
      userExist,
    });
  } catch (error) {
    console.error("OTP verification failed:", error);
    res
      .status(500)
      .json({ message: "Failed to verify OTP", error: error.message });
  }
};
