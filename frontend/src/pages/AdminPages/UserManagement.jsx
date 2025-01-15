/** @format */

import React, { useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const UserManagement = () => {
  const { users, fetchUsers, loading } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này không?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/users/users-management/${userId}`);
      toast.success("Người dùng đã bị xóa khỏi hệ thống thành công!");

      // Refetch the user list after deletion
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Xóa người dùng không thành công!");
    }
  };
  if (loading) {
    return (
      <AdminLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!users || users.length === 0) {
    return (
      <AdminLayout>
        <div className="admin-section mt-5">
          <h1 className="section-title">Quản lý người dùng</h1>
          <p className="text-center">Không có dữ liệu để hiển thị.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-section">
        <h1 className="section-title mt-5">Quản lý người dùng</h1>

        <table className="table admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-warning "
                    onClick={() =>
                      navigate(`/admin/user-management/edit/${user._id}`)
                    }>
                    Chỉnh sửa
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
