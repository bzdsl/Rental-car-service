/** @format */

import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  Revenue,
  mostRevenue,
  mostRentedCategories,
} from "../controllers/revenue.controller.js";

const router = express.Router();

router.get("/revenue", protectRoute, adminRoute, Revenue);
router.get(
  "/most-rented-categories",
  protectRoute,
  adminRoute,
  mostRentedCategories
);

// Most rented cars API
router.get("/most-rented", protectRoute, adminRoute, mostRevenue);

export default router;
