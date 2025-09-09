const express = require("express");
const router = express.Router();
const {
  getBookingsByProvider,
  rejectForProvider,
  getAvailableBookingsForProvider,
} = require("../../controllers/Provider/booking");

router.get("/:provider_id", getBookingsByProvider);
router.put("/reject", rejectForProvider);
router.get("/:providerId/available-bookings", getAvailableBookingsForProvider);

module.exports = router;
