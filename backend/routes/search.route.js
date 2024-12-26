/** @format */

import express from "express";
import {
  getCategories,
  getBrands,
  searchCars,
  getSearchSuggestions,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/search", searchCars);
router.get("/search/suggestions", getSearchSuggestions);
router.get("/categories", getCategories);
router.get("/brands", getBrands);

export default router;
