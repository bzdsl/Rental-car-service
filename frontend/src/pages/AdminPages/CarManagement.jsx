/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import AdminLayout from "../../components/Layout/AdminLayout";
import "../../styles/AdminStyle/adminpage.css";
import { useCarStore } from "../../stores/useCarStore";
import CreateCarModal from "../../components/UI/Admin/CreateCarModal";
import { Spinner } from "react-bootstrap"; // Import Spinner

const CarManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { cars, loading, fetchAllCars, createCar, deleteCar } = useCarStore();
  const navigate = useNavigate();

  // Fetch data from the backend when the component renders
  useEffect(() => {
    fetchAllCars();
  }, [fetchAllCars]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateCar = async (newCar) => {
    try {
      await createCar(newCar);
      fetchAllCars(); // Refresh the list after adding a new car
      toggleModal(); // Close the modal after successful addition
    } catch (error) {
      console.error("Error creating a car", error);
    }
  };

  const handleEditCar = (carId) => {
    navigate(`/admin/car-management/edit/${carId}`); // Redirect to the car edit page
  };

  return (
    <AdminLayout>
      <div className="admin-section mt-5">
        <h1 className="section-title">Quản lý phương tiện</h1>
        <button className="btn btn-primary admin-add-btn" onClick={toggleModal}>
          Thêm phương tiện mới
        </button>

        <table className="table admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Hình ảnh</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Hãng</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "400px" }}>
                    <Spinner animation="border" variant="primary" />
                  </div>
                </td>
              </tr>
            ) : cars && cars.length > 0 ? (
              cars.map((car, index) => (
                <tr key={car._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      className="admin-car-image"
                      src={car.image}
                      alt={car.name}
                    />
                  </td>
                  <td>{car.name}</td>
                  <td>{car.category}</td>
                  <td>{car.brand}</td>
                  <td>{car.price}</td>
                  <td>
                    <button
                      onClick={() => handleEditCar(car._id)}
                      className="btn btn-warning admin-edit-btn">
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => deleteCar(car._id)}
                      className="btn btn-danger admin-delete-btn">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không có dữ liệu để hiển thị.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding a new vehicle */}
      <CreateCarModal
        isOpen={modalOpen}
        toggle={toggleModal}
        onSubmit={handleCreateCar}
        loading={loading}
      />
    </AdminLayout>
  );
};

export default CarManagement;
