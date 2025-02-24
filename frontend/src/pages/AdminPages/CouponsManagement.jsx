/** @format */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get("/coupons/list"); // Get all coupons
      const validCoupons = Array.isArray(response.data)
        ? response.data.filter((coupon) => coupon && coupon._id && coupon.code)
        : [];
      setCoupons(validCoupons);
      setError(null);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Không thể tải danh sách mã giảm giá!");
      setCoupons([]);
      toast.error("Không thể tải danh sách mã giảm giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!couponId) {
      toast.error("Mã giảm giá không hợp lệ!");
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa mã giảm giá này không?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/coupons/delete/${couponId}`); // Delete a coupon
      toast.success("Mã giảm giá đã được xóa thành công!");
      fetchCoupons(); // Refresh the list
    } catch (err) {
      console.error("Error deleting coupon:", err);
      toast.error("Xóa mã giảm giá không thành công!");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-section">
          <h1 className="section-title mt-5">Quản lý mã giảm giá</h1>
          <p className="text-danger">{error}</p>
          <button className="btn btn-primary" onClick={fetchCoupons}>
            Thử lại
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section">
        <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
          <h1 className="section-title">Quản lý mã giảm giá</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/coupon-management/create")}>
            Thêm mã giảm giá
          </button>
        </div>

        {coupons.length === 0 ? (
          <p>Chưa có mã giảm giá nào</p>
        ) : (
          <table className="table admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã giảm giá</th>
                <th>Phần trăm giảm</th>
                <th>Ngày tạo</th>
                <th>Ngày hết hạn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => {
                // Skip rendering if coupon is invalid
                if (!coupon || !coupon._id || !coupon.code) {
                  return null;
                }

                return (
                  <tr key={coupon._id}>
                    <td>{index + 1}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}%</td>
                    <td>
                      {coupon.createAt
                        ? new Date(coupon.createAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td>
                      {new Date(coupon.validUntil).toLocaleDateString("vi-VN")}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          coupon.isActive ? "bg-success" : "bg-danger"
                        }`}>
                        {coupon.isActive ? "Còn hiệu lực" : "Hết hiệu lực"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          navigate(
                            `/admin/coupon-management/edit/${coupon._id}`
                          )
                        }>
                        Chỉnh sửa
                      </button>
                      <button
                        style={{ marginLeft: "10px" }}
                        className="btn btn-danger"
                        onClick={() => handleDelete(coupon._id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default CouponsManagement;
