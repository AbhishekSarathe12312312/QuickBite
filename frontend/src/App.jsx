import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import GetAllFoods from "./pages/GetAllFoods";
import GetSingleFood from "./pages/GetSingleFood";
import UpdateFood from "./pages/UpdateFood";

import Navbar from "../components/Navbar";
import AddFood from "./pages/AddFood";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import ForgotPassword from "./pages/ForgotPassword";
import CursorFollower from "../components/CursorFollower";
import ProtectedRoute from "../components/ProtectedRoute";
import RestaurantRegister from "./pages/RestaurantRegister";
import RestaurantProfile from "./pages/RestaurantProfile";
import CustomerProfile from "./pages/CustomerProfile";
import CustomerDashboard from "./pages/CustomerDashboard";

const App = () => {
  return (
    <>
      <Navbar />
      <CursorFollower />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/restaurant/verify-otp" element={<RestaurantRegister />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/get-all-foods" element={<GetAllFoods />} />

        <Route path="/get-single-food" element={<GetSingleFood />} />

        {/* Customer Protected Routes */}

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/profile"
          element={
            <ProtectedRoute role="customer">
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

    

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="customer">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <Order />
            </ProtectedRoute>
          }
        />
       

        {/* Restaurant Protected Routes */}

        <Route path="/restaurant/register" element={<RestaurantRegister />} />

        <Route
          path="/restaurant/dashboard"
          element={
            <ProtectedRoute role="restaurant">
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/add-food"
          element={
            <ProtectedRoute role="restaurant">
              <AddFood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/update-food"
          element={
            <ProtectedRoute role="restaurant">
              <UpdateFood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/profile"
          element={
            <ProtectedRoute role="restaurant">
              <RestaurantProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
