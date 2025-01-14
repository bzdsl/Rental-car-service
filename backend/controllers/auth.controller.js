/** @format */

import User from "../models/user.model.js";
import jwt from "jsonwebtoken"; // Để xác thực và tạo JWT
import { redis } from "../lib/redis.js";

// Utility functions
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7 // 7 days
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Đăng ký người dùng mới
export const register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Kiểm tra nếu người dùng đã tồn tại
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email này đã tồn tại" });
    }

    // Tạo người dùng mới
    const user = await User.create({ name, email, phone, password });

    // Tạo tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Lưu refresh token vào Redis
    await storeRefreshToken(user._id, refreshToken);

    // Thiết lập cookies
    setCookies(res, accessToken, refreshToken);

    // Phản hồi thành công
    res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Đăng xuất
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ message: "Logout successful" });
    }
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refresh token controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Lấy thông tin profile người dùng
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", message: error.message });
  }
};

// Lấy danh sách người dùng
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query; // Accept role filter via query params

    // Filter users based on the role, if provided
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password");

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Người dùng cập nhật thông tin

export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body; // Lấy dữ liệu từ body request
    const userId = req.user.id; // Lấy ID người dùng từ token (được xác thực qua middleware)

    const updatedUser = await User.findByIdAndUpdate(
      userId, // ID người dùng cần cập nhật
      { name, email, phone }, // Dữ liệu cần cập nhật
      { new: true } // Trả lại đối tượng người dùng đã được cập nhật
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json(updatedUser); // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
  }
};
