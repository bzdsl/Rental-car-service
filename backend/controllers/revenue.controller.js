/** @format */

import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";

export const Revenue = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    // Filter only completed bookings
    const filter = { status: "completed" };

    if (category) {
      const cars = await Car.find({ category });
      filter.car = { $in: cars.map((car) => car._id) };
    }

    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const bookings = await Booking.find(filter);

    // Calculate total revenue
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    // Group revenue by the specified type
    const revenueByType = {};
    bookings.forEach((booking) => {
      const dateKey =
        type === "year"
          ? new Date(booking.startDate).getFullYear()
          : type === "month"
          ? `${new Date(booking.startDate).getFullYear()}-${(
              new Date(booking.startDate).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}`
          : new Date(booking.startDate).toISOString().split("T")[0];

      revenueByType[dateKey] =
        (revenueByType[dateKey] || 0) + booking.totalPrice;
    });

    res.status(200).json({
      totalRevenue,
      revenueByType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error calculating revenue", error });
  }
};

export const mostRevenue = async (req, res) => {
  try {
    const cars = await Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$car", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "cars",
          localField: "_id",
          foreignField: "_id",
          as: "carDetails",
        },
      },
      { $unwind: "$carDetails" },
    ]);

    res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching most rented cars", error });
  }
};

export const mostRentedCategories = async (req, res) => {
  try {
    const categories = await Booking.aggregate([
      { $match: { status: "completed" } },
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "carDetails",
        },
      },
      { $unwind: "$carDetails" },
      {
        $group: {
          _id: "$carDetails.category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          name: "$categoryDetails.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching most rented categories", error });
  }
};
