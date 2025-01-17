/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { motion } from "framer-motion";
import { FiLock, FiMail } from "react-icons/fi";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useUserStore();
  const navigate = useNavigate();

  // Handle form submission (login request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
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
            style={{ maxWidth: "400px", width: "100%" }}>
            <h2
              className="text-center fw-bold mb-4"
              style={{ color: "#000d6b" }}>
              Đăng nhập
            </h2>
            <Form onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    required
                  />
                </div>
              </FormGroup>

              <Button
                className="w-100 btn btn-primary mb-3"
                style={{ backgroundColor: "#000d6b", color: "white" }}
                type="submit"
                disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="text-center">
                <Button
                  className="btn btn-link text-decoration-none"
                  type="button"
                  onClick={() => navigate("/forgot-password")}>
                  {" "}
                  {/* Điều hướng đến trang quên mật khẩu */}
                  Quên mật khẩu?
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

export default Login;
