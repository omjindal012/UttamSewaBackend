const express = require("express");
const router = express.Router();
const { getReview } = require("../../controllers/Provider/review");

router.get("/", getReview);

module.exports = router;
