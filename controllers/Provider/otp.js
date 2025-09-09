const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const Provider = require("../../models/Provider");
const { generateTokens } = require("../../utils/generateToken");
const Token = require("../../models/Token");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: "sms",
      });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Twilio OTP Send Error:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      message: "Phone number and OTP are required",
    });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otp,
      });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ message: "OTP verification failed" });
    }

    let provider = await Provider.findOne({ phone_number: phoneNumber });
    let providerExist = true;

    if (!provider) {
      provider = await Provider.create({ phone_number: phoneNumber });
      providerExist = false;
    }

    const { accessToken, refreshToken } = generateTokens(provider._id);

    await Token.create({
      providerId: provider._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({
      message: "OTP verified successfully",
      refreshToken,
      accessToken,
      provider: { _id: provider._id },
      providerExist,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};
