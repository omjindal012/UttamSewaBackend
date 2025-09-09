const express = require("express");
const { sendOTP, verifyOtp } = require("../../controllers/Provider/email");
const router = express.Router();

router.post("/sendotp", sendOTP);
router.post("/verifyotp", verifyOtp);

module.exports = router;
