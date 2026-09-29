import crypto from "crypto";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import razorpay from "../config/razorpay.js";

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.food) {
        return res.status(400).json({
          success: false,
          message: "Some food items are no longer available",
        });
      }

      if (!item.food.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${item.food.name} is currently unavailable`,
        });
      }

      totalAmount += item.food.price * item.quantity;
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `qb_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// Verify Payment & Create QuickBite Order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const existingOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Order already created",
        order: existingOrder,
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.food");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {
      if (!item.food) {
        return res.status(400).json({
          success: false,
          message: "Some food items are no longer available",
        });
      }

      totalAmount += item.food.price * item.quantity;

      orderItems.push({
        food: item.food._id,
        name: item.food.name,
        price: item.food.price,
        quantity: item.quantity,
        image: item.food.images?.[0]?.url || "",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentStatus: "paid",
      orderStatus: "placed",
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
};

// Get Current Order
export const order = async (req, res) => {
  try {
    const order = await Order.findOne({
      user: req.user.id,
      orderStatus: {
        $in: ["placed", "confirmed", "preparing", "out_for_delivery"],
      },
    }).sort({ createdAt: -1 });

    if (!order) {
      return res.status(200).json({
        success: true,
        order: null,
        message: "No active order found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
