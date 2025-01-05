/** @format */

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// Routes cho mã giảm giá
router.post("/validate", protectRoute, validateCoupon);
router.get("/list", protectRoute, getAllCoupons);
router.post("/create", protectRoute, createCoupon);
router.get("/details/:id", protectRoute, getCouponById);
router.put("/update/:id", protectRoute, updateCoupon);
router.delete("/delete/:id", protectRoute, deleteCoupon);

export default router;
