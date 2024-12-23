/** @format */

import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  users: [], // Danh sách người dùng
  loading: false,
  checkingAuth: true,

  register: async ({ name, email, phone, password, confirmPassword }) => {
    set({ loading: true });

    // Check if passwords match
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Mật khẩu không chính xác");
    }

    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });
      set({ user: null, loading: false }); // Do not log in automatically
      toast.success("Đăng ký thành công", {
        dangerouslyAllowHtml: true,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || "An error occurred during registration"
      );
    }
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
      toast.success("Đăng nhập thành công", {
        dangerouslyAllowHtml: true,
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false }); // Set user when authentication is verified
    } catch (error) {
      set({ user: null, checkingAuth: false }); // No user, stop checking
    }
  },

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem("accessToken"); // Get token from localStorage
      const response = await axios.get("/users/users-management?role=user", {
        // Add role filter, api caused error
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      set({ users: response.data.users, loading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
