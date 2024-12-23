/** @format */

import React from "react";
import { Col } from "reactstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../styles/car-item.css";

const CarItem = ({ item }) => {
  const { image, category, brand, price, name, _id, description } = item;
  const navigate = useNavigate(); // Hook useNavigate để điều hướng

  return (
    <Col lg="4" md="4" sm="6" className="mb-5">
      <div className="car__item">
        <div className="car__img">
          <img src={image} alt={name} className="w-100" />
        </div>

        <div className="car__item-content mt-4">
          <h4 className="section__title text-center">{name}</h4>
          <h6 className="rent__price text-center mt-3">
            {price}đ <span>/ Ngày</span>
          </h6>

          <div className="car__item-info d-flex align-items-center justify-content-between mt-3 mb-4">
            <span className="d-flex align-items-center gap-1">
              <i className="ri-car-line"></i> {category}
            </span>
            <span className="d-flex align-items-center gap-1">
              <i className="ri-settings-2-line"></i> {brand}
            </span>
          </div>

          {/* Giữ nguyên nút "Chi tiết" với CSS và điều hướng bằng navigate */}
          <button
            className="w-50 car__item-btn car__btn-rent"
            onClick={() => navigate(`/cars/${_id}`)} // Điều hướng tới trang chi tiết
          >
            Chi tiết
          </button>
        </div>
      </div>
    </Col>
  );
};

export default CarItem;
