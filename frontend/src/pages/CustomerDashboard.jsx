import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ShoppingCart,
  Utensils,
  User,
  ArrowRight,
  Clock3,
} from "lucide-react";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-sm font-medium text-orange-400">
                Welcome back 👋
              </p>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Hello, {user.name}
              </h1>

              <p className="mt-2 text-sm text-gray-400">
                Order your favorite food and enjoy a quick delivery.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-2xl font-bold">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Browse Foods */}
          <button
            onClick={() => navigate("/get-all-foods")}
            className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 text-left transition hover:-translate-y-1 hover:border-orange-500/50"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Utensils size={24} />
            </div>

            <h2 className="font-bold">Browse Foods</h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore delicious food from restaurants.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-400">
              Explore
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </div>
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 text-left transition hover:-translate-y-1 hover:border-orange-500/50"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShoppingCart size={24} />
            </div>

            <h2 className="font-bold">My Cart</h2>

            <p className="mt-1 text-sm text-gray-500">
              Check your selected food items.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-400">
              View Cart
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </div>
          </button>

          {/* Orders */}
          <button
            onClick={() => navigate("/orders")}
            className="group rounded-2xl border border-gray-800 bg-gray-900 p-5 text-left transition hover:-translate-y-1 hover:border-orange-500/50"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <ShoppingBag size={24} />
            </div>

            <h2 className="font-bold">My Orders</h2>

            <p className="mt-1 text-sm text-gray-500">
              Track and view your previous orders.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-orange-400">
              View Orders
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </div>
          </button>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Account Information</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Your QuickBite account details
                </p>
              </div>

              <User className="text-orange-400" size={22} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="mt-1 text-sm font-semibold">
                  {user.name || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs text-gray-500">Email</p>
                <p className="mt-1 break-all text-sm font-semibold">
                  {user.email || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="mt-1 text-sm font-semibold">
                  {user.phone || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                <p className="text-xs text-gray-500">Account Type</p>
                <p className="mt-1 text-sm font-semibold capitalize text-orange-400">
                  {user.role || "Customer"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="mt-5 flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95"
            >
              Manage Profile
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Quick Info */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
              <Clock3 size={24} />
            </div>

            <h2 className="text-lg font-bold">QuickBite</h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Discover your favorite meals, add them to your cart, and place
              your order with ease.
            </p>

            <button
              onClick={() => navigate("/get-all-foods")}
              className="mt-6 w-full rounded-xl border border-gray-700 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-orange-500 hover:text-orange-400"
            >
              Start Ordering
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
