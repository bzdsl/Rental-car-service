/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert, Button, Modal, Dropdown } from "react-bootstrap";
import {
  useBookingStore,
  formatPrice,
  formatDate,
} from "../stores/useBookingStore";
import Header from "../components/Header/Header";

const RentalInfo = () => {
  const navigate = useNavigate();
  const {
    bookings,
    error,
    successMessage,
    loading,
    fetchBookings,
    cancelBooking,
    clearMessages,
  } = useBookingStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Function to filter bookings based on selected status
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  const isBeforePickupTime = (startDate, pickupTime) => {
    const now = new Date();
    const bookingStart = new Date(startDate);
    bookingStart.setHours(...pickupTime.split(":").map(Number), 0, 0);

    if (
      now.getDate() !== bookingStart.getDate() ||
      now.getMonth() !== bookingStart.getMonth() ||
      now.getFullYear() !== bookingStart.getFullYear()
    ) {
      return now < bookingStart;
    }

    const TWO_HOURS = 2 * 60 * 60 * 1000;
    return now.getTime() + TWO_HOURS < bookingStart.getTime();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    return () => clearMessages();
  }, []);

  const canEdit = (booking) => {
    return (
      booking.status === "pending" &&
      isBeforePickupTime(booking.startDate, booking.pickupTime)
    );
  };

  const canCancel = (booking) => {
    return (
      booking.status === "pending" &&
      isBeforePickupTime(booking.startDate, booking.pickupTime)
    );
  };

  const handleCancel = async () => {
    if (selectedBooking && canCancel(selectedBooking)) {
      await cancelBooking(selectedBooking._id);
      await fetchBookings(); // Refresh data after cancellation
    }
    setShowModal(false);
  };

  const handleEdit = (bookingId) => {
    navigate(`/user-edit-booking/${bookingId}`);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Header />

      <div className="container py-6">
        <h2 className="text-3xl font-bold text-center mt-5 mb-8">
          Thông tin thuê xe
        </h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <div className="mb-4">
          <Dropdown onSelect={handleStatusChange}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {statusFilter === "all"
                ? "Tất cả trạng thái"
                : `Trạng thái: ${statusFilter}`}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">Tất cả trạng thái</Dropdown.Item>
              <Dropdown.Item eventKey="pending">Chờ xử lý</Dropdown.Item>
              <Dropdown.Item eventKey="confirmed">Đã xác nhận</Dropdown.Item>
              <Dropdown.Item eventKey="cancelled">Đã hủy</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="space-y-6">
          {filteredBookings.map((booking, index) => (
            <div
              key={booking._id}
              className="d-flex align-items-center border rounded p-3 shadow-sm bg-white mb-3">
              <div className="font-weight-bold text-lg me-3">{index + 1}</div>

              <img
                src={booking.car?.image || "https://via.placeholder.com/150"}
                alt={booking.car?.name || "Car"}
                className="rounded me-3"
                style={{ width: "150px", height: "100px", objectFit: "cover" }}
              />

              <div className="flex-grow-1">
                <h3 className="h5 fw-bold">
                  {booking.car?.name || "Unknown Car"}
                </h3>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  <p>
                    <strong>Ngày bắt đầu:</strong>{" "}
                    {formatDate(booking.startDate)}
                  </p>
                  <p>
                    <strong>Ngày kết thúc:</strong>{" "}
                    {formatDate(booking.endDate)}
                  </p>
                  <p>
                    <strong>Giá thuê:</strong> {formatPrice(booking.totalPrice)}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {booking.status || "N/A"}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                {canEdit(booking) && (
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(booking._id)}>
                    Chỉnh sửa
                  </Button>
                )}
                {canCancel(booking) && (
                  <Button
                    variant="danger"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowModal(true);
                    }}>
                    Hủy
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-4 text-muted">
              Không có lịch sử thuê xe nào
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy đặt xe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn hủy đặt xe này không? Hành động này không thể
          hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Không
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Có, hủy đặt xe
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RentalInfo;
