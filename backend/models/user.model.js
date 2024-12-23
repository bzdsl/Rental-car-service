/** @format */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Keep the unique constraint for email
      lowercase: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
      // Remove the unique constraint here
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    rentHistory: [
      {
        car: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Car",
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
      },
    ],
    feedback: [
      {
        car: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Car",
        },
        rate: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true } // Pass timestamps here
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
