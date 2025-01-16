/** @format */

import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  Revenue,
  mostRevenue,
  revenueByCategories,
} from "../controllers/revenue.controller.js";

const router = express.Router();

router.get("/revenue", protectRoute, adminRoute, Revenue);
router.get(
  "/revenue-by-categories",
  protectRoute,
  adminRoute,
  revenueByCategories
);

// Most rented cars API
router.get("/most-rented", mostRevenue);

export default router;
