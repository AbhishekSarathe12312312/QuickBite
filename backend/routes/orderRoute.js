import express from "express";

import {
  createOrder,
  order,
  verifyPayment,
  
} from "../controller/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);

router.post("/verify-payment", authMiddleware, verifyPayment);

router.get("/order",authMiddleware, order)
export default router;
