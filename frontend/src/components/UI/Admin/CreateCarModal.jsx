/** @format */

import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

const categories = ["Sedan", "SUV", "MPV"];

const CreateCarModal = ({ isOpen, toggle, onSubmit, loading }) => {
  const [newCar, setNewCar] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    description: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewCar((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewCar((prevCar) => ({ ...prevCar, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file); // Base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newCar);
    setNewCar({
      name: "",
      category: "",
      brand: "",
      price: "",
      description: "",
      image: "",
    });
    setImagePreview("");
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Thêm phương tiện mới</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Tên phương tiện</Label>
            <Input
              id="name"
              type="text"
              value={newCar.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="brand">Hãng</Label>
            <Input
              id="brand"
              type="text"
              value={newCar.brand}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">Giá</Label>
            <Input
              id="price"
              type="text"
              value={newCar.price}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="category">Danh mục</Label>
            <Input
              id="category"
              type="select"
              value={newCar.category}
              onChange={handleInputChange}
              required>
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="description">Mô tả</Label>
            <Input
              id="description"
              type="textarea"
              value={newCar.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="image">Hình ảnh</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </FormGroup>
          <Button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Đang xử lý..." : "Thêm phương tiện"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateCarModal;
