import Cart from "../models/cartModel.js";
import Food from "../models/foodModel.js";

// Add Food to Cart
export const addToCart = async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "Food ID is required",
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    if (!food.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Food is currently unavailable",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // Create cart if not exists
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            food: foodId,
            quantity: 1,
          },
        ],
      });

      await cart.populate("items.food");

      return res.status(201).json({
        success: true,
        message: "Food added to cart",
        cart,
      });
    }

    // Check if food already exists
    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        food: foodId,
        quantity: 1,
      });
    }

    await cart.save();

    await cart.populate("items.food");

    return res.status(200).json({
      success: true,
      message: "Food added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.food");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          items: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update Cart Quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (!foodId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Food ID and quantity are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.food.toString() === foodId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Food not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    await cart.populate("items.food");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Remove Food from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.food.toString() === foodId,
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Food not found in cart",
      });
    }

    cart.items = cart.items.filter((item) => item.food.toString() !== foodId);

    await cart.save();

    await cart.populate("items.food");

    return res.status(200).json({
      success: true,
      message: "Food removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Remove From Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Clear Cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};