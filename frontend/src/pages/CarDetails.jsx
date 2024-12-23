/** @format */

// CarDetails component
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";
import CommentSection from "../components/UI/CommentSection";
import { useCarStore } from "../stores/useCarStore";
import { useBookingStore } from "../stores/useBookingStore";
import axiosInstance from "../lib/axios"; // Custom axios instance
import { format } from "date-fns";
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

  // CarDetails component: handleStartDateChange and handleEndDateChange
  const handleStartDateChange = (date) => {
    if (date) {
      const formattedStartDate = format(date, "yyyy-MM-dd");
      setRentalDates([formattedStartDate, rentalDates[1]]);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      const formattedEndDate = format(date, "yyyy-MM-dd");
      setRentalDates([rentalDates[0], formattedEndDate]);
    }
  };

  // Check Car Availability
  const checkCarAvailability = async () => {
    if (!rentalDates || rentalDates.length !== 2) {
      message.error("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc");
      return false;
    }

    const [startDate, endDate] = rentalDates;

    // Validate date logic
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      message.error("Ngày bắt đầu phải trước ngày kết thúc");
      return false;
    }

    try {
      const response = await axiosInstance.post(
        "/bookings/check-availability",
        {
          carId: slug,
          startDate,
          endDate,
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
    } else {
      message.warning("Xe không khả dụng. Vui lòng chọn ngày khác.");
    }
  };

  if (!singleCarItem) return <div>Car not found</div>;

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
                  <h2 className="section__title">{singleCarItem.name}</h2>
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

                  <div className="mt-4">
                    <DatePicker
                      selected={
                        rentalDates[0] ? new Date(rentalDates[0]) : null
                      }
                      onChange={handleStartDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Ngày bắt đầu"
                    />
                    <DatePicker
                      selected={
                        rentalDates[1] ? new Date(rentalDates[1]) : null
                      }
                      onChange={handleEndDateChange}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Ngày kết thúc"
                      style={{ marginLeft: "10px" }}
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-4"
                    onClick={handleRentClick}>
                    Thuê xe
                  </button>
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
