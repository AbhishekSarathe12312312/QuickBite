import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("You can select maximum 5 images");
      return;
    }

    setImages(files);
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category) {
      return toast.error("All fields are required");
    }

    if (images.length === 0) {
      return toast.error("At least one image is required");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        return toast.error("Please login as a restaurant");
      }

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("isAvailable", isAvailable);

      images.forEach((image) => {
        formData.append("files", image);
      });

      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/api/food/addFood",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Food added successfully");

        setName("");
        setDescription("");
        setImages([]);
        setPrice("");
        setCategory("");
        setIsAvailable(true);

        document.getElementById("food-images").value = "";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Add Food
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Add a new food item to your restaurant menu.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#1f2937] border border-slate-700/60 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

              <span className="text-xs font-medium text-slate-300">
                Live Menu Sync
              </span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleAddFood} className="p-6 sm:p-8 space-y-6">
            {/* NAME + CATEGORY */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* FOOD NAME */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Dish Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Spicy Masala Dosa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium"
                />
              </div>

              {/* CATEGORY */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category"
                  className="w-full px-4 py-3.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* PRICE + IMAGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* PRICE */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Base Price <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-400 pointer-events-none">
                    <span className="font-bold text-base">₹</span>
                  </div>

                  <input
                    type="number"
                    placeholder="599"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    className="w-full pl-9 pr-4 py-3.5 bg-[#0b0f19] border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Food Images <span className="text-red-500">*</span>
                </label>

                <input
                  id="food-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="w-full px-3 py-3 bg-[#0b0f19] border border-slate-800 rounded-xl text-slate-300 outline-none focus:border-red-500 transition-all text-sm file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:text-sm file:font-medium hover:file:bg-red-500"
                />

                <p className="text-xs text-slate-500 mt-2">
                  You can select up to 5 images.
                </p>

                {images.length > 0 && (
                  <p className="text-xs text-emerald-400 mt-1">
                    {images.length} image{images.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Dish Description
              </label>

              <textarea
                placeholder="Describe the ingredients, flavor profile, or what makes this dish special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full p-4 bg-[#0b0f19] border border-slate-800 rounded-xl text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium resize-none"
              />
            </div>

            {/* AVAILABILITY */}
            <div className="flex items-center justify-between p-4 bg-[#0b0f19] border border-slate-800 rounded-xl">
              <div>
                <span className="block text-sm font-semibold text-white">
                  Currently Available
                </span>

                <span className="text-xs text-slate-400">
                  Toggle to show or hide this item from your live menu
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {/* SUBMIT */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-500 active:scale-[0.99] disabled:opacity-50 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 h-5 w-5 text-white"
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
                    UPLOADING...
                  </>
                ) : (
                  "PUBLISH DISH TO MENU"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
