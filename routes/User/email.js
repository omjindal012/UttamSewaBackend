const express = require("express");
const router = express.Router();
const { sendOTP, verifyOtp } = require("../../controllers/User/email");

router.post("/sendotp", sendOTP);
router.post("/verifyotp", verifyOtp);

module.exports = router;
