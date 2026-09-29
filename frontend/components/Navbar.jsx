import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Navbar scroll state
  const [showNavbar, setShowNavbar] = useState(true);

  // =========================
  // Check Logged-in User
  // =========================
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Invalid user data:", error);

          localStorage.removeItem("user");

          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("authChanged", checkUser);

    return () => {
      window.removeEventListener("authChanged", checkUser);
    };
  }, []);

  // =========================
  // Cart Count
  // =========================
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token || user?.role !== "customer") {
          setCartCount(0);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const items = response.data.cart?.items || [];

          const count = items.reduce((total, item) => total + item.quantity, 0);

          setCartCount(count);
        }
      } catch (error) {
        console.error("Cart Count Error:", error);
      }
    };

    fetchCartCount();

    window.addEventListener("cartChanged", fetchCartCount);

    return () => {
      window.removeEventListener("cartChanged", fetchCartCount);
    };
  }, [user]);

  // =========================
  // Navbar Scroll Animation
  // =========================
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Top of page → always show navbar
      if (currentScrollY <= 10) {
        setShowNavbar(true);
      }
      // Scrolling down → hide navbar
      else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      }
      // Scrolling up → show navbar
      else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // Logout
  // =========================
  const handleLogout = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (token) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);

      window.dispatchEvent(new Event("authChanged"));

      toast.success("Logout successful");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b border-gray-800 bg-[#0b0f19]/95 shadow-sm backdrop-blur-md transition-transform duration-300 ease-in-out ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-md shadow-orange-200">
              <span className="text-xl">🍔</span>
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-orange-500">
              QuickBite
            </span>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden items-center gap-8 md:flex">
            {/* CUSTOMER LINKS */}
            {user?.role === "customer" && (
              <>
                <Link
                  to="/"
                  className="font-medium text-gray-300 transition hover:text-orange-500"
                >
                  Home
                </Link>

                <Link
                  to="/get-all-foods"
                  className="font-medium text-gray-300 transition hover:text-orange-500"
                >
                  Foods
                </Link>

                <Link
                  to="/orders"
                  className="font-medium text-gray-300 transition hover:text-orange-500"
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-800 bg-[#131b2e] text-gray-300 transition hover:border-orange-500 hover:text-orange-500"
                >
                  <ShoppingCart size={21} />

                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* RESTAURANT LINKS */}
            {user?.role === "restaurant" && (
              <>
                <Link
                  to="/restaurant/dashboard"
                  className="font-medium text-gray-300 transition hover:text-orange-500"
                >
                  Dashboard
                </Link>

                <Link
                  to="/get-all-foods"
                  className="font-medium text-gray-300 transition hover:text-orange-500"
                >
                  My Foods
                </Link>

                <Link
                  to="/orders"
                  className="font-medium text-gray-300 transition hover:text-orange-500"
                >
                  Orders
                </Link>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* USER PROFILE */}
                <div className="mr-2 hidden items-center gap-2 rounded-full border border-gray-800 bg-[#131b2e] px-3 py-1.5 sm:flex">
                  <Link to="/profile" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-pink-900/40">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-pink-400">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>

                    <span className="text-sm font-semibold text-gray-200">
                      Hello, <span className="text-white">{user.name}</span>
                    </span>
                  </Link>
                </div>

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <span>↪</span>
                      Logout
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <Link
                  to="/login"
                  className="rounded-xl border border-pink-600 px-4 py-2.5 font-semibold text-pink-500 transition hover:bg-pink-950/30"
                >
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  to="/register"
                  className="hidden rounded-xl bg-pink-600 px-4 py-2.5 font-semibold text-white shadow-md shadow-pink-900/20 transition hover:bg-pink-700 sm:block"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
