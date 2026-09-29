import React from "react";
import { Link } from "react-router-dom";

const RestaurantDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>

          <p className="mt-1 text-gray-400">
            Manage your food items from one place
          </p>
        </div>

        {/* Food CRUD */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Add Food Card */}
          <Link
            to="/restaurant/add-food"
            className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 p-6 transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-orange-400 transition group-hover:bg-orange-500/20">
              ➕
            </div>

            <h2 className="text-xl font-semibold">Add Food</h2>

            <p className="mt-2 text-sm text-gray-400">
              Add a new food item to your restaurant menu.
            </p>
          </Link>

          {/* Add more dashboard action cards here following the same structure */}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
