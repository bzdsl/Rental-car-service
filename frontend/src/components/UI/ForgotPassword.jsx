/** @format */

import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi yêu cầu quên mật khẩu
    console.log("Email gửi yêu cầu:", email);
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
              Quên mật khẩu
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

              <Button
                className="w-100 btn btn-primary"
                style={{ backgroundColor: "#000d6b", color: "white" }}
                type="submit">
                Gửi yêu cầu
              </Button>
            </Form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
