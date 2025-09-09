const Booking = require("../../models/Booking");
const Service = require("../../models/Service");

exports.checkBookingId = async (req, res) => {
  const exists = await Booking.findOne({ booking_id: req.params.booking_id });
  res.json({ isUnique: !exists });
};

exports.createBooking = async (req, res) => {
  try {
    const {
      booking_id,
      user_id,
      address,
      date,
      time,
      category,
      service_names,
      otp,
      payment_id,
      latitude,
      longitude,
    } = req.body;

    if (
      !booking_id ||
      !user_id ||
      !address ||
      !date ||
      !time ||
      !category ||
      !service_names ||
      !otp ||
      !payment_id ||
      latitude == null ||
      longitude == null
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const newBooking = await Booking.create({
      booking_id,
      user_id,
      address,
      date,
      time,
      category,
      service_names,
      otp,
      payment_id,
      bookingLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
      rejectedBy: [],
    });

    await Booking.collection.createIndex({ bookingLocation: "2dsphere" });

    const populatedBooking = await newBooking.populate([
      "payment_id",
      "user_id",
    ]);

    const scheduleRadiusExpansion = req.app.get("scheduleRadiusExpansion");
    scheduleRadiusExpansion(newBooking._id);

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ message: "Booking ID is required." });
    }

    const booking = await Booking.findOne({ booking_id });
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });

    for (let key in req.body) {
      if (key !== "booking_id" && req.body.hasOwnProperty(key)) {
        booking[key] = req.body[key];
      }
    }

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("payment_id")
      .populate("user_id")
      .populate("provider_id");

    const io = req.app.get("io");
    io.to(String(populatedBooking.user_id._id)).emit(
      "bookingUpdated",
      populatedBooking
    );

    io.to(String(populatedBooking.provider_id._id)).emit(
      "bookingUpdated",
      populatedBooking
    );

    res.status(200).json({
      message: "Booking updated successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ message: "Failed to update booking", error: error.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let bookings = await Booking.find({ user_id })
      .populate("provider_id")
      .populate("payment_id")
      .populate("user_id")
      .lean();

    const serviceNames = [
      ...new Set(
        bookings.map((booking) => booking.service_names?.[0]).filter(Boolean)
      ),
    ];

    const services = await Service.find({ name: { $in: serviceNames } }).lean();

    const serviceMap = {};
    services.forEach((service) => {
      serviceMap[service.name] = service.image_url;
    });

    bookings = bookings.map((booking) => {
      const firstService = booking.service_names?.[0];
      return {
        ...booking,
        image_url: serviceMap[firstService] || null,
      };
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
