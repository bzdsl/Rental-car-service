/** @format */

import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Giảm giá theo phần trăm
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
