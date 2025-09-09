const express = require("express");
const router = express.Router();
const { getNotifications } = require("../../controllers/User/notification");

router.get("/", getNotifications);

module.exports = router;
