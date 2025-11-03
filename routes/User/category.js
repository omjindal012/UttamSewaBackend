const express = require("express");
const router = express.Router();
const { getAllCategories } = require("../../controllers/User/category");

router.get("/", getAllCategories);

module.exports = router;
