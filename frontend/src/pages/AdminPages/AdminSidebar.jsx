/** @format */
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminStyle/adminpage.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 className="admin-sidebar-title">Rental Car Service</h2>
      <ul className="admin-sidebar-menu ">
        <li className="mt-3">
          <Link to="/admin" className="admin-sidebar-link">
            Trang chủ
          </Link>
        </li>
        <li className="mt-3">
          <Link to="/admin/car-management" className="admin-sidebar-link">
            Quản lý phương tiện
          </Link>
        </li>
        <li className="mt-3">
          <Link to="/admin/rent-management" className="admin-sidebar-link">
            Quản lý cho thuê
          </Link>
        </li>
        <li className="mt-3">
          <Link to="/admin/user-management" className="admin-sidebar-link">
            Quản lý người dùng
          </Link>
        </li>
        <li className="mt-3">
          <Link to="/admin/feedback-management" className="admin-sidebar-link">
            Quản lý phản hồi
          </Link>
        </li>
        <li className="mt-3">
          <Link to="/admin/payment-management" className="admin-sidebar-link">
            Quản lý thanh toán
          </Link>
        </li>
        <li className="mt-3">
          <Link to="/admin/revenue-management" className="admin-sidebar-link">
            Thống kê doanh thu
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
