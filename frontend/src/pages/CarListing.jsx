/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CarItem from "../components/UI/CarItem";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useCarStore } from "../stores/useCarStore";
import { Spinner } from "react-bootstrap";

const CarListing = () => {
  const [sortOrder, setSortOrder] = useState("");
  const { cars, loading, fetchSortedCars } = useCarStore();

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    if (value) {
      fetchSortedCars(value);
    }
  };

  // Load tất cả xe khi component mount
  useEffect(() => {
    if (!sortOrder) {
      fetchSortedCars("");
    }
  }, []);

  return (
    <>
      <Header />
      <Helmet title="Cars">
        <section className="car-listing">
          <Container>
            <Row>
              <Col lg="12">
                <div className="car-listing__header">
                  <h1 className="text-center mt-3">Danh sách phương tiện</h1>

                  <div className="d-flex align-items-center gap-3 mb-5">
                    <span className="d-flex align-items-center gap-2">
                      <i className="ri-sort-asc"></i> Sắp xếp theo giá
                    </span>

                    <select
                      value={sortOrder}
                      onChange={handleSortChange}
                      className="form-select w-auto">
                      <option value="">Chọn cách sắp xếp</option>
                      <option value="low">Giá thấp đến cao</option>
                      <option value="high">Giá cao đến thấp</option>
                    </select>
                  </div>
                </div>
              </Col>

              {loading ? (
                <Col lg="12">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}>
                    <Spinner animation="border" variant="primary" />
                  </div>{" "}
                </Col>
              ) : (
                <>
                  {cars.length > 0 ? (
                    cars.map((item) => <CarItem item={item} key={item._id} />)
                  ) : (
                    <Col lg="12">
                      <div className="text-center">Không tìm thấy xe nào</div>
                    </Col>
                  )}
                </>
              )}
            </Row>
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default CarListing;
