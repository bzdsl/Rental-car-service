/** @format */

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CommentSection from "../components/UI/CommentSection";
import { useCarStore } from "../stores/useCarStore";
import { useBookingStore } from "../stores/useBookingStore";
import axiosInstance from "../lib/axios";
import { format, startOfDay } from "date-fns";
import DatePicker from "react-datepicker";
import { message } from "antd";
import "react-datepicker/dist/react-datepicker.css";

const CarDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cars, fetchAllCars } = useCarStore();
  const { rentalDates, setRentalDates } = useBookingStore();

  const singleCarItem = cars.find((item) => item._id === slug);

  useEffect(() => {
    if (cars.length === 0) {
      fetchAllCars();
    }
  }, [fetchAllCars, cars.length]);

  // Handle start date change
  const handleStartDateChange = (date) => {
    if (date) {
      // Convert to start of day to ensure consistent date comparison
      const normalizedDate = startOfDay(date);
      const formattedStartDate = format(normalizedDate, "yyyy-MM-dd");

      // If no end date is set or end date is before new start date, set end date to start date
      if (!rentalDates[1] || new Date(rentalDates[1]) < normalizedDate) {
        setRentalDates([formattedStartDate, formattedStartDate]);
      } else {
        setRentalDates([formattedStartDate, rentalDates[1]]);
      }
    }
  };

  // Handle end date change
  const handleEndDateChange = (date) => {
    if (date) {
      // Convert to start of day to ensure consistent date comparison
      const normalizedDate = startOfDay(date);
      const formattedEndDate = format(normalizedDate, "yyyy-MM-dd");

      if (!rentalDates[0]) {
        // If no start date is set, set both dates to the selected end date
        setRentalDates([formattedEndDate, formattedEndDate]);
      } else {
        // Check if end date is before start date
        if (normalizedDate < startOfDay(new Date(rentalDates[0]))) {
          message.error("Ngày kết thúc không thể trước ngày bắt đầu");
          return;
        }
        setRentalDates([rentalDates[0], formattedEndDate]);
      }
    }
  };

  // Check Car Availability
  const checkCarAvailability = async () => {
    if (!rentalDates[0] || !rentalDates[1]) {
      message.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc");
      return false;
    }

    try {
      const response = await axiosInstance.post(
        "/bookings/check-availability",
        {
          carId: slug,
          startDate: rentalDates[0],
          endDate: rentalDates[1],
        }
      );

      if (!response.data.isAvailable) {
        message.warning(
          response.data.message ||
            "Xe không khả dụng trong khoảng thời gian này"
        );
        return false;
      }

      return true;
    } catch (error) {
      message.error(
        error.response?.data?.message || "Lỗi kiểm tra tính khả dụng của xe"
      );
      return false;
    }
  };

  const handleRentClick = async () => {
    const isAvailable = await checkCarAvailability();
    if (isAvailable) {
      navigate(`/checkout/${slug}`);
    }
  };

  if (!singleCarItem) return <div>Không tìm thấy phương tiện</div>;

  return (
    <>
      <Header />
      <Helmet title={singleCarItem.name}>
        <section>
          <Container>
            <Row>
              <Col lg="6">
                <img
                  src={singleCarItem.image}
                  alt={singleCarItem.name}
                  className="w-100"
                />
              </Col>
              <Col lg="6">
                <div className="car__info">
                  <h2
                    className="section__title fw-bold"
                    style={{ color: "#000d6b" }}>
                    {singleCarItem.brand} {singleCarItem.name}
                  </h2>

                  <h6 className="rent__price fw-bold fs-4">
                    {singleCarItem.price.toLocaleString()}đ/ngày
                  </h6>
                  <p className="section__description">
                    {singleCarItem.description}
                  </p>
                  <div className="d-flex gap-4 mt-3">
                    <span>
                      <i
                        className="ri-roadster-line"
                        style={{ color: "#f9a826" }}></i>{" "}
                      {singleCarItem.category}
                    </span>
                    <span>
                      <i
                        className="ri-settings-2-line"
                        style={{ color: "#f9a826" }}></i>{" "}
                      {singleCarItem.brand}
                    </span>
                  </div>

                  <div className="d-flex flex-column flex-md-row align-items-center mt-4 gap-3">
                    <DatePicker
                      selected={
                        rentalDates[0] ? new Date(rentalDates[0]) : null
                      }
                      onChange={handleStartDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Ngày bắt đầu"
                      className="form-control"
                      minDate={startOfDay(new Date())}
                    />

                    <DatePicker
                      selected={
                        rentalDates[1] ? new Date(rentalDates[1]) : null
                      }
                      onChange={handleEndDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Ngày kết thúc"
                      className="form-control"
                      minDate={
                        rentalDates[0]
                          ? new Date(rentalDates[0])
                          : startOfDay(new Date())
                      }
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handleRentClick}
                      style={{
                        backgroundColor: "#000d6b",
                        borderColor: "#000d6b",
                      }}>
                      Thuê xe
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
            <CommentSection />
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default CarDetails;
