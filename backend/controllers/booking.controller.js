/** @format */

// bookingController.js
import Booking from "../models/booking.model.js";
import Car from "../models/car.model.js";
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
      pickupTime,
      notes,
      coupon,
      totalPrice,
      email, // Thêm email
      phone, // Thêm phone
    } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        message: "Ngày bắt đầu phải trước ngày kết thúc",
      });
    }

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
      });
    }

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
      email, // Lưu email
      phone, // Lưu phone
      status: "pending",
    });

    await newBooking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Đặt xe thành công",
      booking: newBooking,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Lỗi tạo đặt xe",
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
      return res.status(404).json({ message: "Không tìm thấy đơn thuê" });
    }

    // Check permissions
    if (req.user.role === "admin") {
      // Admin can cancel any booking
      booking.status = "cancelled";
      await booking.save();

      return res.status(200).json({
        message: "Hủy đơn thuê thành công",
        booking,
      });
    }

    // Regular user restrictions
    if (!booking.user || booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy đơn thuê này" });
    }

    // Check if booking status is pending for regular users
    if (booking.status !== "pending") {
      return res.status(400).json({
        message: "Chỉ có thể hủy đơn thuê đang ở trạng thái chờ xử lý",
      });
    }

    // Check date restrictions for regular users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(booking.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (today >= startDate) {
      return res.status(400).json({
        message: "Không thể hủy đơn thuê vào hoặc sau ngày bắt đầu thuê xe",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Hủy đơn thuê thành công",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hủy đơn thuê",
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
    const {
      searchId = "",
      searchEmail = "",
      startDate,
      endDate,
      status = "all",
    } = req.query;

    // Xây dựng query object
    let query = {};

    // Tìm theo ID
    if (searchId) {
      // Lấy tất cả bookings trước, sau đó filter theo ID ngắn
      const allBookings = await Booking.find()
        .populate("car", "name image price")
        .populate("user", "fullName email")
        .sort({ createdAt: -1 });

      const filteredBookings = allBookings.filter((booking) =>
        booking._id
          .toString()
          .slice(-6)
          .toLowerCase()
          .includes(searchId.toLowerCase())
      );

      return res.status(200).json(filteredBookings);
    }

    // Tìm theo email
    if (searchEmail) {
      query.email = new RegExp(searchEmail, "i");
    }

    // Tìm theo khoảng thời gian
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        let endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.startDate.$lte = endDateTime;
      }
    }

    // Tìm theo status
    if (status && status !== "all") {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("car", "name image price")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Lỗi lấy danh sách đặt xe",
      error: error.message,
    });
  }
};
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "car",
      "name image price"
    );

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
      return res.status(404).json({ message: "Không tìm thấy đơn đặt xe" });
    }

    // Kiểm tra quyền truy cập: Admin có thể sửa mọi đơn
    if (req.user.role === "admin") {
      // Admin can edit any booking
      booking.fullName = fullName || booking.fullName;
      booking.email = email || booking.email;
      booking.phone = phone || booking.phone;
      booking.pickupLocation = pickupLocation || booking.pickupLocation;
      booking.pickupTime = pickupTime || booking.pickupTime;
      booking.notes = notes || booking.notes;

      await booking.save();
      return res.status(200).json({ message: "Cập nhật thành công", booking });
    }

    // Kiểm tra quyền truy cập cho user thường
    if (booking.user && booking.user.toString() === req.user._id.toString()) {
      // Kiểm tra trạng thái và thời gian cho user thường
      if (booking.status !== "pending") {
        return res.status(403).json({
          message: "Chỉ có thể chỉnh sửa đơn đặt xe ở trạng thái chờ xử lý",
        });
      }

      // Kiểm tra thời gian
      const now = new Date();
      const startDate = new Date(booking.startDate);
      startDate.setHours(...booking.pickupTime.split(":").map(Number), 0, 0);
      const TWO_HOURS = 2 * 60 * 60 * 1000;

      if (now.getTime() + TWO_HOURS >= startDate.getTime()) {
        return res.status(403).json({
          message:
            "Không thể chỉnh sửa đơn đặt xe trong vòng 2 tiếng trước giờ nhận xe",
        });
      }

      // Cho phép user cập nhật thông tin
      booking.email = email || booking.email;
      booking.phone = phone || booking.phone;
      booking.pickupLocation = pickupLocation || booking.pickupLocation;
      booking.pickupTime = pickupTime || booking.pickupTime;
      booking.notes = notes || booking.notes;

      await booking.save();
      return res.status(200).json({ message: "Cập nhật thành công", booking });
    }

    // Nếu không phải admin và không phải chủ đơn
    return res.status(403).json({ message: "Bạn không có quyền sửa đơn này" });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin đặt xe" });
  }
};
