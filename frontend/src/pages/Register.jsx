import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SEND OTP =================
  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/user/register",
        {
          name,
          email,
          phone,
          password,
        },
      );

      toast.success(response.data.message);

      setOtpSent(true);
      setOtp("");

      // Scroll to top so Step 2 appears smoothly
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/user/verify-otp",
        {
          email: formData.email,
          otp,
        },
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-cover bg-[center_10%] bg-no-repeat px-4 py-6"
      style={{
        backgroundImage: `url('/image_1.png')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container - Width ko bada karke max-w-xl ya 2xl kiya hai taaki horizontal fit aaye */}
      <div className="relative z-10 w-full max-w-xl my-auto">
    
        {/* ================= CARD ================= */}
        <div
          className="
            rounded
            border border-gray-700/80
            bg-black/40
            shadow-2xl
            backdrop-blur-md
            overflow-hidden
          "
        >
          {/* ================= STEP INDICATOR ================= */}
          <div className="px-6 pt-5">
            <div className="flex items-center justify-center max-w-xs mx-auto">
              {/* Step 1 */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                    otpSent
                      ? "bg-orange-500 text-white"
                      : "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  }`}
                >
                  {otpSent ? "✓" : "1"}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    otpSent ? "text-orange-400" : "text-gray-200"
                  }`}
                >
                  Account
                </span>
              </div>

              {/* Line */}
              <div
                className={`w-16 h-0.5 mx-3 rounded-full transition-all duration-700 ${
                  otpSent ? "bg-orange-500" : "bg-gray-700"
                }`}
              />

              {/* Step 2 */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                    otpSent
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-xs font-semibold ${
                    otpSent ? "text-gray-200" : "text-gray-400"
                  }`}
                >
                  Verify
                </span>
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="p-6 sm:p-8">
            {!otpSent ? (
              /* ==================================================
                  STEP 1 — REGISTRATION (2-Column Horizontal Grid)
              ================================================== */

              <form
                onSubmit={handleRegister}
                className="space-y-4 animate-[fadeIn_0.4s_ease-in-out]"
              >
                <div className="mb-6 text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-white">
                    Create your account
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Enter your details to continue
                  </p>
                </div>

                {/* Grid Container for Horizontal/Side-by-side Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-200 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-3 py-2 bg-gray-800/90 border border-gray-700 rounded-xl text-xs text-white outline-none placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-200 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full px-3 py-2 bg-gray-800/90 border border-gray-700 rounded-xl text-xs text-white outline-none placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-200 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                      className="w-full px-3 py-2 bg-gray-800/90 border border-gray-700 rounded-xl text-xs text-white outline-none placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
                    />
                  </div>

                  {/* Empty space or placeholder if needed, or put password here */}
                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-200 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className="w-full px-3 py-2 bg-gray-800/90 border border-gray-700 rounded-xl text-xs text-white outline-none placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
                    />
                  </div>

                  {/* Confirm Password - Full width or spans nicely */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-200 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      className="w-full px-3 py-2 bg-gray-800/90 border border-gray-700 rounded-xl text-xs text-white outline-none placeholder:text-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
                    />
                  </div>
                </div>

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2.5 rounded-xl text-xs font-bold transition duration-200 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Sending OTP...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            ) : (
              /* ==================================================
                  STEP 2 — OTP VERIFICATION (Compact Center)
              ================================================== */

              <form
                onSubmit={handleVerifyOtp}
                className="space-y-4 max-w-sm mx-auto animate-[slideIn_0.5s_ease-out]"
              >
                <div className="text-center mb-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mb-2">
                    <span className="text-xl">✉️</span>
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    Verify your email
                  </h2>

                  <p className="text-xs text-gray-400 mt-0.5">
                    We sent a 6-digit verification code to
                  </p>

                  <p className="font-semibold text-orange-400 break-all text-xs mt-0.5">
                    {formData.email}
                  </p>
                </div>

                {/* OTP */}
                <div>
                  <label className="block text-xs font-semibold text-gray-200 mb-1.5 text-center">
                    Enter verification code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    autoFocus
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full px-3 py-2.5 text-center text-lg font-bold tracking-[8px] bg-gray-800/90 border border-gray-700 rounded-xl outline-none text-white placeholder:text-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition duration-200"
                  />
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2.5 rounded-xl text-xs font-bold transition duration-200 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                {/* Back */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="w-full text-[11px] font-medium text-gray-400 hover:text-white transition disabled:opacity-50"
                >
                  ← Back to registration
                </button>
              </form>
            )}

            {/* Login Link */}
            {!otpSent && (
              <p className="text-center text-xs text-gray-400 mt-5">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-400 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-300 mt-3 drop-shadow">
          By creating an account, you agree to our terms and privacy policy.
        </p>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
