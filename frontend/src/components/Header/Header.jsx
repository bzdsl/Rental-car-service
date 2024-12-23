/** @format */

import React, { useState } from "react";
import {
  Container,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../../styles/header.css";
import { useUserStore } from "../../stores/useUserStore";

const navLinks = [
  { path: "/home", display: "Trang chủ" },
  { path: "/cars", display: "Phương tiện" },
  { path: "/contact", display: "Liên hệ" },
];

const Header = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();

  // Toggle for dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  // Toggle for mobile menu
  const toggleMobileMenu = () => setMenuActive(!menuActive);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            {/* Mobile Menu Toggler */}
            <span className="mobile__menu" onClick={toggleMobileMenu}>
              <i className="ri-menu-line"></i>
            </span>

            {/* Navigation Links */}
            <div className={`navigation ${menuActive ? "menu__active" : ""}`}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    key={index}
                    className={({ isActive }) =>
                      isActive ? "nav__active nav__item" : "nav__item"
                    }>
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* User Account / Auth Buttons */}
            <div className="nav__right">
              <div className="header__buttons d-flex justify-content-end">
                {isAdmin && (
                  <Col className="d-flex align-items-center">
                    <Button className="header__btn" tag={Link} to="/admin">
                      Quản lý
                    </Button>
                  </Col>
                )}

                {user ? (
                  <Col className="d-flex align-items-center">
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret className="header__btn">
                        {user.name || "Tài khoản"}
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem tag={Link} to="/profile">
                          Thông tin cá nhân
                        </DropdownItem>
                        <DropdownItem tag={Link} to="/rental-info">
                          Thông tin thuê xe
                        </DropdownItem>
                        <DropdownItem onClick={handleLogout}>
                          Đăng xuất
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                ) : (
                  <>
                    <Col className="d-flex align-items-center justify-content-end flex-row">
                      <Button
                        className="header__btn no-wrap-button"
                        tag={Link}
                        to="/login">
                        Đăng nhập
                      </Button>
                      <Button
                        className="header__btn no-wrap-button"
                        tag={Link}
                        to="/register">
                        Đăng ký
                      </Button>
                    </Col>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
