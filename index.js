const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const connectDB = require("./config/dbConfig");
const initSocket = require("./socket");

// User
const addressRouteUser = require("./routes/User/address");
const otpRouteUser = require("./routes/User/otp");
const notificationRouteUser = require("./routes/User/notification");
const emailOtpRouteUser = require("./routes/User/email");
const reviewRouteUser = require("./routes/User/review");
const userRoutes = require("./routes/User/user");
const categoryRoutes = require("./routes/User/category");
const serviceRoutes = require("./routes/User/service");
const bookingRoutes = require("./routes/User/booking");
const jobRequestRoutes = require("./routes/User/jobRequest");
const paymentRoutes = require("./routes/User/payment");

// Provider
const addressRouteProvider = require("./routes/Provider/address");
const otpRouteProvider = require("./routes/Provider/otp");
const reviewRouteProvider = require("./routes/Provider/review");
const notificationRouteProvider = require("./routes/Provider/notification");
const emailOtpRouteProvider = require("./routes/Provider/email");
const bookingRouteProvider = require("./routes/Provider/booking");
const providerRoutes = require("./routes/Provider/provider");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

// User
app.use("/api/user/address", addressRouteUser);
app.use("/api/user/otp", otpRouteUser);
app.use("/api/user/notification", notificationRouteUser);
app.use("/api/user/emailotp", emailOtpRouteUser);
app.use("/api/user/review", reviewRouteUser);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/job-request", jobRequestRoutes);
app.use("/api/payment", paymentRoutes);

// Provider
app.use("/api/provider/address", addressRouteProvider);
app.use("/api/provider/otp", otpRouteProvider);
app.use("/api/provider/review", reviewRouteProvider);
app.use("/api/provider/notification", notificationRouteProvider);
app.use("/api/provider/emailotp", emailOtpRouteProvider);
app.use("/api/provider/booking", bookingRouteProvider);
app.use("/api/providers", providerRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

const server = http.createServer(app);

const { io, scheduleRadiusExpansion } = initSocket(server);

app.set("io", io);
app.set("scheduleRadiusExpansion", scheduleRadiusExpansion);

const PORT = process.env.PORT || 6000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running at localhost:${PORT}`)
);
