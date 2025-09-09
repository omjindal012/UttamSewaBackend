const express = require("express");
const router = express.Router();
const { Addreview } = require("../../controllers/User/review");

router.post("/addReview", Addreview);

module.exports = router;
