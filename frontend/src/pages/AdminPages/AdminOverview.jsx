/** @format */
import React, { useEffect, useState } from "react";
import "../../styles/AdminStyle/adminpage.css";

const AdminOverview = () => {
  const [carCount, setCarCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Fetch the total number of cars
    const fetchCarCount = async () => {
      try {
        const response = await fetch("/cars/count");
        const data = await response.json();
        setCarCount(data.count);
      } catch (error) {
        console.error("Error fetching car count:", error);
      }
    };

    // Fetch the total number of users
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users/count");
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchCarCount();
    fetchUserCount();
  }, []);

  return (
    <div className="admin-overview">
      <h2 className="section-title">Tổng quan</h2>
      <div className="admin-overview-cards">
        <div className="admin-overview-card">
          <h3>Tổng số phương tiện</h3>
          <p>{carCount}</p>
        </div>
        <div className="admin-overview-card">
          <h3>Tổng số khách hàng</h3>
          <p>{userCount}</p>
        </div>
        <div className="admin-overview-card">
          <h3>Doanh thu</h3>
          <p>0</p> {/* Replace this with revenue logic */}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
