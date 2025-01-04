/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../Layout/AdminLayout";
import axiosInstance from "../../../lib/axios";
import { toast } from "react-hot-toast";

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    validUntil: "",
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      fetchCouponDetails();
    }
  }, [id]);

  const fetchCouponDetails = async () => {
    try {
      const response = await axiosInstance.get(`/coupons/${id}`);
      const coupon = response.data;
      setFormData({
        code: coupon.code,
        discount: coupon.discount,
        validUntil: new Date(coupon.validUntil).toISOString().split("T")[0],
        isActive: coupon.isActive,
      });
    } catch (err) {
      console.error("Error fetching coupon details:", err);
      toast.error("Không thể tải thông tin mã giảm giá!");
      navigate("/admin/coupon-management");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await axiosInstance.put(`/coupons/${id}`, formData);
        toast.success("Cập nhật mã giảm giá thành công!");
      } else {
        await axiosInstance.post("/coupons", formData);
        toast.success("Tạo mã giảm giá thành công!");
      }
      navigate("/admin/coupon-management");
    } catch (err) {
      console.error("Error saving coupon:", err);
      toast.error(err.response?.data?.message || "Lỗi khi lưu mã giảm giá!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="admin-section">
        <h1 className="section-title mt-5">
          {id ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3">
            <label className="form-label">Mã giảm giá</label>
            <input
              type="text"
              className="form-control"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phần trăm giảm</label>
            <input
              type="number"
              className="form-control"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Ngày hết hạn</label>
            <input
              type="date"
              className="form-control"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              id="isActive"
            />
            <label className="form-check-label" htmlFor="isActive">
              Còn hiệu lực
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Đang xử lý..." : id ? "Cập nhật" : "Thêm mới"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/admin/coupon-management")}>
            Hủy
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CouponForm;
