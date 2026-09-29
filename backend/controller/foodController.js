import Food from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Add Food
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can add food",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const fileUri = getDataUri(file);

      const result = await cloudinary.uploader.upload(fileUri, {
        folder: "quickbite/foods",
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const food = await Food.create({
      name,
      restaurant: req.user.id,
      description,
      price,
      category,
      isAvailable,
      images: uploadedImages,
    });

    return res.status(201).json({
      success: true,
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    console.error("Add Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get All Foods
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.error("Get All Foods Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update Food
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, category, isAvailable, removeImageIds } =
      req.body;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    if (req.user.role !== "restaurant") {
      return res.status(403).json({
        success: false,
        message: "Only restaurants can update food",
      });
    }

    // -----------------------------
    // 1. Remove selected old images
    // -----------------------------
    let imagesToRemove = [];

    if (removeImageIds) {
      try {
        imagesToRemove = JSON.parse(removeImageIds);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid removeImageIds format",
        });
      }
    }

    if (imagesToRemove.length > 0) {
      // Remove images from Cloudinary
      for (const publicId of imagesToRemove) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error(`Cloudinary delete failed for ${publicId}:`, error);
        }
      }

      // Remove images from MongoDB
      food.images = food.images.filter(
        (image) => !imagesToRemove.includes(image.public_id),
      );
    }

    // -----------------------------
    // 2. Check total image limit
    // -----------------------------
    const existingImageCount = food.images.length;
    const newImageCount = req.files?.length || 0;

    if (existingImageCount + newImageCount > 5) {
      return res.status(400).json({
        success: false,
        message: `Maximum 5 images allowed. You currently have ${existingImageCount} images.`,
      });
    }

    // -----------------------------
    // 3. Update food details
    // -----------------------------
    food.name = name;
    food.description = description;
    food.price = price;
    food.category = category;
    food.isAvailable = isAvailable;

    // -----------------------------
    // 4. Upload new images
    // -----------------------------
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        const fileUri = getDataUri(file);

        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "quickbite/foods",
        });

        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      // Add new images without deleting old ones
      food.images.push(...uploadedImages);
    }

    // -----------------------------
    // 5. Save food
    // -----------------------------
    const updatedFood = await food.save();

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error("Update Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete Food
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.error("Delete Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Single Food
export const getSingleFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.error("Get Single Food Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
