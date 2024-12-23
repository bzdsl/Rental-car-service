/** @format */

import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getAllCars,
  getFeaturedCars,
  createCar,
  deleteCar,
  getRecommendedCars,
  getCarsByCategory,
  toggleFeaturedCar,
  updateCar,
} from "../controllers/car.controller.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/featured", getFeaturedCars);
router.get("/recommendations", getRecommendedCars);
router.get("/category/:category", getCarsByCategory);
router.post("/", protectRoute, adminRoute, createCar);
router.patch("/:id", protectRoute, adminRoute, updateCar);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedCar);
router.delete("/:id", protectRoute, adminRoute, deleteCar);
// router.get("/cars/count", protectRoute, adminRoute, carCount);
export default router;
