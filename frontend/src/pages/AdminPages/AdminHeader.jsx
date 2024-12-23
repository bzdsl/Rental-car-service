/** @format */

import React from "react";
import { Button, Col } from "react-bootstrap";
import { useUserStore } from "../../stores/useUserStore";
import "../../styles/AdminStyle/adminpage.css";

const AdminHeader = () => {
  const { logout } = useUserStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">Hệ thống quản lý</h1>
      <Col className="admin-header-logout">
        <Button onClick={handleLogout} className="btn btn-danger">
          Đăng xuất
        </Button>
      </Col>
    </header>
  );
};

export default AdminHeader;
