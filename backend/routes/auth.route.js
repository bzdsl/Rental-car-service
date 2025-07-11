/** @format */

import express from "express";
import {
  login,
  logout,
  register,
  refreshToken,
} from "../controllers/auth.controller.js";

import { getUsers } from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

router.put("/profile", protectRoute, updateProfile); // Cập nhật thông tin cá nhân

export default router;
