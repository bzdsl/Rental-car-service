/** @format */
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import "../../styles/AdminStyle/adminpage.css";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import axiosInstance from "../../lib/axios";
import { formatDate, formatPrice } from "../../stores/useBookingStore";

const RentManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Fetch all bookings - using existing endpoint
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/bookings/all-bookings");
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status - using existing endpoints
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      if (newStatus === "cancelled") {
        await axiosInstance.put(`/bookings/${bookingId}/cancel`);
      } else {
        await axiosInstance.put(`/bookings/${bookingId}/status`, {
          status: newStatus,
        });
      }
      await fetchBookings();
      setShowStatusModal(false);
      setSelectedBooking(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update booking status"
      );
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "bg-warning",
      confirmed: "bg-info",
      active: "bg-primary",
      completed: "bg-success",
      cancelled: "bg-danger",
    };
    return `badge ${statusClasses[status.toLowerCase()] || "bg-secondary"}`;
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Quản lý thuê xe</h2>
          <Button variant="primary" onClick={() => fetchBookings()}>
            Refresh
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="table-responsive">
          <table className="table admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Khách hàng</th>
                <th>Xe</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày kết thúc</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div>{booking.fullName}</div>
                    <small className="text-muted">{booking.email}</small>
                  </td>
                  <td>{booking.car?.name || "N/A"}</td>
                  <td>{formatDate(booking.startDate)}</td>
                  <td>{formatDate(booking.endDate)}</td>
                  <td>{formatPrice(booking.totalPrice)}</td>
                  <td>
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowStatusModal(true);
                      }}>
                      Cập nhật
                    </Button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    Không có dữ liệu đặt xe
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Status Update Modal */}
        <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Cập nhật trạng thái đặt xe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-grid gap-2">
              {["pending", "confirmed", "active", "completed", "cancelled"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={
                      selectedBooking?.status === status
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() =>
                      updateBookingStatus(selectedBooking?._id, status)
                    }>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                )
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowStatusModal(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default RentManagement;
