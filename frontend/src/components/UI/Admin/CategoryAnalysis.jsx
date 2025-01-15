/** @format */

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

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

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

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
            className={`px-4 py-2 rounded ${
              viewType === "bookings" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewType("bookings")}>
            Theo lượt thuê
          </button>
          <button
            className={`px-4 py-2 rounded ${
              viewType === "revenue" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setViewType("revenue")}>
            Theo doanh thu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={
                  viewType === "bookings" ? "bookingValue" : "revenueValue"
                }
                label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Loại xe</th>
                <th className="border p-2 text-right">Số lượt thuê</th>
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
