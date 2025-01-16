/** @format */

import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { differenceInDays, startOfDay } from "date-fns";

export const useBookingStore = create((set, get) => ({
  bookings: [],
  error: null,
  successMessage: "",
  loading: false,
  rentalDates: [],
  formData: {
    email: "",
    phone: "",
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

  updateFormData: (field, value) =>
    set({ formData: { ...get().formData, [field]: value } }),

  resetBooking: () =>
    set({
      rentalDates: [],
      formData: {
        // fullName: "",
        email: "",
        phone: "",
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
    const { email, phone, pickupLocation, pickupTime } = formData;

    if (!email || !phone || !pickupLocation || !pickupTime) {
      console.error("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (!rentalDates || rentalDates.length !== 2) {
      console.error("Vui lòng chọn ngày thuê xe");
      return false;
    }

    return true;
  },

  applyDiscountCode: async (discountCode) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", {
        code: discountCode,
      });

      if (response.data.discount) {
        const { pricing } = get();
        // Tính toán giảm giá theo phần trăm từ model
        const discountAmount =
          (response.data.discount / 100) * pricing.basePrice;

        set({
          pricing: {
            ...pricing,
            discountAmount,
            totalPrice: pricing.basePrice - discountAmount,
          },
        });
        return true;
      } else {
        set({ error: "Mã giảm giá không hợp lệ hoặc đã hết hạn" });
        return false;
      }
    } catch (error) {
      console.error("Error applying discount code:", error);
      set({ error: "Có lỗi khi áp dụng mã giảm giá" });
      return false;
    }
  },

  calculatePricing: (basePrice, days = 0) => {
    let discountAmount = 0;
    let totalPrice = basePrice;

    set({
      pricing: {
        basePrice,
        discountAmount,
        totalPrice: Math.max(totalPrice, 0),
        rentalDays: days,
      },
    });
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
      // fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      totalPrice: pricing.totalPrice,
    };
  },
  updateBooking: async (bookingId, data) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(
        `/bookings/${bookingId}/edit`,
        data
      );
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? { ...b, ...data } : b
        ),
        successMessage: "Cập nhật thông tin thành công!",
        error: null,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update booking" });
    } finally {
      set({ loading: false });
    }
  },
  cancelBooking: async (bookingId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        ),
        successMessage: "Hủy đặt xe thành công!",
        error: null,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Không thể hủy đặt xe",
        successMessage: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

// Utility functions

export const formatPrice = (price) => {
  return price
    .toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    })
    .replace(/\./g, ","); // Thay dấu chấm thành dấu phẩy
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
