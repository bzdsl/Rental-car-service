/** @format */
import React from "react";
import AdminSidebar from "../../components/UI/Admin/AdminSidebar";
import AdminHeader from "../../components/Header/AdminHeader";
import AdminOverview from "../../components/UI/Admin/AdminOverview";

import "../../styles/AdminStyle/adminpage.css";

const AdminPage = () => {
  return (
    <div className="admin-page">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <AdminOverview />
      </div>
    </div>
  );
};

export default AdminPage;
