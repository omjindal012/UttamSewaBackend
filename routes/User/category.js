const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
} = require("../../controllers/User/category");

router.get("/", getAllCategories);
router.get("/get", getCategoryById);

module.exports = router;
