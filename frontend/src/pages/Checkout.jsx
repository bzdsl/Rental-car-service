/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { message } from "antd";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";
import { useCarStore } from "../stores/useCarStore";
import { useBookingStore } from "../stores/useBookingStore";
import axiosInstance from "../lib/axios";
import { getStripe } from "../lib/stripe";

const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cars, selectedCar, setSelectedCar } = useCarStore();
  const {
    rentalDates,
    formData,
    pricing,
    updateFormData,
    calculateInitialPricing,
    applyDiscountCode,
    prepareBookingData,
    resetBooking,
  } = useBookingStore();

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const car = cars.find((item) => item._id === slug);
    if (car) {
      setSelectedCar(car);
      if (!calculateInitialPricing(car, rentalDates)) {
        message.error("Lỗi tính toán giá thuê xe");
      }
    } else {
      navigate("/cars");
    }
  }, [
    slug,
    cars,
    rentalDates,
    setSelectedCar,
    navigate,
    calculateInitialPricing,
  ]);

  const handleDiscountCode = () => {
    const success = applyDiscountCode(discountCode);
    if (success) {
      setDiscountError("");
      message.success("Mã giảm giá đã được áp dụng!");
    } else {
      setDiscountError("Mã giảm giá không hợp lệ");
      message.error("Mã giảm giá không tồn tại");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    const bookingData = prepareBookingData(selectedCar._id);

    if (!bookingData) {
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/payments/create-checkout-session",
        {
          cars: [
            {
              id: selectedCar._id,
              name: selectedCar.name,
              image: selectedCar.image,
              price: pricing.totalPrice,
            },
          ],
          couponCode: discountCode,
          // Add these fields
          startDate: rentalDates[0],
          endDate: rentalDates[1],
          pickupLocation: formData.pickupLocation,
          totalPrice: pricing.totalPrice,
        }
      );

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        message.error(error.message);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Lỗi khởi tạo thanh toán. Vui lòng thử lại."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedCar) {
    return <div>Đang tải...</div>;
  }
  const formatUSD = (vndAmount) => {
    const VND_TO_USD = 0.000041; // Should match backend rate
    const usdAmount = vndAmount * VND_TO_USD;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usdAmount);
  };

  return (
    <>
      <Header />
      <Container className="mt-5">
        <Row>
          <Col lg="8">
            <h2 className="mb-4">Thanh Toán Thuê Xe</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Họ và Tên</Label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Số Điện Thoại</Label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateFormData("phoneNumber", e.target.value)
                  }
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Địa chỉ nhận xe</Label>
                <Input
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    updateFormData("pickupLocation", e.target.value)
                  }
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Mã Giảm Giá</Label>
                <div className="d-flex">
                  <Input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value.toUpperCase());
                      setDiscountError("");
                    }}
                    placeholder="Nhập mã giảm giá"
                    className="mr-2"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleDiscountCode}>
                    Áp Dụng
                  </button>
                </div>
                {discountError && (
                  <div className="text-danger mt-2">{discountError}</div>
                )}
              </FormGroup>
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3 mb-5"
                disabled={isProcessing}>
                {isProcessing ? "Đang xử lý..." : "Tiến hành thanh toán"}
              </button>
            </Form>
          </Col>
          <Col lg="4">
            <div className="checkout__car-info p-4 border">
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                className="w-100 mb-3"
              />
              <h4>{selectedCar.name}</h4>
              <div className="d-flex justify-content-between mt-3">
                <span>Đơn giá:</span>
                <span>{selectedCar.price.toLocaleString()}đ/ngày</span>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <span>Số ngày thuê:</span>
                <span>{pricing.rentalDays} ngày</span>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <span>Ngày thuê xe: </span>
                <span>{rentalDates[0]}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Ngày trả xe: </span>
                <span>{rentalDates[1]}</span>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <span>Tổng tiền thuê:</span>
                <span>{pricing.basePrice.toLocaleString()}đ</span>
              </div>
              {pricing.discountAmount > 0 && (
                <div className="d-flex justify-content-between mt-2 text-success">
                  <span>Giảm giá:</span>
                  <span>-{pricing.discountAmount.toLocaleString()}đ</span>
                </div>
              )}
              <div className="d-flex justify-content-between mt-3 fw-bold">
                <span>Thành tiền:</span>
                <span>{pricing.totalPrice.toLocaleString()}đ</span>
                <div className="text-muted small">
                  ({formatUSD(pricing.totalPrice)})
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;
