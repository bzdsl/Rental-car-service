/** @format */
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // For hashing new passwords

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id; // The user data is already attached via JWT token in the protectRoute middleware

    // Find the user by ID and update the profile
    const user = await User.findById(userId);

    // Update user information (only fields that are provided in the request)
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Save the updated user information
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required" });
  }

  try {
    // Check the current password
    const user = await User.findById(req.user._id); // req.user is already populated by protectRoute
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated password
    await user.save();

    res.json({ message: "Password successfully updated" });
  } catch (error) {
    console.log("Error in changePassword", error.message);
    res.status(500).json({
      message: "Error occurred while changing password",
      error: error.message,
    });
  }
};

// Get Profile (existing)
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

// Chinh sua thong tin nguoi dung
export const updateUser = async (req, res) => {
  const { id } = req.params; // Get the user ID from the route params
  const { name, email, phone } = req.body; // Get updated fields from the request body

  try {
    const user = await User.findById(id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save(); // Save updated user
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Send user data
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

// Delete User by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params; // Extract user ID from params

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
