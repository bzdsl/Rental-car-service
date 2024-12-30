/** @format */

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import axiosInstance from "../../lib/axios";
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
  const [mostRentedCategories, setMostRentedCategories] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const revenueResponse = await axiosInstance.get("/revenues/revenue", {
        params: filter,
      });
      setData(revenueResponse.data);

      const mostRentedResponse = await axiosInstance.get(
        "/revenues/most-rented"
      );
      setMostRented(mostRentedResponse.data);

      const mostRentedCategoriesResponse = await axiosInstance.get(
        "/revenues/most-rented-categories"
      );
      setMostRentedCategories(mostRentedCategoriesResponse.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
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

  return (
    <AdminLayout>
      <div className="admin-section">
        <h1 className="section-title mt-5">Thống kê doanh thu</h1>

        <div
          className="filters"
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <select
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            style={{ padding: "5px", borderRadius: "5px" }}>
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
            <option value="year">Theo năm</option>
          </select>

          <input
            type="date"
            onChange={(e) =>
              setFilter({ ...filter, startDate: e.target.value })
            }
            placeholder="Ngày bắt đầu"
            style={{ padding: "5px", borderRadius: "5px" }}
          />
          <input
            type="date"
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            placeholder="Ngày kết thúc"
            style={{ padding: "5px", borderRadius: "5px" }}
          />
        </div>

        <div
          className="chart-container"
          style={{ maxWidth: "800px", margin: "0 " }}>
          <Bar data={chartData} />
        </div>

        <h2>Các mẫu xe được yêu chuộng nhất</h2>
        <table className="table admin-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên xe</th>
              <th>Số lần thuê</th>
            </tr>
          </thead>
          <tbody>
            {mostRented.map((car, index) => (
              <tr key={car._id}>
                <td>{index + 1}</td>
                <td>
                  {car.carDetails.brand} {car.carDetails.name}
                </td>
                <td>{car.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Các loại xe được thuê nhiều nhất</h2>
        <table className="table admin-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại xe</th>
              <th>Số lần thuê</th>
            </tr>
          </thead>
          <tbody>
            {mostRentedCategories.map((category, index) => (
              <tr key={category._id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default RevenueManagement;
