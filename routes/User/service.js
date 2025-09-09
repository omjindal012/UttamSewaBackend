const express = require("express");
const router = express.Router();
const {
  getAllServicesByCategory,
  getAllServices,
  getAllEmergencyServices,
  getServiceReviewFaq,
} = require("../../controllers/User/service");

router.get("/", getAllServices);
router.get("/get", getAllServicesByCategory);
router.get("/get-emergency", getAllEmergencyServices);
router.get("/:id", getServiceReviewFaq);

module.exports = router;
