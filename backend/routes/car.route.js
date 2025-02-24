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
  carCount,
  getSortedCars,
  searchCars,
  getMetadata,
} from "../controllers/car.controller.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/featured", getFeaturedCars);
router.get("/recommendations", getRecommendedCars);
router.get("/category/:category", getCarsByCategory);
router.get("/search", searchCars);
router.get("/metadata", getMetadata);
router.get("/sort", getSortedCars);
router.post("/", protectRoute, adminRoute, createCar);
router.patch("/:id", protectRoute, adminRoute, updateCar);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedCar);
router.delete("/:id", protectRoute, adminRoute, deleteCar);
router.get("/count", protectRoute, adminRoute, carCount);
export default router;
