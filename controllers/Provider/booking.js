const Booking = require("../../models/Booking");

exports.getBookingsByProvider = async (req, res) => {
  try {
    const { provider_id } = req.params;

    if (!provider_id) {
      return res.status(400).json({ message: "Provider ID is required" });
    }

    let bookings = await Booking.find({ provider_id })
      .populate("provider_id")
      .populate("payment_id")
      .populate("user_id")
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.rejectForProvider = async (req, res) => {
  try {
    const { booking_id, provider_id } = req.body;
    if (!booking_id || !provider_id) {
      return res
        .status(400)
        .json({ message: "booking_id and provider_id are required." });
    }
    const booking = await Booking.findOneAndUpdate(
      { booking_id },
      { $addToSet: { rejectedBy: provider_id } },
      { new: true }
    );
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });
    res.json({
      message: "Rejected for this provider.",
      booking_id,
      provider_id,
    });
  } catch (error) {
    console.error("Error rejecting booking:", error);
    res
      .status(500)
      .json({ message: "Failed to reject booking", error: error.message });
  }
};

exports.getAvailableBookingsForProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { radiusKm, latitude, longitude, service } = req.query;

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res
        .status(400)
        .json({ message: "Provider coordinates are missing." });
    }

    const maxDistance = Number(radiusKm) * 1000;

    const bookings = await Booking.find({
      status: "Pending",
      category: service,
      rejectedBy: { $ne: providerId },
      bookingLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: maxDistance,
        },
      },
    })
      .populate("provider_id")
      .populate("payment_id")
      .populate("user_id");

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching available bookings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};
