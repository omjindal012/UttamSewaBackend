const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },
  age: {
    type: Number,
    min: 0,
  },
  address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  aadhar: {
    type: String,
  },
  service: {
    type: String,
  },
  experience: {
    type: Number,
  },
  shop_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  profile_pic_url: {
    type: String,
  },
  pushToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

providerSchema.index({ "location.coordinates": "2dsphere" });

providerSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Provider", providerSchema);
