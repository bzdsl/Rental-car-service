/** @format */

import express from "express";
import {
  createBooking,
  checkBookingAvailability,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingById,
  editBooking,
} from "../controllers/booking.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Check booking availability (can be public)
router.post("/check-availability", checkBookingAvailability);

// Create a new booking (requires authentication)
router.post("/create", protectRoute, createBooking);

// Get user's bookings (requires authentication)
router.get("/my-bookings", protectRoute, getUserBookings);

router.get("/all-bookings", protectRoute, adminRoute, getAllBookings);

router.put("/:bookingId/status", protectRoute, updateBookingStatus);

router.get("/:id", protectRoute, getBookingById);
router.put("/:id/edit", protectRoute, editBooking);

// Cancel a booking (requires authentication)
router.put("/:bookingId/cancel", protectRoute, cancelBooking);

export default router;
