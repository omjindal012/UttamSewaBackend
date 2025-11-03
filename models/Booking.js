const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    required: true,
    unique: true,
  },
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "OnTheWay",
      "OnLocation",
      "InProgress",
      "Completed",
      "Cancelled",
    ],
    default: "Pending",
  },
  category: {
    type: String,
    required: true,
  },
  service_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  ],
  otp: {
    type: String,
    required: true,
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  rejectedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
    },
  ],
  bookingLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.index({ "bookingLocation.coordinates": "2dsphere" });

module.exports = mongoose.model("Booking", bookingSchema);
