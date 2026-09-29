import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const RestaurantVerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email not found");
    }

    if (!otp) {
      return toast.error("Please enter OTP");
    }

    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/api/user/verify-otp",
        {
          email,
          otp,
        },
      );

      if (response.data.success) {
        toast.success("Restaurant registration successful");

        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">

        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-gray-900">
            Verify Restaurant
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Enter the OTP sent to your email
          </p>

          {email && (
            <p className="text-sm text-orange-500 mt-2 break-all">
              {email}
            </p>
          )}
        </div>

        <form onSubmit={handleVerifyOTP} className="space-y-5">

          {/* OTP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 text-center text-xl tracking-widest"
            />
          </div>

          {/* VERIFY BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RestaurantVerifyOTP;