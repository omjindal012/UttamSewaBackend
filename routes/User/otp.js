const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../../controllers/User/otp");

router.post("/generate-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
