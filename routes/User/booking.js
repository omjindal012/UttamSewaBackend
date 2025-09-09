const express = require("express");
const router = express.Router();
const {
  checkBookingId,
  createBooking,
  updateBooking,
  getBookingsByUser,
} = require("../../controllers/User/booking");

router.get("/check/:booking_id", checkBookingId);
router.post("/", createBooking);
router.put("/update", updateBooking);
router.get("/user/:user_id", getBookingsByUser);

module.exports = router;
