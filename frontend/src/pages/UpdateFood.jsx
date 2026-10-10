import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const UpdateFood = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const food = location.state?.food;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);

  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);

  // Load Food Data
  useEffect(() => {
    if (!food) {
      toast.error("Food not found");
      navigate("/get-all-foods");
      return;
    }

    setName(food.name || "");
    setDescription(food.description || "");
    setExistingImages(food.images || []);
    setPrice(food.price || "");
    setCategory(food.category || "");
    setIsAvailable(food.isAvailable ?? true);
  }, [food, navigate]);

  // --------------------------------
  // Select New Images
  // --------------------------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    const currentImageCount = existingImages.length;
    const selectedImageCount = images.length;

    const totalImages = currentImageCount + selectedImageCount + files.length;

    if (totalImages > 5) {
      const remainingSlots = 5 - currentImageCount - selectedImageCount;

      toast.error(
        remainingSlots > 0
          ? `You can add only ${remainingSlots} more image${
              remainingSlots !== 1 ? "s" : ""
            }. Maximum 5 images allowed.`
          : "Maximum 5 images already added.",
      );

      e.target.value = "";
      return;
    }

    setImages((prevImages) => [...prevImages, ...files]);

    e.target.value = "";
  };

  // --------------------------------
  // Remove New Selected Image
  // --------------------------------
  const handleRemoveSelectedImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  // --------------------------------
  // Remove Existing Image
  // --------------------------------
  const handleRemoveExistingImage = (image) => {
    // Add public_id to remove list
    setRemovedImageIds((prev) => {
      if (prev.includes(image.public_id)) {
        return prev;
      }

      return [...prev, image.public_id];
    });

    // Remove image from UI
    setExistingImages((prevImages) =>
      prevImages.filter((item) => item.public_id !== image.public_id),
    );
  };

  // --------------------------------
  // Update Food
  // --------------------------------
  const handleUpdateFood = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price || !category.trim()) {
      return toast.error("All fields are required");
    }

    // Final image count
    const totalImages = existingImages.length + images.length;

    if (totalImages === 0) {
      return toast.error("At least one image is required");
    }

    if (totalImages > 5) {
      return toast.error("Maximum 5 images are allowed");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login as a restaurant");
        return;
      }

      const formData = new FormData();

      // Food details
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", Number(price));
      formData.append("category", category.trim());
      formData.append("isAvailable", isAvailable);

      // Existing images which user wants to remove
      formData.append("removeImageIds", JSON.stringify(removedImageIds));

      // New images
      images.forEach((image) => {
        formData.append("files", image);
      });

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/food/updateFood/${food._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Food updated successfully");

        navigate("/get-all-foods");
      }
    } catch (error) {
      console.error("Update Food Error:", error);

      toast.error(error.response?.data?.message || "Failed to update food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl rounded-3xl border border-gray-800 bg-gray-900 p-7 shadow-xl sm:p-10">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-white">Update Food</h1>

        <p className="mt-1.5 mb-8 text-base text-gray-400">
          Update your food item details
        </p>

        <form onSubmit={handleUpdateFood} className="space-y-6">
          {/* Food Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Food Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4.5 py-3.5 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter food name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4.5 py-3.5 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter food description"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-300">
                Current Images ({existingImages.length}/5)
              </label>

              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                {existingImages.map((image, index) => (
                  <div
                    key={image.public_id || index}
                    className="relative h-36 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950"
                  >
                    {/* Image */}
                    <img
                      src={image.url}
                      alt={`${name} ${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />

                    {/* Remove Existing Image */}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-white shadow-lg backdrop-blur-sm transition hover:bg-red-500"
                      title="Remove image"
                    >
                      <X size={15} strokeWidth={2.5} />
                    </button>

                    {/* Image Number */}
                    <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Add New Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={existingImages.length + images.length >= 5}
              className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4.5 py-3.5 text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-orange-400 hover:file:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-2 text-xs text-gray-500">
              {existingImages.length + images.length >= 5
                ? "Maximum 5 images already added."
                : `You can add up to ${
                    5 - existingImages.length - images.length
                  } more image${
                    5 - existingImages.length - images.length !== 1 ? "s" : ""
                  }.`}
            </p>

            {/* Selected New Images */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 text-sm font-semibold text-gray-300">
                  New Selected Images ({images.length})
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={`${image.name}-${index}`}
                      className="group relative h-36 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950"
                    >
                      {/* Preview */}
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="h-full w-full object-cover"
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedImage(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-red-500"
                        title="Remove image"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>

                      {/* New Image Number */}
                      <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                        New {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Price
            </label>

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4.5 py-3.5 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter price"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4.5 py-3.5 text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Enter category"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3.5 pt-1">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-5 w-5 rounded-lg border-gray-800 bg-gray-950 text-orange-500 accent-orange-500 focus:ring-orange-500/20"
            />

            <label className="text-sm font-semibold text-gray-300">
              Food Available
            </label>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 py-4 text-base font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 active:scale-95"
          >
            {loading ? "Updating..." : "Update Food"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateFood;
