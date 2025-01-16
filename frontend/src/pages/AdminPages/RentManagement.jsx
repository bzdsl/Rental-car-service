/** @format */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import axiosInstance from "../../lib/axios";
import { formatDate, formatPrice } from "../../stores/useBookingStore";
import { useNavigate } from "react-router-dom";

const RentManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();

  // Search states
  const [searchId, setSearchId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [viewType, setViewType] = useState("all");

  const fetchBookings = async (searchParams = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        searchId,
        searchEmail,
        startDate: searchStartDate,
        endDate: searchEndDate,
        status: viewType,
      }).toString();

      const response = await axiosInstance.get(
        `/bookings/all-bookings?${queryParams}`
      );
      setBookings(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };
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
      alert(err.response?.data?.message || "Failed to update booking status");
    }
  };
  // Fetch bookings when search params change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBookings();
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(debounceTimer);
  }, [searchId, searchEmail, searchStartDate, searchEndDate, viewType]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchId("");
    setSearchEmail("");
    setSearchStartDate("");
    setSearchEndDate("");
    setViewType("all");
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: "bg-warning",
      confirmed: "bg-info",
      completed: "bg-success",
      cancelled: "bg-danger",
    };
    return `badge ${statusClasses[status.toLowerCase()] || "bg-secondary"}`;
  };

  return (
    <AdminLayout>
      <div className="admin-section p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">Quản lý thuê xe</h2>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-container mb-4 p-3 bg-light rounded">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Tìm theo ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Tìm theo email</label>

              <input
                type="text"
                className="form-control"
                placeholder="Nhập email "
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Ngày bắt đầu</label>
              <input
                type="date"
                className="form-control"
                value={searchStartDate}
                onChange={(e) => setSearchStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Ngày kết thúc</label>
              <input
                type="date"
                className="form-control"
                value={searchEndDate}
                onChange={(e) => setSearchEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="row mt-3">
            <div className="col-md-8">
              <div className="btn-group">
                <Button
                  variant={viewType === "all" ? "primary" : "outline-primary"}
                  onClick={() => setViewType("all")}>
                  Tất cả
                </Button>
                <Button
                  variant={
                    viewType === "pending" ? "warning" : "outline-warning"
                  }
                  onClick={() => setViewType("pending")}>
                  Chờ xử lý
                </Button>
                <Button
                  variant={viewType === "confirmed" ? "info" : "outline-info"}
                  onClick={() => setViewType("confirmed")}>
                  Đã xác nhận
                </Button>
                <Button
                  variant={
                    viewType === "completed" ? "success" : "outline-success"
                  }
                  onClick={() => setViewType("completed")}>
                  Hoàn thành
                </Button>
                <Button
                  variant={
                    viewType === "cancelled" ? "danger" : "outline-danger"
                  }
                  onClick={() => setViewType("cancelled")}>
                  Đã hủy
                </Button>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <Button variant="secondary" onClick={handleResetFilters}>
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Booking Table */}
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
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/rent-management/edit/${booking._id}`)
                        }>
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowStatusModal(true);
                        }}>
                        Cập nhật
                      </Button>
                    </div>
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
              {["pending", "confirmed", "completed", "cancelled"].map(
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
