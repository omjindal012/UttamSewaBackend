const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../config/cloudConfig");
const upload = multer({ storage });

const {
  updateProvider,
  getProvider,
  logout,
} = require("../../controllers/Provider/provider");

router.get("/:id", getProvider);
router.put(
  "/update",
  upload.fields([
    { name: "profile_pic_url", maxCount: 1 },
    { name: "aadhar", maxCount: 1 },
  ]),
  updateProvider
);
router.get("/logout", logout);

module.exports = router;
