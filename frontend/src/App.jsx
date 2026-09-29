import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

import GetAllFoods from "./pages/restaurant/dashboard/GetAllFoods";
import GetSingleFood from "./pages/restaurant/dashboard/GetSingleFood";
import UpdateFood from "./pages/restaurant/dashboard/UpdateFood";
import Navbar from "../components/Navbar";
import RestaurantRegister from "./pages/restaurant/RestaurantRegister";
import RestaurantVerifyOTP from "./pages/restaurant/RestaurantVerifyOTP";
import AddFood from "./pages/restaurant/dashboard/AddFood";
import RestaurantDashboard from "./pages/restaurant/dashboard/RestaurantDashboard";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurant/add-food" element={<AddFood />} />
        <Route path="/get-all-foods" element={<GetAllFoods />} />
        <Route path="/get-single-food" element={<GetSingleFood />} />
        <Route path="/restaurant/update-food" element={<UpdateFood />} />
        <Route path="/register" element={<RestaurantRegister />} />
        <Route
          path="/restaurant/verify-otp"
          element={<RestaurantVerifyOTP />}
        />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;
