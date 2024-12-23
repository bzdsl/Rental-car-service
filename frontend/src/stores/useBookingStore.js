/** @format */

import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { differenceInDays, startOfDay } from "date-fns";

export const useBookingStore = create((set, get) => ({
  // Booking History State
  bookings: [],
  error: null,
  successMessage: "",
  loading: false,

  // Booking Creation State
  rentalDates: [],
  formData: {
    fullName: "",
    email: "",
    phoneNumber: "",
    pickupLocation: "",
    pickupTime: "", // New field
    notes: "", // New field
    discountCode: "",
  },
  pricing: {
    basePrice: 0,
    totalPrice: 0,
    discountAmount: 0,
    rentalDays: 0,
  },
  DISCOUNT_CODES: {
    FIRST10: { type: "percent", value: 10 },
    SUMMER20: { type: "percent", value: 20 },
    WEEKEND50: { type: "fixed", value: 50000 },
  },

  // Booking History Actions
  fetchBookings: async () => {
    console.log("Fetching bookings...");
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/bookings/my-bookings");
      console.log("Fetched bookings:", response.data);
      set({ bookings: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      set({ error: err.message || "Error fetching bookings", loading: false });
    }
  },

  clearMessages: () => set({ error: null, successMessage: "" }),

  // Booking Creation Actions
  setRentalDates: (dates) => {
    if (!dates || dates.length !== 2) {
      console.warn("Invalid date selection");
      return;
    }

    const start = startOfDay(new Date(dates[0]));
    const end = startOfDay(new Date(dates[1]));

    // Allow same-day bookings, but prevent end date before start date
    if (end < start) {
      console.warn("Ngày kết thúc không thể trước ngày bắt đầu");
      return;
    }

    set({ rentalDates: dates });
  },

  validateRentalDates: () => {
    const { rentalDates } = get();
    if (!rentalDates || rentalDates.length !== 2) return false;

    const start = startOfDay(new Date(rentalDates[0]));
    const end = startOfDay(new Date(rentalDates[1]));

    return !isNaN(start) && !isNaN(end) && end >= start;
  },

  calculatePricing: (basePrice, discountCode = "", days = 0) => {
    const { DISCOUNT_CODES } = get();

    let discountAmount = 0;
    let totalPrice = basePrice;

    if (discountCode && DISCOUNT_CODES[discountCode]) {
      const discount = DISCOUNT_CODES[discountCode];

      if (discount.type === "percent") {
        discountAmount = (discount.value / 100) * basePrice;
        totalPrice = basePrice - discountAmount;
      } else if (discount.type === "fixed") {
        discountAmount = Math.min(discount.value, basePrice);
        totalPrice = basePrice - discountAmount;
      }
    }

    set({
      pricing: {
        basePrice,
        discountAmount,
        totalPrice: Math.max(totalPrice, 0),
        rentalDays: days,
      },
    });
  },

  updateFormData: (field, value) =>
    set({ formData: { ...get().formData, [field]: value } }),

  resetBooking: () =>
    set({
      rentalDates: [],
      formData: {
        fullName: "",
        email: "",
        phoneNumber: "",
        pickupLocation: "",
        pickupTime: "",
        notes: "",
        discountCode: "",
      },
      pricing: {
        basePrice: 0,
        totalPrice: 0,
        discountAmount: 0,
        rentalDays: 0,
      },
    }),

  validateBookingData: () => {
    const { formData, rentalDates } = get();
    const { fullName, email, phoneNumber, pickupLocation, pickupTime } =
      formData;

    if (!fullName || !email || !phoneNumber || !pickupLocation || !pickupTime) {
      console.error("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (!rentalDates || rentalDates.length !== 2) {
      console.error("Vui lòng chọn ngày thuê xe");
      return false;
    }

    return true;
  },

  applyDiscountCode: (discountCode) => {
    const { DISCOUNT_CODES, pricing, calculatePricing } = get();
    const isValidCode = Object.keys(DISCOUNT_CODES).includes(discountCode);

    if (isValidCode) {
      calculatePricing(pricing.basePrice, discountCode, pricing.rentalDays);
      return true;
    } else {
      calculatePricing(pricing.basePrice, "", pricing.rentalDays);
      return false;
    }
  },

  calculateInitialPricing: (car, rentalDates) => {
    if (!car || !rentalDates || rentalDates.length !== 2) return false;

    try {
      const startDate = startOfDay(new Date(rentalDates[0]));
      const endDate = startOfDay(new Date(rentalDates[1]));

      if (isNaN(startDate) || isNaN(endDate)) {
        console.error("Invalid rental dates");
        return false;
      }

      // Include both start and end dates in calculation
      const days = differenceInDays(endDate, startDate) + 1;
      const totalBasePrice = car.price * days;

      get().calculatePricing(totalBasePrice, "", days);
      return true;
    } catch (error) {
      console.error("Error calculating price:", error);
      return false;
    }
  },

  prepareBookingData: (carId) => {
    const { formData, rentalDates, pricing, validateBookingData } = get();

    if (!validateBookingData()) return null;

    return {
      carId,
      startDate: rentalDates[0],
      endDate: rentalDates[1],
      pickupLocation: formData.pickupLocation,
      pickupTime: formData.pickupTime,
      notes: formData.notes,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      totalPrice: pricing.totalPrice,
    };
  },
}));

// Utility functions
export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
