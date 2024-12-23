/** @format */

import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { differenceInDays } from "date-fns";

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
      console.log("Fetched bookings:", response.data); // Log fetched bookings
      set({ bookings: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      set({ error: "", loading: false });
    }
  },

  // cancelBooking: async (bookingId) => {
  //   set({ loading: true, error: null, successMessage: "" });
  //   try {
  //     await axiosInstance.put(`/bookings/${bookingId}/cancel`);
  //     set({ successMessage: "Booking cancelled successfully" });
  //     // Fetch updated bookings
  //     const response = await axiosInstance.get("/bookings");
  //     set({ bookings: response.data, loading: false });
  //   } catch (err) {
  //     console.error("Error cancelling booking:", err);
  //     set({ error: "Failed to cancel booking", loading: false });
  //   }
  // },
  // cancelBooking: async (bookingId) => {
  //   try {
  //     await axios.put(`/api/bookings/${bookingId}/cancel`, null, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`, // Ensure the userToken is available
  //       },
  //     });
  //     // Re-fetch bookings after successful cancellation
  //     fetchBookings();
  //   } catch (error) {
  //     set({
  //       error: error.response?.data?.message || "Failed to cancel booking",
  //     });
  //   }
  // },

  clearMessages: () => set({ error: null, successMessage: "" }),

  // Booking Creation Actions
  setRentalDates: (dates) => {
    if (!dates || dates.length !== 2) {
      console.warn("Invalid date selection");
      return;
    }

    const start = new Date(dates[0]);
    const end = new Date(dates[1]);

    if (start >= end) {
      console.warn("Start date must be before end date");
      return;
    }

    set({ rentalDates: dates });
  },

  validateRentalDates: () => {
    const { rentalDates } = get();
    if (!rentalDates || rentalDates.length !== 2) {
      return false;
    }

    const start = new Date(rentalDates[0]);
    const end = new Date(rentalDates[1]);

    return !isNaN(start) && !isNaN(end) && start < end;
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
    const { fullName, email, phoneNumber, pickupLocation } = formData;

    if (!fullName || !email || !phoneNumber || !pickupLocation) {
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
    if (!car || !rentalDates || rentalDates.length !== 2) {
      return false;
    }

    try {
      const startDate = new Date(rentalDates[0]);
      const endDate = new Date(rentalDates[1]);

      if (isNaN(startDate) || isNaN(endDate)) {
        console.error("Invalid rental dates");
        return false;
      }

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

    if (!validateBookingData()) {
      return null;
    }

    return {
      carId,
      startDate: rentalDates[0],
      endDate: rentalDates[1],
      pickupLocation: formData.pickupLocation,
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
