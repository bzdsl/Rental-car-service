/** @format */

import React, { useEffect, useState } from "react";
import { Car, Users, DollarSign } from "lucide-react";
import axiosInstance from "../../../lib/axios";

const AdminOverview = () => {
  const [carCount, setCarCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [revenue, setRevenue] = useState({
    total: 0,
    data: [],
    currentMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;

        const [carsResponse, usersResponse, revenueResponse] =
          await Promise.all([
            axiosInstance.get("/cars/count"),
            axiosInstance.get("/users/count"),
            axiosInstance.get("/revenues/revenue", {
              params: {
                type: "month",
                startDate,
                endDate,
              },
            }),
          ]);

        setCarCount(carsResponse.data.count);
        setUserCount(usersResponse.data.count);

        const revenueData = Object.entries(
          revenueResponse.data.revenueByType || {}
        )
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([key, value]) => ({
            month: key.split("-")[1],
            revenue: value,
          }));

        // Get current month's revenue
        const currentMonth = new Date().getMonth() + 1;
        const currentMonthKey = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}`;
        const currentMonthRevenue =
          revenueResponse.data.revenueByType[currentMonthKey] || 0;

        setRevenue({
          total: revenueResponse.data.totalRevenue || 0,
          data: revenueData || [],
          currentMonth: currentMonthRevenue,
        });
      } catch (error) {
        console.error("Error fetching overview data:", error);
        if (error.response?.status === 401) {
          setError("Vui lòng đăng nhập lại để tiếp tục.");
        } else if (error.response?.status === 403) {
          setError("Bạn không có quyền truy cập vào trang này.");
        } else {
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded"
          role="alert">
          <p className="font-medium">Lỗi</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-6">Tổng quan</h2>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số phương tiện</p>
              <p className="text-2xl font-bold text-gray-800">{carCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số khách hàng</p>
              <p className="text-2xl font-bold text-gray-800">{userCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Doanh thu tháng này</p>
              <p className="text-2xl font-bold text-gray-800">
                {revenue.currentMonth.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
