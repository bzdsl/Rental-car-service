/** @format */

import React, { useState, useEffect } from "react";
import { Container, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useUserStore } from "../stores/useUserStore"; // import đúng store
import axios from "axios";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";

const Profile = () => {
  const { user, set } = useUserStore(); // Lấy set từ store, không phải setUser
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, phone: user.phone });
    }
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("/api/auth/profile", formData, {
        withCredentials: true,
      });

      console.log("Response:", res); // Kiểm tra dữ liệu trả về từ API

      // Kiểm tra nếu res.status là 200 hoặc 201
      if (res.status === 200 || res.status === 201) {
        set({ user: res.data }); // Cập nhật user trong store bằng set
        alert("Thông tin đã được cập nhật thành công!");
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
        });
      } else {
        console.log("Status khác 200 hoặc 201:", res.status); // Kiểm tra khi không phải 200/201
        alert("Cập nhật thông tin không thành công!");
      }
    } catch (err) {
      // In lỗi chi tiết hơn
      if (err.response) {
        console.log("Lỗi từ server:", err.response.data);
        alert(
          err.response.data.message || "Cập nhật thông tin không thành công!"
        );
      } else {
      }
    }
  };

  return (
    <>
      <Header />
      <Container className="mt-5">
        <h2 className="mb-4 text-primary">Thông tin cá nhân</h2>
        <Form
          onSubmit={handleSubmit}
          className="p-3 border rounded shadow-sm bg-light mb-5">
          <FormGroup className="mb-3">
            <Label for="name" className="form-label">
              Tên
            </Label>
            <div className="d-flex align-items-center">
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!editMode.name}
                className={`form-control ${
                  editMode.name ? "border-primary" : ""
                }`}
              />
              <Button
                type="button"
                className="btn btn-sm btn-link text-primary ms-2 flex-shrink-0"
                onClick={() => toggleEdit("name")}>
                {editMode.name ? "Hoàn tất" : "Thay đổi"}
              </Button>
            </div>
          </FormGroup>

          <FormGroup className="mb-3">
            <Label for="email" className="form-label">
              Email
            </Label>
            <div className="d-flex align-items-center">
              <Input
                id="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!editMode.email}
                className={`form-control ${
                  editMode.email ? "border-primary" : ""
                }`}
              />
              <Button
                type="button"
                className="btn btn-sm btn-link text-primary ms-2 flex-shrink-0"
                onClick={() => toggleEdit("email")}>
                {editMode.email ? "Hoàn tất" : "Thay đổi"}
              </Button>
            </div>
          </FormGroup>

          <FormGroup className="mb-3">
            <Label for="phone" className="form-label">
              Số điện thoại
            </Label>
            <div className="d-flex align-items-center">
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!editMode.phone}
                className={`form-control ${
                  editMode.phone ? "border-primary" : ""
                }`}
              />
              <Button
                type="button"
                className="btn btn-sm btn-link text-primary ms-2 flex-shrink-0"
                onClick={() => toggleEdit("phone")}>
                {editMode.phone ? "Hoàn tất" : "Thay đổi"}
              </Button>
            </div>
          </FormGroup>

          <div className="mb-2">
            <Button type="submit" color="primary" className="px-4">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Profile;
