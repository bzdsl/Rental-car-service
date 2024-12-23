/** @format */

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for guest bookings
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    stripeSessionId: {
      type: String,
      unique: true, // This ensures no duplicate bookings for the same session
      sparse: true, // This allows null values while maintaining uniqueness
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
