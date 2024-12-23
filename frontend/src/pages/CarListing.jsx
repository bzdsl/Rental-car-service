/** @format */

import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CarItem from "../components/UI/CarItem";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";
import { useCarStore } from "../stores/useCarStore";

const CarListing = () => {
  const { cars, fetchAllCars } = useCarStore();

  useEffect(() => {
    fetchAllCars();
  }, [fetchAllCars]);

  return (
    <>
      <Header />
      <Helmet title="Cars">
        <h1 className="text-center mt-3">Danh sách phương tiện</h1>

        <section>
          <Container>
            <Row>
              <Col lg="12">
                <div className="d-flex align-items-center gap-3 mb-5">
                  <span className="d-flex align-items-center gap-2">
                    <i className="ri-sort-asc"></i> Tìm kiếm theo
                  </span>

                  <select>
                    <option>Chọn</option>
                    <option value="low">Thấp đến cao</option>
                    <option value="high">Cao đến thấp</option>
                  </select>
                </div>
              </Col>

              {cars.map((item) => (
                <CarItem item={item} key={item._id} />
              ))}
            </Row>
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default CarListing;
