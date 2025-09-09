const express = require("express");
const router = express.Router();
const { saveAddress, getAddress } = require("../../controllers/User/address");

router.post("/save", saveAddress);
router.get("/get", getAddress);

module.exports = router;
