/** @format */

// bookingController.js
import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const checkBookingAvailability = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    // Parse dates to ensure correct format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        isAvailable: false,
        message: "Định dạng ngày không hợp lệ",
      });
    }

    // Validate that start date is before end date
    if (start > end) {
      return res.status(400).json({
        isAvailable: false,
        message: "Ngày bắt đầu phải trước ngày kết thúc",
      });
    }

    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        isAvailable: false,
        message: "Xe không tồn tại",
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      car: carId,
      status: { $nin: ["cancelled", "completed"] },
      $or: [
        {
          startDate: { $lt: end },
          endDate: { $gt: start },
        },
        {
          startDate: { $gte: start },
          endDate: { $lte: end },
        },
        {
          startDate: { $lte: start },
          endDate: { $gte: end },
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(200).json({
        isAvailable: false,
        message: "Xe đã được đặt trong một số ngày của khoảng thời gian này",
        conflictingBookings: conflictingBookings.map((booking) => ({
          startDate: booking.startDate,
          endDate: booking.endDate,
        })),
      });
    }

    return res.status(200).json({
      isAvailable: true,
      message: "Xe có sẵn trong toàn bộ khoảng thời gian",
    });
  } catch (error) {
    res.status(500).json({
      isAvailable: false,
      message: "Lỗi hệ thống khi kiểm tra tính khả dụng",
      error: error.message,
    });
  }
};

// Create booking logic remains unchanged.

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      carId,
      startDate,
      endDate,
      pickupLocation,
      pickupTime, // New field
      notes, // New field
      coupon,
      totalPrice,
    } = req.body;

    // Validate input dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        message: "Ngày bắt đầu phải trước ngày kết thúc",
      });
    }

    // Recheck availability (to prevent race conditions)
    const conflictingBookings = await Booking.find({
      car: carId,
      status: { $nin: ["cancelled", "completed"] },
      $or: [
        {
          startDate: { $lt: end },
          endDate: { $gt: start },
        },
      ],
    }).session(session);

    if (conflictingBookings.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        message: "Xe đã được đặt trong khoảng thời gian này",
        conflictingBookings: conflictingBookings.map((booking) => ({
          startDate: booking.startDate,
          endDate: booking.endDate,
        })),
      });
    }

    // Create new booking
    const newBooking = new Booking({
      user: req.user ? req.user._id : null,
      car: carId,
      startDate: start,
      endDate: end,
      pickupLocation,
      pickupTime,
      notes,
      coupon,
      totalPrice,
      status: "pending",
    });

    // Save booking with transaction
    await newBooking.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Đặt xe thành công",
      booking: newBooking,
    });
  } catch (error) {
    // Abort transaction if error occurs
    await session.abortTransaction();
    session.endSession();

    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Lỗi tạo đặt xe",
      error: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    // Fetch bookings for the logged-in user
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("car", "name image price") // Populate car details
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh sách đặt xe",
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đặt xe" });
    }

    // Check if user has permission to cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy đặt xe này" });
    }

    // Check if booking can be cancelled (not already completed/cancelled)
    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({ message: "Không thể hủy đặt xe này" });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Hủy đặt xe thành công",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hủy đặt xe",
      error: error.message,
    });
  }
};
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đặt xe" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái",
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  try {
    const bookings = await Booking.find()
      .populate("car", "name image price")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi lấy danh sách đặt xe",
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car", "name image price")
      .populate("user", "fullName email phone");

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn thuê" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin đơn thuê",
      error: error.message,
    });
  }
};

export const editBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, pickupLocation, pickupTime, notes } =
      req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn thuê" });
    }

    // Cập nhật thông tin người dùng nếu có
    if (booking.user) {
      await User.findByIdAndUpdate(booking.user, {
        fullName,
        email,
        phone,
      });
    }

    // Cập nhật thông tin đơn thuê
    booking.pickupLocation = pickupLocation;
    booking.pickupTime = pickupTime;
    booking.notes = notes;

    await booking.save();

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin ",
      error: error.message,
    });
  }
};
