/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/Layout/AdminLayout";
import "../../styles/AdminStyle/adminpage.css";
import { useCarStore, formatPrice } from "../../stores/useCarStore";
import CreateCarModal from "../../components/UI/Admin/CreateCarModal";
import { Spinner } from "react-bootstrap";
import axiosInstance from "../../lib/axios";

const CarManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { cars, loading, createCar, deleteCar, searchCars } = useCarStore();
  const navigate = useNavigate();

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [uniqueBrands, setUniqueBrands] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  // Fetch initial metadata (brands and categories)
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data } = await axiosInstance.get("/cars/metadata");
        setUniqueBrands(data.brands);
        setUniqueCategories(data.categories);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchCars({
        searchTerm,
        brand: selectedBrand,
        category: selectedCategory,
      });
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, selectedBrand, selectedCategory, searchCars]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleCreateCar = async (newCar) => {
    try {
      await createCar(newCar);
      searchCars({
        // Refresh search results after creating new car
        searchTerm,
        brand: selectedBrand,
        category: selectedCategory,
      });
      toggleModal();
    } catch (error) {
      console.error("Error creating a car", error);
    }
  };

  const handleEditCar = (carId) => {
    navigate(`/admin/car-management/edit/${carId}`);
  };

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
                  <td>{formatPrice(car.price)}</td>
                  <td>
                    <button
                      onClick={() => handleEditCar(car._id)}
                      className="btn btn-warning admin-edit-btn">
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => {
                        deleteCar(car._id);
                        searchCars({
                          searchTerm,
                          brand: selectedBrand,
                          category: selectedCategory,
                        });
                      }}
                      className="btn btn-danger admin-delete-btn">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có dữ liệu để hiển thị.
                </td>
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
