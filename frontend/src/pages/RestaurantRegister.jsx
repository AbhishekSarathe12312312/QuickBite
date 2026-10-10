import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Store, Mail, Phone, Lock, UserRound } from "lucide-react";

const RestaurantRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Handle Register
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/restaurant/register`,
        formData,
      );

      if (response.data.success) {
        toast.success(response.data.message || "OTP sent to your email");

        navigate("/restaurant/dashboard", {
          state: {
            email: formData.email,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Restaurant registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] px-4 pb-16 pt-28 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* =========================
            LEFT SECTION
        ========================= */}
        <div className="hidden lg:block">
          <div className="max-w-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 shadow-xl shadow-orange-500/20">
              <Store size={32} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
              QuickBite Partner
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Grow your restaurant
              <span className="block text-orange-500">with QuickBite.</span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-gray-400">
              Join QuickBite and start managing your food items, orders, and
              restaurant business from one place.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                  ✓
                </div>
                Easy food management
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                  ✓
                </div>
                Manage your orders
              </div>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                  ✓
                </div>
                Grow your online presence
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            REGISTER CARD
        ========================= */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-gray-800 bg-[#101722] p-7 shadow-2xl shadow-black/30 sm:p-8">
            {/* MOBILE ICON */}
            <div className="mb-6 flex justify-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">
                <Store size={28} />
              </div>
            </div>

            {/* HEADER */}
            <div className="mb-7 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white">
                Register your restaurant
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Create your restaurant account to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* RESTAURANT NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Restaurant Name
                </label>

                <div className="relative">
                  <Store
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                    className="w-full rounded-xl border border-gray-700 bg-[#0b111c] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                    className="w-full rounded-xl border border-gray-700 bg-[#0b111c] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full rounded-xl border border-gray-700 bg-[#0b111c] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-xl border border-gray-700 bg-[#0b111c] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* REGISTER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:bg-orange-600 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <UserRound size={19} />
                    Create Restaurant Account
                  </>
                )}
              </button>
            </form>

            {/* INFO */}
            <div className="mt-6 rounded-xl border border-orange-500/10 bg-orange-500/5 p-3.5">
              <p className="text-center text-xs leading-5 text-gray-400">
                After registration, an OTP will be sent to your email for
                verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister;
