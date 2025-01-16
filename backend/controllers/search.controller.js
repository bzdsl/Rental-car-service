/** @format */
import Car from "../models/car.model.js";
import Booking from "../models/booking.model.js";
import Fuse from "fuse.js";
import levenshtein from "fast-levenshtein";

//Hàm tìm kiếm phương tiện
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
      carsQuery.category = new RegExp(category.trim(), "i");
    }
    if (brand.trim()) carsQuery.brand = brand;
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      carsQuery.price = {};
      if (!isNaN(minPrice)) carsQuery.price.$gte = Number(minPrice);
      if (!isNaN(maxPrice)) carsQuery.price.$lte = Number(maxPrice);
    }

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

    // Get all matching cars
    let cars = await Car.find(carsQuery)
      .select("name brand category price image status description")
      .lean();

    // Fuzzy search using Levenshtein Distance
    if (name.trim()) {
      const searchTerm = name.trim().toLowerCase();

      // sử dụng Levenshtein Distance
      const isSimilar = (input, target) => {
        const distance = levenshtein.get(input, target);
        const similarity = 1 - distance / Math.max(input.length, target.length);
        return similarity >= 0.6; // ngươngx khả dụng
      };

      // Lọc dựa vào Levenshtein similarity
      cars = cars.filter(
        (car) =>
          isSimilar(searchTerm, car.name.toLowerCase()) ||
          isSimilar(searchTerm, car.brand.toLowerCase())
      );
    }

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
