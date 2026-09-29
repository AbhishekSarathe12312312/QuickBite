import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShoppingCart, Edit, ChevronLeft, ChevronRight } from "lucide-react";

const GetSingleFood = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const foodId = location.state?.foodId;

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // Active image
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Get logged-in user
  const storedUser = localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
  }

  const isRestaurant = user?.role === "restaurant";
  const isCustomer = user?.role === "customer";

  // ================= GET SINGLE FOOD =================

  useEffect(() => {
    if (!foodId) {
      toast.error("Food not found");
      navigate("/get-all-foods");
      return;
    }

    const getSingleFood = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/food/getSingleFood/${foodId}`,
        );

        if (response.data.success) {
          setFood(response.data.food);
          setActiveImageIdx(0);

          console.log("Food:", response.data.food);
          console.log("Images:", response.data.food.images);
        }
      } catch (error) {
        console.error(
          "Get Single Food Error:",
          error.response?.data?.message || error.message,
        );

        toast.error(error.response?.data?.message || "Failed to get food");

        navigate("/get-all-foods");
      } finally {
        setLoading(false);
      }
    };

    getSingleFood();
  }, [foodId, navigate]);

  // ================= ADD TO CART =================

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      setCartLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          foodId: food._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Food added to cart");
        window.dispatchEvent(new Event("cartChanged"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add food to cart",
      );
    } finally {
      setCartLoading(false);
    }
  };

  // ================= PREVIOUS IMAGE =================

  const handlePreviousImage = () => {
    if (!food?.images?.length) return;

    setActiveImageIdx((prev) =>
      prev === 0 ? food.images.length - 1 : prev - 1,
    );
  };

  // ================= NEXT IMAGE =================

  const handleNextImage = () => {
    if (!food?.images?.length) return;

    setActiveImageIdx((prev) =>
      prev === food.images.length - 1 ? 0 : prev + 1,
    );
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>

          <p className="mt-4 font-medium text-gray-500">
            Loading food details...
          </p>
        </div>
      </div>
    );
  }

  if (!food) {
    return null;
  }

  const hasImages = food.images?.length > 0;

  return (
    <div className="min-h-screen bg-gray-950 px-3 py-5 text-white sm:px-4 lg:px-5">
      <div className="mx-auto max-w-5xl">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate("/get-all-foods")}
          className="mb-3.5 flex items-center gap-1.5 text-xs font-semibold text-gray-400 transition hover:text-orange-400"
        >
          <span>←</span>
          Back to Foods
        </button>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-xl">
          <div className="grid gap-4.5 p-4 md:grid-cols-2 md:p-6 lg:p-7">
            {/* ================================================= */}
            {/* LEFT SIDE - IMAGE GALLERY */}
            {/* ================================================= */}
            <div className="flex flex-col gap-3">
              {/* ================= MAIN IMAGE ================= */}
              <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-gray-800 bg-gray-950 md:h-[330px] md:aspect-auto">
                {hasImages ? (
                  <>
                    <img
                      src={food.images[activeImageIdx]?.url}
                      alt={`${food.name} ${activeImageIdx + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {/* Category */}
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full border border-gray-800 bg-gray-900/95 px-3 py-0.5 text-xs font-bold text-orange-400 shadow-sm backdrop-blur-sm">
                        {food.category}
                      </span>
                    </div>

                    {/* Availability */}
                    <div className="absolute bottom-3 left-3">
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 shadow-sm backdrop-blur-sm ${
                          food.isAvailable
                            ? "bg-emerald-500/95 text-white"
                            : "bg-red-500/95 text-white"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                        <span className="text-xs font-bold">
                          {food.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    {/* ================= PREVIOUS BUTTON ================= */}
                    {food.images.length > 1 && (
                      <button
                        type="button"
                        onClick={handlePreviousImage}
                        className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                      >
                        <ChevronLeft size={18} />
                      </button>
                    )}

                    {/* ================= NEXT BUTTON ================= */}
                    {food.images.length > 1 && (
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                      >
                        <ChevronRight size={18} />
                      </button>
                    )}

                    {/* Image Counter */}
                    {food.images.length > 1 && (
                      <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {activeImageIdx + 1} / {food.images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              {/* ================================================= */}
              {/* THUMBNAILS - EKART STYLE */}
              {/* ================================================= */}
              {food.images?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {food.images.map((image, index) => (
                    <button
                      key={image.public_id || index}
                      type="button"
                      onClick={() => setActiveImageIdx(index)}
                      className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 bg-gray-950 transition-all sm:h-16 sm:w-16 ${
                        activeImageIdx === index
                          ? "border-orange-500 ring-2 ring-orange-500/30"
                          : "border-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${food.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ================================================= */}
            {/* RIGHT SIDE */}
            {/* ================================================= */}
            <div className="flex flex-col justify-between py-1">
              <div>
                {/* CATEGORY & STATUS */}
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
                    {food.category}
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      food.isAvailable
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* FOOD NAME */}
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                  {food.name}
                </h1>

                {/* PRICE */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-2xl font-extrabold tracking-tight text-orange-400 md:text-3xl">
                    ₹{food.price}
                  </span>

                  <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                    {food.isAvailable ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-4 border-t border-gray-800 pt-3.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Description
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                    {food.description}
                  </p>
                </div>

                {/* DETAILS */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </p>
                    <p className="mt-1 text-xs font-bold text-white">
                      {food.category}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </p>
                    <p
                      className={`mt-1 text-xs font-bold ${
                        food.isAvailable ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {food.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ================================================= */}
              {/* ACTIONS */}
              {/* ================================================= */}
              <div className="mt-5 border-t border-gray-800 pt-3.5">
                {/* CUSTOMER */}
                {isCustomer && (
                  <>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={!food.isAvailable || cartLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
                    >
                      <ShoppingCart size={17} />
                      {cartLoading
                        ? "Adding to Cart..."
                        : food.isAvailable
                          ? "Add to Cart"
                          : "Unavailable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="mt-3 w-full rounded-lg bg-gray-800 px-5 py-2.5 text-xs font-semibold text-gray-300 transition hover:bg-gray-700 active:scale-[0.98]"
                    >
                      View Cart
                    </button>
                  </>
                )}

                {/* RESTAURANT */}
                {isRestaurant && (
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/restaurant/update-food", {
                          state: { food },
                        })
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                    >
                      <Edit size={17} />
                      Edit Food
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/get-all-foods")}
                      className="flex-1 rounded-lg bg-gray-800 px-4 py-2.5 text-xs font-bold text-gray-300 transition hover:bg-gray-700 active:scale-[0.98]"
                    >
                      Back to Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetSingleFood;
