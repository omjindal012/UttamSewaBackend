const { Server } = require("socket.io");
const getDistanceFromLatLng = require("./utils/distance");
const Booking = require("./models/Booking");
const Provider = require("./models/Provider");

function initSocket(server) {
  const io = new Server(server, { cors: { origin: "*" } });

  const providerLocations = {};
  const providerStatus = {};
  const providerCategory = {};

  const socketIdToProviderId = {};

  const EXPANSION_STEPS_KM = [5, 10, 15, 20];
  const EXPANSION_DELAY_MS = 3 * 60 * 1000;
  const expansionTimers = new Map();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on(
      "joinProvider",
      ({ providerId, latitude, longitude, status, service }) => {
        socket.join(String(providerId));
        socket.join("providers");
        socketIdToProviderId[socket.id] = providerId;
        providerLocations[providerId] = {
          lat: Number(latitude),
          lng: Number(longitude),
        };
        providerStatus[providerId] = status;
        providerCategory[providerId] = service;
        console.log(
          `Provider ${providerId} joined the room: ${status}, ${service}`
        );
      }
    );

    socket.on("joinUser", (userId) => {
      socket.join(String(userId));
      console.log(`User ${userId} joined the room.`);
    });

    socket.on("changeStatus", async ({ providerId, status }) => {
      try {
        const updatedProvider = await Provider.findOneAndUpdate(
          { _id: providerId },
          { $set: { status: status } },
          { new: true }
        );
        if (updatedProvider) {
          providerStatus[providerId] = status;
          console.log(`Provider ${providerId} is now ${status}`);

          if (status === "offline") {
            socket.leave("providers");
            console.log(`Provider ${providerId} left the 'providers' room.`);
          } else if (status === "online") {
            socket.join("providers");
            console.log(`Provider ${providerId} joined the 'providers' room.`);
          }
        } else {
          console.log(`Provider with ID ${providerId} not found.`);
        }
      } catch (error) {
        console.error("Error updating provider status:", error);
      }
    });

    socket.on("updateLocation", ({ providerId, latitude, longitude }) => {
      if (providerLocations[providerId]) {
        providerLocations[providerId] = {
          lat: Number(latitude),
          lng: Number(longitude),
        };
      }
    });

    socket.on("acceptBooking", async ({ bookingId, providerId }, callback) => {
      try {
        const updatedBooking = await Booking.findOneAndUpdate(
          { booking_id: bookingId, status: "Pending" },
          { $set: { status: "Accepted", provider_id: providerId } },
          { new: true }
        )
          .populate("payment_id")
          .populate("user_id")
          .populate("provider_id");

        if (!updatedBooking) {
          console.log(
            `Booking ${bookingId} was already accepted or not found.`
          );
          return callback({
            success: false,
            message:
              "This booking has already been accepted by another provider.",
          });
        }

        console.log(
          `Booking ${bookingId} successfully accepted by provider ${providerId}.`
        );

        clearExpansion(updatedBooking._id);

        io.to(String(updatedBooking.user_id._id)).emit(
          "bookingUpdated",
          updatedBooking
        );

        io.to(String(updatedBooking.provider_id._id)).emit(
          "bookingUpdated",
          updatedBooking
        );

        socket.broadcast.to("providers").emit("bookingAlreadyAccepted", {
          bookingId: bookingId,
        });

        callback({ success: true });
      } catch (error) {
        console.error("Error accepting booking:", error);
        callback({
          success: false,
          message: "Failed to accept booking due to a server error.",
        });
      }
    });

    socket.on("disconnect", () => {
      const providerId = socketIdToProviderId[socket.id];
      if (providerId) {
        console.log(`Provider ${providerId} disconnected.`);
        delete providerLocations[providerId];
        delete providerStatus[providerId];
        delete providerCategory[providerId];
        delete socketIdToProviderId[socket.id];
      }
    });
  });

  async function notifyProvidersWithinRange(
    latitude,
    longitude,
    bookingData,
    radiusKm
  ) {
    const rejectedSet = new Set((bookingData.rejectedBy || []).map(String));

    for (const providerId in providerLocations) {
      const { lat, lng } = providerLocations[providerId];
      const status = providerStatus[providerId];
      const category = providerCategory[providerId];

      if (status !== "online") continue;
      if (category !== bookingData.category) continue;
      if (rejectedSet.has(String(providerId))) continue;

      const distanceKm = getDistanceFromLatLng(latitude, longitude, lat, lng);
      if (distanceKm <= radiusKm) {
        io.to(String(providerId)).emit("newBooking", bookingData);
        console.log(
          `Sent booking ${
            bookingData._id
          } to provider ${providerId} @ ${radiusKm.toFixed(2)}km`
        );
      }
    }
  }

  async function runExpansionAttempt(bookingMongoId, stepIndex = 0) {
    try {
      const booking = await Booking.findById(bookingMongoId)
        .populate("payment_id")
        .populate("user_id");

      if (!booking) return clearExpansion(bookingMongoId);
      if (booking.status !== "Pending") return clearExpansion(bookingMongoId);
      if (
        !booking.bookingLocation ||
        !Array.isArray(booking.bookingLocation.coordinates) ||
        booking.bookingLocation.coordinates.length !== 2
      ) {
        console.warn(
          `Booking ${booking._id} missing bookingLocation, stopping expansion.`
        );
        return clearExpansion(bookingMongoId);
      }

      const [lng, lat] = booking.bookingLocation.coordinates;
      const radiusKm = EXPANSION_STEPS_KM[stepIndex];

      await notifyProvidersWithinRange(
        Number(lat),
        Number(lng),
        booking,
        radiusKm
      );

      if (stepIndex < EXPANSION_STEPS_KM.length - 1) {
        const timer = setTimeout(
          () => runExpansionAttempt(bookingMongoId, stepIndex + 1),
          EXPANSION_DELAY_MS
        );
        expansionTimers.set(String(bookingMongoId), {
          timer,
          stepIndex: stepIndex + 1,
        });
      } else {
        clearExpansion(bookingMongoId);
      }
    } catch (err) {
      console.error("Expansion attempt error:", err);
      clearExpansion(bookingMongoId);
    }
  }

  function scheduleRadiusExpansion(bookingMongoId) {
    console.log("Expansion Started!");
    clearExpansion(bookingMongoId);
    runExpansionAttempt(bookingMongoId, 0);
  }

  function clearExpansion(bookingMongoId) {
    const key = String(bookingMongoId);
    const entry = expansionTimers.get(key);
    if (entry?.timer) clearTimeout(entry.timer);
    expansionTimers.delete(key);
  }

  return {
    io,
    scheduleRadiusExpansion,
  };
}

module.exports = initSocket;
