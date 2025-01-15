/** @format */

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import axiosInstance from "../../lib/axios";
import CategoryAnalysis from "../../components/UI/Admin/CategoryAnalysis";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueManagement = () => {
  const [filter, setFilter] = useState({
    type: "day",
    category: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState({ totalRevenue: 0, revenueByType: {} });
  const [mostRented, setMostRented] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const revenueResponse = await axiosInstance.get("/revenues/revenue", {
        params: filter,
      });
      setData(revenueResponse.data);

      const mostRentedResponse = await axiosInstance.get(
        "/revenues/most-rented"
      );
      setMostRented(mostRentedResponse.data);

      const categoryRevenueResponse = await axiosInstance.get(
        "/revenues/revenue-by-categories"
      );
      setCategoryRevenue(categoryRevenueResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = {
    labels: Object.keys(data.revenueByType),
    datasets: [
      {
        label: "Doanh thu",
        data: Object.values(data.revenueByType),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê doanh thu theo thời gian",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text:
            filter.type === "year"
              ? "Năm"
              : filter.type === "month"
              ? "Tháng"
              : "Ngày",
        },
      },
      y: {
        title: {
          display: true,
          text: "Doanh thu (VNĐ)",
        },
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-section">
          <p>Đang tải dữ liệu...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-section">
          <p>Lỗi: {error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section">
        <h1 className="section-title mt-5">Thống kê doanh thu</h1>

        <div className="filters flex flex-wrap gap-4 mb-4">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="p-2 border rounded-md">
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>

          <input
            type="date"
            value={filter.startDate}
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
            className="p-2 border rounded-md"
          />
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="p-2 border rounded-md"
          />
        </div>

        <div
          className="chart-container mx-auto mb-6"
          style={{ maxWidth: "100%" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {categoryRevenue.length > 0 && (
          <CategoryAnalysis categoryRevenue={categoryRevenue} />
        )}

        <h2 className="text-lg font-bold mb-4">
          Các mẫu xe được yêu chuộng nhất
        </h2>
        <div className="table-responsive overflow-x-auto">
          <table className="table admin-table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">STT</th>
                <th className="border p-2">Tên xe</th>
                <th className="border p-2">Số lần thuê</th>
              </tr>
            </thead>
            <tbody>
              {mostRented.length > 0 ? (
                mostRented.map((car, index) => (
                  <tr key={car._id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      {car.carDetails.brand} {car.carDetails.name}
                    </td>
                    <td className="border p-2">{car.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center border p-2">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RevenueManagement;
