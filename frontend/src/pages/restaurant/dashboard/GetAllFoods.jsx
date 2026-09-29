import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const GetAllFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [cartLoading, setCartLoading] = useState("");

  const navigate = useNavigate();

  // Get logged-in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isRestaurant = user?.role === "restaurant";
  const isCustomer = user?.role === "customer";

  // Fetch Foods
  const fetchFoods = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        return toast.error("Please login first");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/food/getAllFoods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setFoods(response.data.foods);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch foods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Add To Cart
  const handleAddToCart = async (e, foodId) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      setCartLoading(foodId);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          foodId,
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
      setCartLoading("");
    }
  };

  // Delete Food
  const handleDeleteFood = async (foodId) => {
    try {
      setDeleteLoading(foodId);

      const token = localStorage.getItem("token");

      if (!token) {
        return toast.error("Please login as a restaurant");
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/food/deleteFood/${foodId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Food deleted successfully");

        setFoods((prevFoods) =>
          prevFoods.filter((food) => food._id !== foodId),
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete food");
    } finally {
      setDeleteLoading("");
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading foods...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col border-b border-gray-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold tracking-wide text-orange-400">
              {isRestaurant ? "MENU INVENTORY" : "QUICKBITE MENU"}
            </span>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              {isRestaurant ? "My Foods Collection" : "Explore Delicious Foods"}
            </h1>

            <p className="mt-1 text-sm text-gray-400 sm:text-base">
              {isRestaurant
                ? "Manage, update, or remove dishes from your restaurant live menu."
                : "Choose your favorite food and add it to your cart."}
            </p>
          </div>

          {/* TOTAL COUNT */}
          <div className="mt-4 inline-flex items-center gap-2 rounded border border-gray-800 bg-gray-900 px-4 py-2 text-sm font-semibold text-gray-300 shadow-sm sm:mt-0">
            <span className="h-2.5 w-2.5 animate-pulse rounded bg-orange-500"></span>
            Total Items:{" "}
            <span className="font-bold text-orange-400">{foods.length}</span>
          </div>
        </div>

        {/* NO FOOD */}
        {foods.length === 0 ? (
          <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-gray-800 bg-gray-900 p-12 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500/10 text-4xl text-orange-400 shadow-inner">
              🍽️
            </div>

            <h2 className="text-2xl font-bold text-white">
              No food items found
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              No food items are currently available.
            </p>
          </div>
        ) : (
          /* FOOD GRID */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => (
              <div
                key={food._id}
                onClick={() =>
                  navigate("/get-single-food", {
                    state: { foodId: food._id },
                  })
                }
                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded border border-gray-800 bg-gray-900 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-700 hover:shadow-xl"
              >
                {/* TOP */}
                <div>
                  <div className="flex items-start gap-4">
                    {/* IMAGE */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-32 sm:w-32">
                      <img
                        src={food.images?.[0]?.url}
                        alt={food.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      {/* CATEGORY */}
                      <span className="block w-fit max-w-full truncate rounded-md bg-orange-500/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                        {food.category}
                      </span>

                      {/* NAME */}
                      <h2 className="mt-2 truncate text-lg font-bold text-white transition-colors group-hover:text-orange-400">
                        {food.name}
                      </h2>

                      {/* PRICE */}
                      <div className="mt-1 text-lg font-black tracking-tight text-orange-400">
                        ₹{food.price}
                      </div>

                      {/* STATUS */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            food.isAvailable ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />

                        <span
                          className={`text-xs font-semibold ${
                            food.isAvailable
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {food.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
                    {food.description}
                  </p>
                </div>

                {/* BOTTOM */}
                <div className="mt-6 border-t border-gray-800 pt-4">
                  {/* RESTAURANT ACTIONS */}
                  {isRestaurant && (
                    <div className="flex items-center gap-3">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate("/restaurant/update-food", {
                            state: { food },
                          });
                        }}
                        className="flex-1 rounded-xl bg-gray-800 py-3 text-sm font-bold text-gray-200 transition-all hover:bg-gray-700 active:scale-95"
                      >
                        Edit Dish
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteFood(food._id);
                        }}
                        disabled={deleteLoading === food._id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500/10 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50 active:scale-95"
                      >
                        {deleteLoading === food._id ? (
                          <>
                            <svg
                              className="h-4 w-4 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />

                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  )}

                  {/* CUSTOMER ACTION */}
                  {isCustomer && (
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(e, food._id)}
                      disabled={!food.isAvailable || cartLoading === food._id}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 active:scale-95"
                    >
                      <ShoppingCart size={18} />

                      {cartLoading === food._id
                        ? "Adding..."
                        : food.isAvailable
                          ? "Add to Cart"
                          : "Unavailable"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllFoods;
