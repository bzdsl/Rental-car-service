/** @format */

import React, { useState } from "react";

const CategoryAnalysis = ({ categoryRevenue }) => {
  const [viewType, setViewType] = useState("bookings"); // 'bookings' or 'revenue'

  // Calculate totals
  const totalBookings = categoryRevenue.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalRevenue = categoryRevenue.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );

  // Prepare data for pie chart
  const data = categoryRevenue.map((category) => ({
    name: category.name,
    bookingValue: (category.count / totalBookings) * 100,
    revenueValue: (category.totalRevenue / totalRevenue) * 100,
    count: category.count,
    revenue: category.totalRevenue,
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Phân tích theo loại xe</h2>
        <div className="flex gap-2">
          <button
            style={{
              backgroundColor: viewType === "bookings" ? "#000d6b" : "#f0f0f0",
              color: viewType === "bookings" ? "white" : "#333",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              boxShadow:
                viewType === "bookings"
                  ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
            onClick={() => setViewType("bookings")}>
            Theo lượt thuê
          </button>
          <button
            style={{
              backgroundColor: viewType === "revenue" ? "#000d6b" : "#f0f0f0",
              color: viewType === "revenue" ? "white" : "#333",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              boxShadow:
                viewType === "revenue"
                  ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
            onClick={() => setViewType("revenue")}>
            Theo doanh thu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="table-responsive overflow-x-auto">
          <table className="table admin-table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">Loại xe</th>
                <th className="border p-2 text-right">Lượt thuê</th>
                <th className="border p-2 text-right">Doanh thu</th>
                <th className="border p-2 text-right">
                  Tỷ lệ ({viewType === "bookings" ? "lượt thuê" : "doanh thu"})
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((category, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{category.name}</td>
                  <td className="border p-2 text-right">{category.count}</td>
                  <td className="border p-2 text-right">
                    {formatCurrency(category.revenue)}
                  </td>
                  <td className="border p-2 text-right">
                    {viewType === "bookings"
                      ? `${category.bookingValue.toFixed(1)}%`
                      : `${category.revenueValue.toFixed(1)}%`}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td className="border p-2">Tổng cộng</td>
                <td className="border p-2 text-right">{totalBookings}</td>
                <td className="border p-2 text-right">
                  {formatCurrency(totalRevenue)}
                </td>
                <td className="border p-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis;
