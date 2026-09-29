import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const Order = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const response = await axios.get(
        "http://localhost:8000/api/order/order",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setOrder(response.data.order || null);
      }
    } catch (error) {
      console.error(
        "Fetch Order Error:",
        error.response?.data?.message || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load order",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "placed":
        return <Package size={18} />;

      case "confirmed":
        return <CheckCircle2 size={18} />;

      case "preparing":
        return <Clock size={18} />;

      case "out_for_delivery":
        return <Truck size={18} />;

      case "delivered":
        return <CheckCircle2 size={18} />;

      case "cancelled":
        return <XCircle size={18} />;

      default:
        return <Package size={18} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "placed":
        return "Order Placed";

      case "confirmed":
        return "Confirmed";

      case "preparing":
        return "Preparing";

      case "out_for_delivery":
        return "Out for Delivery";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-orange-500" />

          <p className="mt-4 text-gray-400">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
        <ShoppingBag
          size={75}
          className="mb-5 text-gray-600"
        />

        <h1 className="text-3xl font-bold">
          No Active Order
        </h1>

        <p className="mt-2 text-center text-gray-400">
          You don't have any active order right now.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
              <Package size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Current Order
              </h1>

              <p className="mt-1 text-gray-400">
                Track your QuickBite order
              </p>
            </div>
          </div>
        </div>

        {/* Order Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900">

          {/* Order Header */}
          <div className="flex flex-col gap-4 border-b border-gray-800 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Order ID
              </p>

              <p className="mt-1 font-mono text-sm text-gray-300">
                #{order._id.slice(-8)}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400">
              {getStatusIcon(order.orderStatus)}

              {getStatusText(order.orderStatus)}
            </div>
          </div>

          {/* Order Tracking */}
          <div className="border-b border-gray-800 p-5 sm:p-6">

            <h2 className="mb-6 text-lg font-bold">
              Order Status
            </h2>

            <div className="grid gap-4 sm:grid-cols-4">

              {[
                "placed",
                "confirmed",
                "preparing",
                "out_for_delivery",
              ].map((status) => {

                const statusOrder = [
                  "placed",
                  "confirmed",
                  "preparing",
                  "out_for_delivery",
                ];

                const currentIndex =
                  statusOrder.indexOf(order.orderStatus);

                const statusIndex =
                  statusOrder.indexOf(status);

                const completed =
                  currentIndex >= statusIndex;

                return (
                  <div
                    key={status}
                    className={`rounded-2xl border p-4 ${
                      completed
                        ? "border-orange-500/30 bg-orange-500/5"
                        : "border-gray-800 bg-gray-950"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${
                        completed
                          ? "bg-orange-500 text-white"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {getStatusIcon(status)}
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        completed
                          ? "text-orange-400"
                          : "text-gray-500"
                      }`}
                    >
                      {getStatusText(status)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="p-5 sm:p-6">

            <h2 className="mb-5 text-lg font-bold">
              Order Items
            </h2>

            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={`${order._id}-${index}`}
                  className="flex gap-4 rounded-2xl border border-gray-800 bg-gray-950 p-4"
                >
                  {/* Image */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-800 sm:h-24 sm:w-24">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-600">
                        <ShoppingBag size={28} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      ₹{item.price} × {item.quantity}
                    </p>

                    <p className="mt-2 font-semibold text-orange-400">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-5 border-t border-gray-800 bg-gray-950/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div>
              <p className="text-sm text-gray-500">
                Payment Status
              </p>

              <p
                className={`mt-1 font-semibold capitalize ${
                  order.paymentStatus === "paid"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {order.paymentStatus}
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Razorpay
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-400">
                Total Amount
              </p>

              <p className="mt-1 text-2xl font-extrabold text-orange-500">
                ₹
                {Number(
                  order.totalAmount,
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Order;