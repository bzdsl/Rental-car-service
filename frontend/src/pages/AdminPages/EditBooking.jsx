/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import AdminLayout from "../../components/Layout/AdminLayout";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    pickupTime: "",
    notes: "",
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/bookings/${id}`);
        setBooking(response.data);
        setFormData({
          fullName: response.data.fullName || "", // Dữ liệu từ bảng bookings
          email: response.data.email || "", // Dữ liệu từ bảng bookings
          phone: response.data.phone || "", // Dữ liệu từ bảng bookings
          pickupLocation: response.data.pickupLocation || "",
          pickupTime: response.data.pickupTime || "",
          notes: response.data.notes || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/bookings/${id}/edit`, formData);
      navigate("/admin/rent-management");
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  return (
    <AdminLayout>
      <div className="admin-section p-4">
        <h2 className="section-title mb-4">Chỉnh sửa đơn thuê xe</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa điểm đón</Form.Label>
            <Form.Control
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thời gian nhận xe</Form.Label>
            <Form.Control
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>

          {/* Read-only fields */}
          <Form.Group className="mb-3">
            <Form.Label>Ngày bắt đầu</Form.Label>
            <Form.Control
              type="text"
              value={new Date(booking.startDate).toLocaleDateString()}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày kết thúc</Form.Label>
            <Form.Control
              type="text"
              value={new Date(booking.endDate).toLocaleDateString()}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tổng tiền</Form.Label>
            <Form.Control
              type="text"
              value={`${booking.totalPrice.toLocaleString()}đ`}
              disabled
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/rent-management")}>
              Hủy
            </Button>
          </div>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default EditBooking;
