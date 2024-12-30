/** @format */

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cookiesParser from "cookie-parser";
import carRoutes from "./routes/car.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRouthes from "./routes/payment.route.js";
// import analyticsRoutes from "./routes/analytics.route.js";
import revenueRouthes from "./routes/revenue.route.js";
import userRoutes from "./routes/user.route.js";
import bookingRoutes from "./routes/booking.route.js";
import categoryRoutes from "../backend/routes/search.route.js";

import { connectDB } from "./lib/db.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
// Now process.env.PORT should work
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
app;

// Use the auth routes
app.use(express.json({ limit: "10mb" }));
app.use(cookiesParser());

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRouthes);
app.use("/api/revenues", revenueRouthes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", categoryRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port http://localhost:" + PORT);
  connectDB();
});
