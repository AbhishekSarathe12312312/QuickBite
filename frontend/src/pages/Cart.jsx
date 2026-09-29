import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // =========================
  // Checkout
  // =========================
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      // Create Razorpay Order
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/order/create-order`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        toast.error("Failed to create order");
        return;
      }

      const razorpayOrder = response.data.order;

      // Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "QuickBite",

        description: "Food Order",

        order_id: razorpayOrder.id,

        // =========================
        // Payment Success Handler
        // =========================
        handler: async function (paymentResponse) {
          try {
            console.log("Payment Response:", paymentResponse);

            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/order/verify-payment`,
              {
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            // Payment verified successfully
            if (verifyResponse.data.success) {
              toast.success("Payment successful");

              // Backend already clears the cart
              setCart({ items: [] });

              // Update cart count in navbar
              window.dispatchEvent(new Event("cartChanged"));

              // Go to Orders page
              navigate("/orders");
            }
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error.response?.data?.message || error.message,
            );

            toast.error(
              error.response?.data?.message ||
                "Payment verification failed",
            );
          }
        },

        // Razorpay theme
        theme: {
          color: "#f97316",
        },
      };

      // Create Razorpay instance
      const razorpay = new window.Razorpay(options);

      // Open Razorpay Checkout
      razorpay.open();
    } catch (error) {
      console.error(
        "Checkout Error:",
        error.response?.data?.message || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to start checkout",
      );
    }
  };

  // =========================
  // Get Cart
  // =========================
  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load cart",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // Update Quantity
  // =========================
  const updateQuantity = async (foodId, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        {
          foodId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setCart(response.data.cart);

        window.dispatchEvent(
          new Event("cartChanged"),
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update quantity",
      );
    }
  };

  // =========================
  // Remove Item
  // =========================
  const removeItem = async (foodId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${foodId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setCart(response.data.cart);

        toast.success("Food removed from cart");

        window.dispatchEvent(
          new Event("cartChanged"),
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove food",
      );
    }
  };

  // =========================
  // Clear Cart
  // =========================
  const clearCart = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/clear`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setCart(response.data.cart);

        toast.success("Cart cleared");

        window.dispatchEvent(
          new Event("cartChanged"),
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to clear cart",
      );
    }
  };

  // =========================
  // Calculate Total
  // =========================
  const totalPrice = cart.items.reduce(
    (total, item) => {
      return (
        total +
        item.food.price * item.quantity
      );
    },
    0,
  );

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Loading cart...
      </div>
    );
  }

  // =========================
  // Empty Cart
  // =========================
  if (
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
        <ShoppingCart
          size={70}
          className="mb-5 text-gray-600"
        />

        <h1 className="text-3xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="mt-2 text-gray-400">
          Add some delicious food to your cart.
        </p>
      </div>
    );
  }

  // =========================
  // Cart UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Your Cart
            </h1>

            <p className="mt-1 text-gray-400">
              Review your items before checkout
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <div
                key={item.food._id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:flex-row sm:items-center"
              >

                {/* Image */}
                <div className="h-28 w-full overflow-hidden rounded-xl sm:h-24 sm:w-24">
                  <img
                    src={
                      item.food.images?.[0]?.url
                    }
                    alt={item.food.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Food Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {item.food.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {item.food.category}
                  </p>

                  <p className="mt-2 font-semibold text-orange-400">
                    ₹{item.food.price}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.food._id,
                        item.quantity - 1,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition hover:bg-gray-700"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.food._id,
                        item.quantity + 1,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800 transition hover:bg-gray-700"
                  >
                    <Plus size={16} />
                  </button>

                </div>

                {/* Item Total */}
                <div className="min-w-20 text-right">

                  <p className="font-bold">
                    ₹
                    {item.food.price *
                      item.quantity}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.food._id)
                    }
                    className="mt-2 text-red-400 transition hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-gray-800 pb-5">

              <div className="flex justify-between text-gray-400">
                <span>Items</span>

                <span>
                  {cart.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0,
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>

                <span>
                  ₹{totalPrice}
                </span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Delivery</span>

                <span>₹0</span>
              </div>

            </div>

            <div className="mt-5 flex justify-between text-lg font-bold">
              <span>Total</span>

              <span className="text-orange-400">
                ₹{totalPrice}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Proceed to Checkout
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;