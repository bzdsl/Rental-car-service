/** @format */
import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminOverview from "./AdminOverview";

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
