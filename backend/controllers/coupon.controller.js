/** @format */

import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.params.id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.error("Error in getCoupon controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Mã khuyến mãi không tồn tại" });
    }

    // Kiểm tra mã giảm giá có hết hạn không
    if (coupon.validUntil < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Mã khuyến mãi đã hết hạn" });
    }

    // Nếu mã giảm giá hợp lệ, đảm bảo trả về đúng format
    return res.json({
      validUntil: true, // Thêm trường valid
      message: "Mã khuyến mãi hợp lệ",
      code: coupon.code,
      discount: coupon.discount,
      type: "percent", // Thêm type để frontend biết cách tính
    });
  } catch (error) {
    console.error("Error in validateCoupon controller:", error.message);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// In coupon.controller.js
export const createCoupon = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log dữ liệu nhận từ client
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error("Error in createCoupon:", error.message);
    res
      .status(500)
      .json({ message: "Error creating coupon", error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(coupon);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating coupon", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting coupon", error: error.message });
  }
};

// coupon.controller.js
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    console.log("Number of coupons found:", coupons.length);
    console.log("Coupons:", coupons);
    res.json(coupons);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching coupons" });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json(coupon);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coupon", error: error.message });
  }
};
