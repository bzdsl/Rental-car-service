/** @format */

import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getUsers,
  updateUser,
  getUserById,
  deleteUser,
  userCount,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/count", protectRoute, adminRoute, userCount);

// User management routes
router.get("/users-management", protectRoute, adminRoute, getUsers);
router.get("/users-management/:id", protectRoute, adminRoute, getUserById); // New route for fetching a single user
router.put("/users-management/:id", protectRoute, adminRoute, updateUser);

// Add delete route
router.delete("/users-management/:id", protectRoute, adminRoute, deleteUser);

export default router;
