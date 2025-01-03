/** @format */

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { useParams } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const EditUserProfile = () => {
  const { userId } = useParams(); // Get userId from the URL
  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          `/users/users-management/${userId}`
        );
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/users/users-management/${userId}`, user); // Update the user's details
      toast.success("Cập nhật thông tin người dùng thành công!"); // Success toast
    } catch (err) {
      toast.error("Cập nhật thông tin không thành công!"); // Error toast
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="admin-section">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mt-2 mb-4 text-center">
            Chỉnh sửa thông tin người dùng
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label font-semibold  mt-3">
                Tên
              </label>
              <input
                type="text"
                id="name"
                className="form-control block w-full px-3 py-2   border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label font-semibold  mt-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control block w-full px-3 py-2   border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label font-semibold  mt-3">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phone"
                className="form-control block w-full px-3 py-2   border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>
            <div className="form-group mt-3">
              <button type="submit" className="btn btn-info">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditUserProfile;
