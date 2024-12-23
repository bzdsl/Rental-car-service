/** @format */
import React from "react";
import AdminSidebar from "../../pages/AdminPages/AdminSidebar";
import AdminHeader from "../../pages/AdminPages/AdminHeader";
// import "../../styles/AdminStyle/adminlayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-page">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
