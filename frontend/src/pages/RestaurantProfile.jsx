import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RestaurantProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    profilePic: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch Restaurant Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          const user = response.data.user;

          setProfile({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "restaurant",
            profilePic: user.profilePic || "",
          });

          setPreview(user.profilePic || "");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load profile",
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Handle Text Input
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Profile Image
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFile(selectedFile);

    const imagePreview = URL.createObjectURL(selectedFile);

    setPreview(imagePreview);
  };

  // Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.phone.trim()) {
      return toast.error("Name and phone are required");
    }

    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("phone", profile.phone);

      if (file) {
        formData.append("file", file);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Profile updated successfully");

        const user = response.data.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          role: user.role || "restaurant",
          profilePic: user.profilePic || "",
        });

        setPreview(user.profilePic || "");

        setFile(null);

        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profilePic: user.profilePic,
            role: user.role,
          }),
        );

        window.dispatchEvent(new Event("authChanged"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setLoading(false);
    }
  };

  // Page Loading
  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-orange-500" />

          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-14 min-h-screen bg-gray-950 px-3 py-8 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">

        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-xl font-bold">Restaurant Profile</h1>

            <p className="mt-0.5 text-xs text-gray-400">
              Manage your QuickBite restaurant profile and account settings
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/restaurant/dashboard")}
            className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition hover:bg-gray-200 active:scale-95"
          >
            Dashboard
          </button>
        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

          {/* LEFT */}

          <div className="flex flex-col items-center rounded-xl border border-gray-800/80 bg-gray-950 p-5 text-center lg:col-span-4">

            <label
              htmlFor="restaurant-profile-image"
              className="group relative cursor-pointer"
            >
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-3xl font-bold text-white shadow-lg">
                {preview ? (
                  <img
                    src={preview}
                    alt="Restaurant Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0)?.toUpperCase() || "R"
                )}
              </div>

              {/* PLUS */}

              <div className="absolute bottom-0.5 right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-950 bg-orange-500 text-sm font-bold text-white shadow-md transition group-hover:bg-orange-600">
                +
              </div>
            </label>

            <input
              id="restaurant-profile-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="mt-2 text-[11px] text-gray-500">
              Click avatar to update photo
            </p>

            <h2 className="mt-3 text-lg font-bold tracking-tight text-white">
              {profile.name || "Restaurant"}
            </h2>

            <span className="mt-1.5 rounded-full bg-orange-500/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Restaurant
            </span>
          </div>

          {/* RIGHT */}

          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* RESTAURANT NAME */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Restaurant Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-gray-800 bg-gray-950/60 px-3.5 py-2.5 text-sm text-gray-500 outline-none"
                  />

                  <p className="mt-1 text-[11px] text-gray-500">
                    Email cannot be changed.
                  </p>
                </div>

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter restaurant phone number"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
                  />
                </div>

                {/* ACCOUNT TYPE */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-xs font-semibold text-gray-300"
                  >
                    Account Type
                  </label>

                  <input
                    id="role"
                    type="text"
                    value="Restaurant"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-gray-800 bg-gray-950/60 px-3.5 py-2.5 text-sm text-gray-500 outline-none"
                  />
                </div>
              </div>

              {/* UPDATE */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 active:scale-95"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;