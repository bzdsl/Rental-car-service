/** @format */

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import CarItem from "./CarItem";
import { useCarStore } from "../../stores/useCarStore";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";

const TopRentedCars = () => {
  const [topCars, setTopCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cars, loading: carsLoading } = useCarStore();

  useEffect(() => {
    const fetchTopRentedCars = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/revenues/most-rented");
        let finalCars = [];

        if (response.data.length < 6) {
          // Get the IDs of top rented cars to exclude them from random selection
          const topCarIds = response.data.map((item) => item.carDetails._id);

          // Filter out already selected cars
          const availableCars = cars.filter(
            (car) => !topCarIds.includes(car._id)
          );

          // Calculate how many random cars we need
          const remainingCount = 6 - response.data.length;

          // Get random cars
          const randomCars = [];
          for (let i = 0; i < remainingCount && availableCars.length > 0; i++) {
            const randomIndex = Math.floor(
              Math.random() * availableCars.length
            );
            randomCars.push(availableCars[randomIndex]);
            availableCars.splice(randomIndex, 1);
          }

          // Combine top rented cars with random cars
          finalCars = [
            ...response.data.map((item) => item.carDetails),
            ...randomCars,
          ];
        } else {
          finalCars = response.data.slice(0, 6).map((item) => item.carDetails);
        }

        setTopCars(finalCars);
      } catch (error) {
        console.error("Error fetching top rented cars:", error);
        toast.error("Không thể tải danh sách xe");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch top rented cars if we have the base cars loaded
    if (cars.length > 0 && !carsLoading) {
      fetchTopRentedCars();
    }
  }, [cars, carsLoading]);

  if (loading || carsLoading) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h6 className="section__subtitle">Đang tải...</h6>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="text-center mb-5">
            <h6 className="section__subtitle">Hot deals</h6>
            <h2 className="section__title">
              Những chiếc xe được ưa chuộng nhất
            </h2>
          </Col>

          {topCars.map((item) => (
            <CarItem item={item} key={item._id} />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TopRentedCars;
