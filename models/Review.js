const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  image_url: {
    type: String,
  },
  user_name: {
    type: String,
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
