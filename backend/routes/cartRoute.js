import express from "express";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controller/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add food to cart
router.post("/add", authMiddleware, addToCart);

// Get user's cart
router.get("/", authMiddleware, getCart);

// Update food quantity
router.put("/update", authMiddleware, updateCartQuantity);

// Remove food from cart
router.delete("/remove/:foodId", authMiddleware, removeFromCart);

// Clear entire cart
router.delete("/clear", authMiddleware, clearCart);

export default router;
