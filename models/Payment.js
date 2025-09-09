const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    payment_method: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transaction_id: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
