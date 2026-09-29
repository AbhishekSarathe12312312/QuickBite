import express from "express";

import {
  registerUser,
  verifyOTP,
  loginUser,
  getProfile,
  logoutUser,
  registerRestaurant,
  updateProfile,
  forgotPassword,
  verifyForgotPasswordOTP,
  changePassword,
} from "../controller/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

// ================= CUSTOMER AUTH =================

router.post("/register", registerUser);

router.post("/verify-otp", verifyOTP);

router.post("/login", loginUser);

// ================= FORGOT PASSWORD =================

router.post("/forgot-password", forgotPassword);

router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);

router.post("/change-password", changePassword);

// ================= PROFILE =================

router.get("/profile", authMiddleware, getProfile);

router.put("/update-profile", authMiddleware, singleUpload, updateProfile);

router.post("/logout", authMiddleware, logoutUser);

// ================= RESTAURANT =================

router.post("/restaurant/register", registerRestaurant);

export default router;
