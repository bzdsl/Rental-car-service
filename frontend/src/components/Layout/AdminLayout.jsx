/** @format */
import React from "react";
import AdminSidebar from "../UI/Admin/AdminSidebar";
import AdminHeader from "../Header/AdminHeader";
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
