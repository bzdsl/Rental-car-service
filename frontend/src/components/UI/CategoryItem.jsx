/** @format */

import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <div className="relative overflow-hidden h-80 w-full rounded-lg group">
      <Link
        to={"/category" + category.href}
        className="no-underline"
        style={{ textDecoration: "none" }}>
        <div className="w-full h-full cursor-pointer relative">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10" />

          {/* Image */}
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            style={{
              aspectRatio: "4/3", // Enforce consistent aspect ratio
              objectFit: "cover", // Maintain aspect ratio within the container
              width: "100%", // Full width
              height: "100%", // Full height
            }}
            loading="lazy"
          />

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: "#000d6b", textDecoration: "none" }}>
              {category.name}
            </h3>
            <p
              className="text-sm"
              style={{ color: "#000d6b", textDecoration: "none" }}>
              Xem thêm
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
