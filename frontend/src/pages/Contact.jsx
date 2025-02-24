/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Input } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../styles/contact.css";

const socialLinks = [
  {
    url: "#",
    icon: "ri-facebook-line",
  },
  {
    url: "#",
    icon: "ri-instagram-line",
  },
  {
    url: "#",
    icon: "ri-linkedin-line",
  },
  {
    url: "#",
    icon: "ri-twitter-line",
  },
];

const Contact = () => {
  return (
    <>
      <Header />
      <Helmet title="Contact">
        <section>
          <Container>
            <Row>
              <Col lg="7" md="7">
                <h6 className="fw-bold mb-4">Liên hệ với chúng tôi</h6>

                <Form>
                  <FormGroup className="contact__form">
                    <Input placeholder="Nhập tên của bạn" type="text" />
                  </FormGroup>
                  <FormGroup className="contact__form">
                    <Input placeholder="Email" type="email" />
                  </FormGroup>
                  <FormGroup className="contact__form">
                    <textarea
                      rows="5"
                      placeholder="Lời nhắn của bạn"
                      className="textarea form-control w-100"></textarea>
                  </FormGroup>

                  <button className=" contact__btn" type="submit">
                    Gửi lời nhắn
                  </button>
                </Form>
              </Col>

              <Col lg="5" md="5">
                <div className="contact__info">
                  <h6 className="fw-bold">Thông tin liên hệ</h6>
                  <p className="section__description mb-0">
                    Quận Nam Từ Liêm, Thành phố Hà Nội
                  </p>
                  <div className=" d-flex align-items-center gap-2">
                    <h6 className="fs-6 mb-0">Phone:</h6>
                    <p className="section__description mb-0">+84 12345678</p>
                  </div>

                  <div className=" d-flex align-items-center gap-2">
                    <h6 className="mb-0 fs-6">Email:</h6>
                    <p className="section__description mb-0">
                      bzdsl.producer@gmail.com
                    </p>
                  </div>

                  <h6 className="fw-bold mt-4">Follow Us</h6>

                  <div className=" d-flex align-items-center gap-4 mt-3">
                    {socialLinks.map((item, index) => (
                      <Link
                        to={item.url}
                        key={index}
                        className="social__link-icon">
                        <i className={item.icon}></i>
                      </Link>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
      <Footer />
    </>
  );
};

export default Contact;
