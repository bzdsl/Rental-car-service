/** @format */

/** @format */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import CarListing from "../pages/CarListing";
import CarDetails from "../pages/CarDetails";
import Profile from "../pages/Profile";
import RentalInfo from "../pages/RentalInfo";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminPage from "../pages/AdminPages/AdminPage";
import CarManagement from "../pages/AdminPages/CarManagement";
import UserManagement from "../pages/AdminPages/UserManagement";
import RentManagement from "../pages/AdminPages/RentManagement";
import Checkout from "../pages/Checkout";
import EditUserProfile from "../pages/AdminPages/EditUserProfile";
import EditCar from "../pages/AdminPages/EditCar";
import CategoryPage from "../pages/CategoryPage";
import UserEditBooking from "../pages/UserEditBooking";
import PaymentSuccess from "../pages/PaymentSuccess";
import { useUserStore } from "../stores/useUserStore";
import EditBooking from "../pages/AdminPages/EditBooking";
import RevenueManagement from "../pages/AdminPages/RevenueManagement";
import CouponsManagement from "../pages/AdminPages/CouponsManagement";
import CouponForm from "../components/UI/Admin/CouponForm";

import SearchResults from "../pages/SearchResults";

// Router

const Routers = () => {
  const { user } = useUserStore();

  return (
    <Routes>
      {/* User routes */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cars" element={<CarListing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cars/:slug" element={<CarDetails />} />
      <Route path="/checkout/:slug" element={<Checkout />} />
      <Route path="/category/:category" element={<CategoryPage />} />

      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/rental-info"
        element={user ? <RentalInfo /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/home" />}
      />
      <Route
        path="/user-edit-booking/:bookingId"
        element={<UserEditBooking />}
      />

      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate to={user?.role === "admin" ? "/admin" : "/home"} />
          )
        }
      />
      <Route path="/search-results" element={<SearchResults />} />

      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/checkout/:slug" element={<Checkout />} />
      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          user?.role === "admin" ? (
            <AdminPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/home" element={<Home />} />
      <Route path="/admin/car-management" element={<CarManagement />} />
      <Route path="/admin/user-management" element={<UserManagement />} />
      <Route
        path="/admin/user-management/edit/:userId"
        element={<EditUserProfile />}
      />
      <Route path="/admin/car-management/edit/:id" element={<EditCar />} />
      <Route path="/admin/rent-management" element={<RentManagement />} />
      <Route
        path="/admin/rent-management/:edit/:id"
        element={<EditBooking />}
      />
      <Route path="/admin/revenue-management" element={<RevenueManagement />} />
      <Route path="/admin/coupon-management" element={<CouponsManagement />} />
      <Route path="/admin/coupon-management/create" element={<CouponForm />} />
      <Route
        path="/admin/coupon-management/edit/:id"
        element={<CouponForm />}
      />
    </Routes>
  );
};

export default Routers;
