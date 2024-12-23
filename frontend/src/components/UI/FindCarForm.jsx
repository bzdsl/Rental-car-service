/** @format */

import React, { useState } from "react";
import "../../styles/find-car-form.css";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FindCarForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form from submitting the traditional way
    console.log("Form submitted with dates:", startDate, endDate);

    // Navigate to the CarListing component (or CarItem page) upon form submission
    navigate("/car-listing"); // Adjust this to the correct path for CarItem or CarListing
  };

  const isDateDisabled = (date) => {
    // Disable dates before today
    return date < new Date();
  };

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <FormGroup className="form__group">
          <Label for="carName">Tên xe</Label>
          <Input id="carName" type="text" placeholder="Nhập tên phương tiện" />
        </FormGroup>

        {/* Loại xe */}
        <FormGroup className="select__group">
          <Label for="carType">Mẫu xe</Label>
          <Input id="carType" type="select">
            <option value="">Chọn mẫu xe</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="mpv">MPV</option>
          </Input>
        </FormGroup>

        {/* Hãng xe */}
        <FormGroup className="select__group">
          <Label for="carBrand">Hãng xe</Label>
          <Input id="carBrand" type="select">
            <option value="">Chọn hãng xe</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="ford">Ford</option>
            <option value="mercedes">Mercedes-Benz</option>
            <option value="bmw">BMW</option>
            <option value="audi">Audi</option>
            <option value="hyundai">Hyundai</option>
            <option value="chevrolet">Chevrolet</option>
            <option value="nissan">Nissan</option>
            <option value="kia">Kia</option>
            <option value="vinfast">VinFast</option>
          </Input>
        </FormGroup>

        {/* Ngày thuê */}
        <FormGroup className="form__group">
          <Label>Chọn ngày thuê</Label>
          <div className="d-flex gap-3">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Ngày bắt đầu"
              className="form-control"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Ngày kết thúc"
              className="form-control"
            />
          </div>
        </FormGroup>

        {/* Khoảng giá tiền */}
        <FormGroup className="form__group">
          <Label for="priceRange">Giá tiền</Label>
          <Input id="priceRange" type="select">
            <option value="">Chọn khoảng giá</option>
            <option value="1000000-2000000">
              1.000.000 VND - 2.000.000 VND
            </option>
            <option value="2000000-3000000">
              2.000.000 VND - 3.000.000 VND
            </option>
            <option value="3000000-4000000">
              3.000.000 VND - 4.000.000 VND
            </option>
            <option value="4000000-5000000">
              4.000.000 VND - 5.000.000 VND
            </option>
            <option value="5000000-10000000">
              5.000.000 VND - 10.000.000 VND
            </option>
          </Input>
        </FormGroup>

        {/* Nút tìm xe */}
        <FormGroup className="form__group">
          <Label> .</Label>
          <Button className="btn find__car-btn" type="submit">
            Tìm kiếm
          </Button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default FindCarForm;
