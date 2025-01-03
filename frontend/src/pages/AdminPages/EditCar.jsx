/** @format */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarStore } from "../../stores/useCarStore";
import AdminLayout from "../../components/Layout/AdminLayout";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, fetchAllCars, updateCar, loading } = useCarStore();

  const categories = ["Sedan", "SUV", "MPV"]; // Static categories list

  const [carDetails, setCarDetails] = useState({
    name: "",
    brand: "",
    category: "", // This will be updated when car data is fetched
    price: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchAllCars();
  }, [fetchAllCars]);

  useEffect(() => {
    const car = cars.find((car) => car._id === id);
    if (car) {
      setCarDetails(car);
    }
  }, [cars, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarDetails((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCar(id, carDetails); // Update the car with the new details
      navigate("/admin/car-management"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mt-2 mb-4 text-center">
          Chỉnh sửa thông tin phương tiện
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label font-medium">Tên</label>
            <input
              type="text"
              name="name"
              value={carDetails.name}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Tên phương tiện"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-medium">Danh mục</label>
            <select
              name="category"
              value={carDetails.category}
              onChange={handleInputChange}
              className="form-control"
              required>
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label font-medium">Hãng</label>
            <input
              type="text"
              name="brand"
              value={carDetails.brand}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Hãng"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-medium">Giá</label>
            <input
              type="number"
              name="price"
              value={carDetails.price}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Giá"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label font-medium">Mô tả</label>
            <textarea
              name="description"
              value={carDetails.description}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Mô tả phương tiện"
              rows="4"></textarea>
          </div>
          <div className="form-group">
            <label className="form-label font-medium">Hình ảnh</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="form-control"
            />
            {carDetails.image && (
              <img
                src={carDetails.image}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover"
              />
            )}
          </div>
          <button
            type="submit"
            className={`btn btn-success w-full mt-3 mb-3 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditCar;
