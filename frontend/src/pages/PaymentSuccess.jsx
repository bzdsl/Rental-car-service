/** @format */

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Result, message } from "antd";
import axiosInstance from "../lib/axios";
import "../styles/payment-success.css"; // Đảm bảo bạn tạo file CSS riêng

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const confirmPayment = async () => {
      if (sessionId) {
        try {
          const response = await axiosInstance.post(
            "/payments/checkout-success",
            { sessionId }
          );
          console.log("Payment confirmed:", response.data);
        } catch (error) {
          console.error(
            "Error confirming payment:",
            error.response?.data || error.message
          );
          message.error(
            "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại."
          );
        }
      }
    };

    confirmPayment();
  }, [sessionId]);

  return (
    <div className="payment-success-container">
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle="Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Đặt xe của bạn đã được xác nhận."
        extra={[
          <Button
            key="home"
            type="primary"
            size="large"
            onClick={() => navigate("/")}>
            Về Trang Chủ
          </Button>,
          <Button
            key="rental-info"
            size="large"
            onClick={() => navigate("/rental-info")}>
            Lịch Sử Thuê Xe
          </Button>,
        ]}
      />
    </div>
  );
};

export default PaymentSuccess;
