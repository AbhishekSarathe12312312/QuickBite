import express from "express";

import {
  addFood,
  getAllFoods,
  updateFood,
  deleteFood,
  getSingleFood,
} from "../controller/foodController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

// Add Food
router.post("/addFood", authMiddleware, multipleUpload, addFood);

// Get All Foods
router.get("/getAllFoods", getAllFoods);

// Update Food
router.put("/updateFood/:id", authMiddleware, multipleUpload, updateFood);

// Delete Food
router.delete("/deleteFood/:id", deleteFood);

// Get Single Food
router.get("/getSingleFood/:id", getSingleFood);

export default router;
