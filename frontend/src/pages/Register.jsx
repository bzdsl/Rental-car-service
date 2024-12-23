/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore"; // Import your user store
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const { register, loading } = useUserStore(); // Extract register function and loading state
  const navigate = useNavigate();

  // Handle form submission (register request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    // Clear any previous error message
    setErrorMessage("");

    try {
      await register({ name, email, phone, password, confirmPassword });
      navigate("/login");
    } catch (error) {
      // Handle errors (if any)
      if (error.response && error.response.status === 400) {
        setErrorMessage("Email này đã tồn tại"); // Account already exists
      } else {
        setErrorMessage("Đã có lỗi xảy ra, vui lòng thử lại."); // Generic error message
      }
    }
  };

  return (
    <>
      <Header />
      <div className="mt-3 mb-3">
        <motion.div
          className="container mx-auto p-4 d-flex align-items-center justify-content-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div
            className="bg-white shadow rounded p-5"
            style={{ maxWidth: "500px", width: "100%" }}>
            <h2
              className="text-center fw-bold mb-4"
              sytle={{ color: "#000d6b" }}>
              Đăng ký tài khoản
            </h2>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}{" "}
            {/* Show error message */}
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <Label for="name" className="form-label">
                  Tên của bạn
                </Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiUser />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="email" className="form-label">
                  Email
                </Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiMail />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="phone" className="form-label">
                  Số điện thoại
                </Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiPhone />
                  </span>
                  <Input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Nhập số điện thoại của bạn"
                    required
                  />
                </div>
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="password" className="form-label">
                  Mật khẩu
                </Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiLock />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
              </FormGroup>

              <FormGroup className="mb-3">
                <Label for="confirmPassword" className="form-label">
                  Xác nhận mật khẩu
                </Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiLock />
                  </span>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Xác nhận mật khẩu"
                    required
                  />
                </div>
              </FormGroup>
              <Button
                className="w-100 mb-3"
                style={{ backgroundColor: "#000d6b", color: "white" }}
                type="submit"
                disabled={loading}>
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              <div className="text-center">
                <Button
                  className="btn btn-link text-decoration-none"
                  type="button"
                  onClick={() => navigate("/login")}>
                  {" "}
                  {/* Navigate to login page */}
                  Đã có tài khoản? Đăng nhập
                </Button>
              </div>
            </Form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
