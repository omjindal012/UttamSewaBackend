const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ticket_id: {
    type: String,
    unique: true,
    sparse: true,
  },
  job_id: {
    type: String,
  },
  category: {
    type: String,
    enum: ["account", "payment", "service", "refund", "job_dispute"],
  },
  issue: {
    type: String,
  },
  attachments: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TicketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Ticket = mongoose.model("Ticket", TicketSchema);

module.exports = { Ticket };
