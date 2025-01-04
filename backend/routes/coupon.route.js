/** @format */

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCoupon,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/coupon.controller.js";
// import { validateCoupon } from "../controllers/coupon.controller.js";
const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.get("/validate", protectRoute, validateCoupon);
router.get("/coupons", protectRoute, getAllCoupons);
router.post("/", protectRoute, createCoupon);
router.get("/:id", protectRoute, getCouponById);
router.put("/:id", protectRoute, updateCoupon);
router.delete("/coupons/:id", protectRoute, deleteCoupon);
export default router;
