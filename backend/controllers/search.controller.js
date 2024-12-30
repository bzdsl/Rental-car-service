/** @format */
import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";
import Fuse from "fuse.js";

// Helper function to get search suggestions
export const searchCars = async (req, res) => {
  try {
    const {
      name = "",
      category = "",
      brand = "",
      startDate = null,
      endDate = null,
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      page = 1,
      limit = 10,
    } = req.query;

    // Get initial dataset
    let carsQuery = {};

    // Add filters that don't need fuzzy search
    if (category.trim()) {
      // Use case-insensitive regex match for category
      carsQuery.category = new RegExp(category.trim(), "i");
    }
    if (brand.trim()) carsQuery.brand = brand;
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      carsQuery.price = {};
      if (!isNaN(minPrice)) carsQuery.price.$gte = Number(minPrice);
      if (!isNaN(maxPrice)) carsQuery.price.$lte = Number(maxPrice);
    }

    // Check availability if dates are provided
    if (startDate && endDate) {
      const unavailableCars = await Booking.distinct("car", {
        status: { $nin: ["cancelled", "completed"] },
        $or: [
          {
            startDate: { $lt: new Date(endDate) },
            endDate: { $gt: new Date(startDate) },
          },
        ],
      });
      if (unavailableCars.length) {
        carsQuery._id = { $nin: unavailableCars };
      }
    }

    // Get all matching cars before fuzzy search
    let cars = await Car.find(carsQuery)
      .select("name brand category price image status description")
      .lean();

    // Apply Fuse.js search if name is provided
    if (name.trim()) {
      const fuseOptions = {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "brand", weight: 0.2 },
          { name: "description", weight: 0.3 },
        ],
        includeScore: true,
        threshold: 0.4,
        minMatchCharLength: 2,
      };

      const fuse = new Fuse(cars, fuseOptions);
      const searchResult = fuse.search(name);

      // Sort results by Fuse.js score and limit to items with score < 0.6
      cars = searchResult
        .filter((result) => result.score < 0.6)
        .map((result) => result.item);
    }

    // Manual pagination after fuzzy search
    const total = cars.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedCars = cars.slice(startIndex, endIndex);

    res.json({
      cars: paginatedCars,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
      appliedFilters: {
        name: name || null,
        category: category || null,
        brand: brand || null,
        startDate: startDate || null,
        endDate: endDate || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice === Number.MAX_SAFE_INTEGER ? null : maxPrice,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

export const getSearchSuggestions = async (req, res) => {
  try {
    const { query = "" } = req.query;

    if (!query.trim()) {
      return res.json({ suggestions: [] });
    }

    // Get all cars for fuzzy search
    const cars = await Car.find({}).select("name brand category").lean();

    const fuseOptions = {
      keys: ["name", "brand", "category"],
      threshold: 0.3,
      minMatchCharLength: 2,
    };

    const fuse = new Fuse(cars, fuseOptions);
    const results = fuse.search(query);

    // Extract unique suggestions
    const suggestions = [
      ...new Set(
        results.slice(0, 5).map((result) => {
          const { name, brand } = result.item;
          return `${brand} ${name}  `.trim();
        })
      ),
    ];

    res.json({ suggestions });
  } catch (error) {
    console.error("Suggestion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get suggestions",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    // Lấy danh sách categories duy nhất từ collection cars
    const categories = await Car.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

export const getBrands = async (req, res) => {
  try {
    // Lấy danh sách brands duy nhất từ collection cars
    const brands = await Car.distinct("brand");
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Error fetching brands" });
  }
};
