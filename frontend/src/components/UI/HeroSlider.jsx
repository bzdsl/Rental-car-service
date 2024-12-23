/** @format */

import React from "react";
import Slider from "react-slick";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";
import "../../styles/hero-slider.css";

const slideData = [
  {
    title: "Thuê xe ngay",
    heading: "ilorem ipsum dolor sit amet consectetur.",
    buttonText: "Thuê xe",
    link: "/cars",
  },
  {
    title: "Thuê xe ngay",
    heading: "ilorem ipsum dolor sit amet consectetur.",
    buttonText: "Thuê xe",
    link: "/cars",
  },
  {
    title: "Thuê xe ngay",
    heading: "ilorem ipsum dolor sit amet consectetur.",
    buttonText: "Thuê xe",
    link: "/cars",
  },
  // Add more slides as needed
];

const HeroSlider = () => {
  const settings = {
    fade: true,
    speed: 3000,
    autoplaySpeed: 5000,
    infinite: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };

  return (
    <Slider {...settings} className="hero__slider">
      {slideData.map((slide, index) => (
        <div
          key={index}
          className={`slider__item slider__item-0${index + 1} mt0`}>
          <Container>
            <div className="slider__content">
              <h4 className="text-light  mb-1">{slide.title}</h4>
              <h1 className="text-light mb-2">{slide.heading}</h1>
              <button className="btn reserve__btn mt-6 w-32">
                <Link to={slide.link}>{slide.buttonText}</Link>
              </button>
            </div>
          </Container>
        </div>
      ))}
    </Slider>
  );
};

export default HeroSlider;
