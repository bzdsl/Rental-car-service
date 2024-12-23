/** @format */

import React from "react";
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

const ForgotPassword = ({ isOpen, toggleForgotPassword }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggleForgotPassword}>
      <ModalHeader toggle={toggleForgotPassword}>Quên mật khẩu</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn"
              required
            />
          </FormGroup>
          <FormGroup>
            <Button className="btn-reset-password" type="submit">
              Gửi yêu cầu
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ForgotPassword;
