/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CarItem from "../components/UI/CarItem";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";
import { useLocation } from "react-router-dom"; // Lấy query params
import FindCarForm from "../components/UI/FindCarForm";

import axiosInstance from "../lib/axios";

const SearchResults = () => {
  const location = useLocation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy query params từ URL
  const query = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/search", {
          params: {
            name: query.get("name") || "",
            category: query.get("category") || "",
            brand: query.get("brand") || "",
            startDate: query.get("startDate") || null,
            endDate: query.get("endDate") || null,
            minPrice: query.get("minPrice") || 0,
            maxPrice: query.get("maxPrice") || Number.MAX_SAFE_INTEGER,
          },
        });
        setCars(data.cars);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <>
      <Header />
      <Helmet title="Search Results">
        <h1 className="text-center mt-3">Kết quả tìm kiếm</h1>
        <div className="d-flex justify-content-center">
          <FindCarForm />
        </div>
        <section>
          <Container>
            <Row>
              {loading ? (
                <p>Đang tải...</p>
              ) : cars.length === 0 ? (
                <p>Không tìm thấy kết quả nào.</p>
              ) : (
                cars.map((item) => <CarItem item={item} key={item._id} />)
              )}
            </Row>
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default SearchResults;
