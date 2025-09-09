const express = require("express");
const router = express.Router();
const multer = require("multer");
const { updateUserById, getUserById } = require("../../controllers/User/user");
const { storage } = require("../../config/cloudConfig");
const upload = multer({ storage });

router.put("/:id", upload.single("profile_pic_url"), updateUserById);
router.get("/:id", getUserById);

module.exports = router;
