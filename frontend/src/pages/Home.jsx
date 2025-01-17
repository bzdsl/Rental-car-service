/** @format */

import React, { useEffect } from "react";
import HeroSlider from "../components/UI/HeroSlider";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";
import FindCarForm from "../components/UI/FindCarForm";
import ServicesList from "../components/UI/ServicesList";
import TopRentedCars from "../components/UI/TopRentedCars";
import Category from "../components/UI/Category";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useCarStore } from "../stores/useCarStore";

const Home = () => {
  const { fetchAllCars } = useCarStore();

  useEffect(() => {
    fetchAllCars();
  }, [fetchAllCars]);

  return (
    <>
      <Header />
      <Helmet title="Home">
        {/* ============= hero section =========== */}
        <section className="p-0 hero__slider-section">
          <HeroSlider />
          <div className="hero__form">
            <Container>
              <Row className="form__row">
                <Col>
                  <FindCarForm />
                </Col>
              </Row>
            </Container>
          </div>
        </section>

        {/* =========== Categories section ================= */}
        <section>
          <Container>
            <Row>
              <Col lg="12" className="mb-5 text-center">
                <h6 className="section__subtitle">Các loại xe</h6>
                <h2 className="section__title">
                  Giúp bạn đa dạng hơn trong lựa chọn
                </h2>
              </Col>
              <Category />
            </Row>
          </Container>
        </section>

        {/* =========== Top Rented Cars section ============= */}
        <TopRentedCars />

        {/* ========== services section ============ */}
        <section>
          <Container>
            <Row>
              <Col lg="12" className="mb-5 text-center">
                <h6 className="section__subtitle">Ưu điểm</h6>
                <h2 className="section__title">
                  Những tính năng giúp bạn dễ dàng hơn khi thuê xe
                </h2>
              </Col>
              <ServicesList />
            </Row>
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default Home;
