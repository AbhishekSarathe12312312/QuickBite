import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getProfile = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        console.log("Profile:", response.data.user);

        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error(
        "Profile Error:",
        error.response?.data?.message || error.message,
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        {
          email,
          password,
        },
      );

      if (response.data.success) {
        const token = response.data.token;

        toast.success("Login successful");

        console.log("Token:", token);
        console.log("User:", response.data.user);

        // Save login data
        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Notify Navbar that user has logged in
        window.dispatchEvent(new Event("authChanged"));

        await getProfile(token);

        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-cover bg-[center_10%] bg-no-repeat px-4"
      style={{
        backgroundImage: `url('/image_1.png')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-sm my-auto">
        {/* ================= LOGIN CARD ================= */}
        <div
          className="
            rounded
            border border-gray-700/80
            bg-black/40
            p-5
            shadow-2xl
            backdrop-blur-md
            sm:p-8
          "
        >
          {/* ================= HEADING ================= */}
          <div className="mb-5 animate-[fadeIn_0.4s_ease-in-out]">
            <h2 className=" font-bold text-white text-3xl">Welcome back 👋</h2>

            <p className="mt-1 text-xs leading-5 text-gray-400 sm:text-sm">
              Sign in to continue to your QuickBite account.
            </p>
          </div>

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleLogin}
            className="space-y-4 animate-[fadeIn_0.4s_ease-in-out]"
          >
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1.5">
                Email Address
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-800/90 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-200">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-purple-400 transition hover:text-purple-300"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔒
                </span>

                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-700 bg-gray-800/90 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-60"
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-2.5 rounded-xl transition duration-200 shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          </form>

          {/* ================= DIVIDER ================= */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-[10px] font-medium text-gray-400">
              NEW TO QUICKBITE?
            </span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* ================= REGISTER ================= */}
          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
              className="text-orange-400 font-semibold hover:underline transition disabled:opacity-50"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* ================= FOOT NOTE ================= */}
        <p className="text-center text-[11px] text-gray-300 mt-4 drop-shadow">
          Secure login for your QuickBite account
        </p>
      </div>

      {/* Animation Style */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
