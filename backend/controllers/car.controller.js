/** @format */
import { redis } from "../lib/redis.js";
import Car from "../models/car.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({}); //find all cars
    res.status(200).json({ cars });
  } catch (error) {
    console.log("Error in get all cars controller", error.message);
    res.status(404).json({ message: "Server error", message: error.message });
  }
};

export const getFeaturedCars = async (req, res) => {
  try {
    let featuredCars = await redis.get("featured_cars");

    if (featuredCars) {
      return res.json(JSON.parse(featuredCars));
    }

    //if not in redis, fetch from mongodb
    //.lean() is going to return a plain js object instead of mongodb document

    featuredCars = await Car.find({ isFeatured: true }).lean();

    if (!featuredCars) {
      return res.status(404).json({ message: "No featured cars found" });
    }
    await redis.set("featured_cars", JSON.stringify(featuredCars));

    res.json(featuredCars);
  } catch (error) {
    console.log("Error in get all cars controller", error.message);
    res.status(404).json({ message: "Server error", message: error.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const { name, brand, category, price, description, image } = req.body;

    let cloudinaryResponse = null;

    // Upload hình ảnh nếu có
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "cars",
      });
    }

    const car = await Car.create({
      name,
      brand,
      category,
      price,
      description,
      image: cloudinaryResponse?.secure_url || image,
    });

    res.status(201).json(car);
  } catch (error) {
    console.log("Error in create car controller", error.message);
    res.status(500).json({ message: "Server error", message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (car.image) {
      const publicId = car.image.split("/").pop().split(".")[0]; //get the id of the image
      try {
        await cloudinary.uploader.destroy(`cars/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error.message);
      }
    }
    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.log("Error in delete car controller", error.message);
    res.status(500).json({ message: "Server error", message: error.message });
  }
};

export const getRecommendedCars = async (req, res) => {
  try {
    const cars = await Car.aggregate([
      { $sample: { size: 5 } },
      {
        $project: {
          name: 1,
          category: 1,
          brand: 1,
          price: 1,
          status: 1,
          description: 1,
          image: 1,
        },
      },
    ]);
    res.json(cars);
  } catch (error) {
    console.log("Error in get all cars controller", error.message);
    res.status(500).json({ message: "Server error", message: error.message });
  }
};

export const getCarsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const cars = await Car.find({ category });
    if (!cars || cars.length === 0) {
      return res
        .status(404)
        .json({ message: `No cars found for category: ${category}` });
    }
    res.json({ cars });
  } catch (error) {
    console.error("Error in getCarsByCategory:", error); // Log lỗi ở đây
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      car.isFeatured = !car.isFeatured;
      const updatedCar = await car.save();
      //update redis cache
      await updateFearturedCarsCache(updatedCar);
      res.json(updatedCar);
    }
  } catch (error) {
    console.log("Error in toggle featured car controller", error.message);
    res.status(500).json({ message: "Server error", message: error.message });
  }
};

async function updateFearturedCarsCache() {
  try {
    const featuredCars = await Car.find({ isFeatured: true }).lean();
    await redis.set("featured_cars", JSON.stringify(featuredCars));
  } catch (error) {
    console.log("Error in update featured cars cache", error.message);
  }
}

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCar = await Car.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const carCount = async (req, res) => {
  try {
    const count = await Car.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSortedCars = async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortOrder = {};

    if (sortBy === "low") {
      sortOrder = { price: 1 }; // tăng dần
    } else if (sortBy === "high") {
      sortOrder = { price: -1 }; // giảm dần
    }

    const cars = await Car.find().sort(sortOrder);
    res.status(200).json({ cars });
  } catch (error) {
    console.log("Error in get sorted cars", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const searchCars = async (req, res) => {
  try {
    const { searchTerm, brand, category } = req.query;

    // Build query object
    const query = {};

    if (searchTerm) {
      query.name = { $regex: searchTerm, $options: "i" };
    }

    if (brand) {
      query.brand = brand;
    }

    if (category) {
      query.category = category;
    }

    const cars = await Car.find(query);
    res.json({ cars });
  } catch (error) {
    console.error("Error in searchCars:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMetadata = async (req, res) => {
  try {
    const brands = await Car.distinct("brand");
    const categories = await Car.distinct("category");
    res.json({ brands, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
