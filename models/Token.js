const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
  },
  refreshToken: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
