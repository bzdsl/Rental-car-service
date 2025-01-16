/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import "../../styles/AdminStyle/adminpage.css";
import { useCarStore, formatPrice } from "../../stores/useCarStore";
import CreateCarModal from "../../components/UI/Admin/CreateCarModal";
import { Spinner } from "react-bootstrap";

const CarManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { cars, loading, fetchAllCars, createCar, deleteCar } = useCarStore();
  const navigate = useNavigate();

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get unique brands and categories for filters
  const uniqueBrands = [...new Set(cars?.map((car) => car.brand) || [])];
  const uniqueCategories = [...new Set(cars?.map((car) => car.category) || [])];

  useEffect(() => {
    fetchAllCars();
  }, [fetchAllCars]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateCar = async (newCar) => {
    try {
      await createCar(newCar);
      fetchAllCars();
      toggleModal();
    } catch (error) {
      console.error("Error creating a car", error);
    }
  };

  const handleEditCar = (carId) => {
    navigate(`/admin/car-management/edit/${carId}`);
  };

  // Filter cars based on search criteria
  const filteredCars = cars?.filter((car) => {
    const matchesSearch = car.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || car.brand === selectedBrand;
    const matchesCategory =
      !selectedCategory || car.category === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="admin-section mt-5">
        <h1 className="section-title">Quản lý phương tiện</h1>

        {/* Search and Filter Section */}
        <div className="search-filter-container mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm theo tên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}>
                <option value="">Tất cả hãng xe</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Tất cả danh mục</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
            ) : filteredCars && filteredCars.length > 0 ? (
              filteredCars.map((car, index) => (
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
                  <td>{formatPrice(car.price)}</td>
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
