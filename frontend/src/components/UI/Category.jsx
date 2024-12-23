/** @format */

import React from "react";
import { Container } from "reactstrap";
import CategoryItem from "./CategoryItem";
import "../../styles/category.css";

// Images imported directly
// import sedanImage from "../../assets/all-images/cars-img/bmw-offer.png";
// import suvImage from "../../assets/all-images/cars-img/mercedes-offer.png";
// import mpvImage from "../../assets/all-images/cars-img/nissan-offer.png";

import sedanImage from "../../assets/cars-img/Sedan/c300.jpg";
import suvImage from "../../assets/cars-img/SUV/everest.jpeg";
import mpvImage from "../../assets/cars-img/MPV/veloz.jpg";

// Categories Array
const categories = [
  {
    href: "/Sedan",
    name: "Sedan",
    imageUrl: sedanImage,
  },
  {
    href: "/SUV",
    name: "SUV",
    imageUrl: suvImage,
  },
  {
    href: "/MPV",
    name: "MPV",
    imageUrl: mpvImage,
  },
];

const Category = () => {
  return (
    <section className="category-section">
      <Container>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Category;
