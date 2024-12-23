/** @format */

import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CarItem from "../components/UI/CarItem";
import Header from "../components/header/Header";
import Footer from "../components/Footer/Footer";
import { useCarStore } from "../stores/useCarStore";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { fetchCarsByCategory, cars } = useCarStore();
  const { category } = useParams();

  useEffect(() => {
    fetchCarsByCategory(category);
  }, [fetchCarsByCategory, category]);

  return (
    <>
      <Header />
      <Helmet title="Cars">
        <h1 className="text-center mt-3">Các phương tiện {category}</h1>

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

              {Array.isArray(cars) && cars.length > 0 ? (
                cars.map((item) => <CarItem item={item} key={item._id} />)
              ) : (
                <p>Không có phương tiện nào trong danh mục này.</p>
              )}
            </Row>
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default CategoryPage;
