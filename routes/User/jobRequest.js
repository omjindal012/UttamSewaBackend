const express = require("express");
const router = express.Router();
const { createJobRequest } = require("../../controllers/User/jobRequest");

router.post("/", createJobRequest);

module.exports = router;
