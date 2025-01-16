/** @format */

import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const useCarStore = create((set) => ({
  cars: [],
  loading: false,
  selectedCar: null, // New state for selected car

  setCars: (cars) => set({ cars }),
  // Action to set selected car
  setSelectedCar: (car) => set({ selectedCar: car }),

  fetchSortedCars: async (sortBy) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/cars/sort?sortBy=${sortBy}`);
      set({ cars: response.data.cars, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Không thể tải danh sách xe");
    }
  },

  createCar: async (carData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/cars", carData);
      set((prevState) => ({
        cars: [...prevState.cars, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchAllCars: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/cars");
      set({ cars: response.data.cars, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cars", loading: false });
      toast.error(error.response.data.error || "Không tìm thấy phương tiện");
    }
  },

  fetchCarsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/cars/category/${category}`);
      console.log("API response:", response.data); // Log phản hồi
      set({ cars: response.data.cars || [], loading: false });
    } catch (error) {
      console.error("Error fetching cars by category:", error.message);
      set({ cars: [], error: "Failed to fetch cars", loading: false });
      toast.error(
        error.response?.data?.message || "Không tìm thấy phương tiện"
      );
    }
  },

  deleteCar: async (carId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/cars/${carId}`);
      set((prevCars) => ({
        cars: prevCars.cars.filter((car) => car._id !== carId),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Xóa không thành công!");
    }
  },

  toggleFeaturedCar: async (carId) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/cars/${carId}`);
      set((prevCars) => ({
        cars: prevCars.cars.map((car) =>
          car._id === carId
            ? { ...car, isFeatured: response.data.isFeatured }
            : car
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Failed to update car");
    }
  },

  fetchFeaturedCars: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/cars/featured");
      set({ cars: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cars", loading: false });
      console.log("Error fetching featured cars:", error);
    }
  },

  updateCar: async (id, carDetails) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(`/cars/${id}`, carDetails);
      set((prevState) => ({
        cars: prevState.cars.map((car) =>
          car._id === id ? { ...car, ...res.data } : car
        ),
        loading: false,
      }));
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error(error.response.data.error || "Cập nhật thông tin thất bại");
      set({ loading: false });
    }
  },
  searchCars: async (params) => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get("/cars/search", { params });
      set({ cars: data.cars, loading: false });
    } catch (error) {
      console.error("Error searching cars:", error);
      set({ loading: false });
    }
  },
}));
export const formatPrice = (amount) => {
  return amount
    .toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    })
    .replace(/\./g, ","); // Thay dấu chấm thành dấu phẩy
};
