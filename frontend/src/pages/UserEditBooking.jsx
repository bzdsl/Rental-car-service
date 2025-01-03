/** @format */

// src/Pages/UserEditBooking.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingStore } from "../stores/useBookingStore";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import Header from "../components/Header/Header";

const UserEditBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, updateBooking, loading, error, fetchBookings } =
    useBookingStore();
  const [formData, setFormData] = useState({
    // fullName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    pickupTime: "",
    notes: "",
    startDate: "",
    endDate: "",
    totalPrice: "",
  });

  useEffect(() => {
    if (!bookings.length) {
      fetchBookings();
    } else {
      const booking = bookings.find((b) => b._id === bookingId);
      if (booking) {
        setFormData({
          // fullName: booking.fullName || "",
          email: booking.email || "",
          phone: booking.phone || "",
          pickupLocation: booking.pickupLocation || "",
          pickupTime: booking.pickupTime || "",
          notes: booking.notes || "",
          startDate: booking.startDate || "",
          endDate: booking.endDate || "",
          totalPrice: booking.totalPrice?.toLocaleString() || "",
        });
      }
    }
  }, [bookings, bookingId, fetchBookings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, phone, pickupLocation, pickupTime, notes } = formData;
    updateBooking(bookingId, {
      // fullName,
      email,
      phone,
      pickupLocation,
      pickupTime,
      notes,
    });
    navigate("/rental-info");
  };

  if (loading) {
    return (
      <div className="min-h-screen d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light ">
      <Header />
      <div className="container">
        <h2 className="text-center mb-4 mt-5">Chỉnh sửa thông tin thuê xe</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Form.Group> */}

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
            <Form.Label>Thời gian đón</Form.Label>
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
              value={new Date(formData.startDate).toLocaleDateString()}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ngày kết thúc</Form.Label>
            <Form.Control
              type="text"
              value={new Date(formData.endDate).toLocaleDateString()}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tổng tiền</Form.Label>
            <Form.Control
              type="text"
              value={`${formData.totalPrice}đ`}
              disabled
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Cập nhật
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UserEditBooking;
