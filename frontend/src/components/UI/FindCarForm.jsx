/** @format */

import React, { useState, useEffect, useCallback } from "react";
import "../../styles/find-car-form.css";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../lib/axios";
import debounce from "lodash/debounce";

const FindCarForm = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    priceRange: "",
  });

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/search/suggestions?query=${query}`
        );
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/brands"),
        ]);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (err) {
        setError("Failed to load form data");
        console.error("Error loading form data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log("Input changed:", id, value);
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "name") {
      fetchSuggestions(value);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({
      ...prev,
      name: suggestion,
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("check:", formData);

    let minPrice = 0;
    let maxPrice = Number.MAX_SAFE_INTEGER;
    if (formData.priceRange) {
      const [min, max] = formData.priceRange.split("-").map(Number);
      minPrice = min;
      maxPrice = max;
    }

    const params = new URLSearchParams();

    if (formData.name) params.append("name", formData.name);
    if (formData.category) params.append("category", formData.category);
    if (formData.brand) params.append("brand", formData.brand);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    if (minPrice > 0) params.append("minPrice", minPrice);
    if (maxPrice < Number.MAX_SAFE_INTEGER) params.append("maxPrice", maxPrice);

    navigate({
      pathname: "/search-results",
      search: params.toString(),
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <FormGroup className="form__group position-relative">
          <Label for="name">Tên xe</Label>
          <Input
            id="name"
            type="text"
            placeholder="Nhập tên phương tiện"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ListGroup
              className="position-absolute w-100 mt-1 shadow-sm"
              style={{ zIndex: 1000 }}>
              {suggestions.map((suggestion, index) => (
                <ListGroupItem
                  key={index}
                  tag="button"
                  action
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-start">
                  {suggestion}
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </FormGroup>

        <FormGroup className="select__group">
          <Label for="category">Mẫu xe</Label>
          <Input
            id="category"
            type="select"
            value={formData.category}
            onChange={handleInputChange}>
            <option value="">Chọn mẫu xe</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup className="select__group">
          <Label for="brand">Hãng xe</Label>
          <Input
            id="brand"
            type="select"
            value={formData.brand}
            onChange={handleInputChange}>
            <option value="">Chọn hãng xe</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Input>
        </FormGroup>

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

        <FormGroup className="form__group">
          <Label for="priceRange">Giá tiền</Label>
          <Input
            id="priceRange"
            type="select"
            value={formData.priceRange}
            onChange={handleInputChange}>
            <option value="">Chọn khoảng giá</option>
            <option value="1000000-2000000">
              1,000,000 VND - 2,000,000 VND
            </option>
            <option value="2000000-3000000">
              2,000,000 VND - 3,000,000 VND
            </option>
            <option value="3000000-4000000">
              3,000,000 VND - 4,000,000 VND
            </option>
            <option value="4000000-5000000">
              4,000,000 VND - 5,000,000 VND
            </option>
            <option value="5000000-20000000">Trên 5,000,000 VND</option>
          </Input>
        </FormGroup>

        <FormGroup className="form__group">
          <label htmlFor="">Tìm kiếm </label>
          <Button className="btn find__car-btn" type="submit">
            Tìm kiếm
          </Button>
        </FormGroup>
      </div>
    </Form>
  );
};

export default FindCarForm;
