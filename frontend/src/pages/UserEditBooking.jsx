/** @format */

// src/Pages/EditBooking.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBookingStore } from "../stores/useBookingStore";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import Header from "../components/Header/Header";

const EditBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { bookings, updateBooking, loading, error, fetchBookings } =
    useBookingStore();
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!bookings.length) {
      fetchBookings();
    } else {
      const booking = bookings.find((b) => b._id === bookingId);
      if (booking) {
        setFormData({
          startDate: booking.startDate,
          endDate: booking.endDate,
        });
      }
    }
  }, [bookings, bookingId, fetchBookings]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBooking(bookingId, formData);
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
        <h2 className="text-center mb-4 mt-5">Chỉnh sửa thông tin đặt xe</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Ngày bắt đầu</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày kết thúc</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
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

export default EditBooking;
