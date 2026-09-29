import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 w-fit">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🍔</span>
              </div>

              <span className="text-2xl font-extrabold text-white">
                Quick<span className="text-orange-500">Bite</span>
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 max-w-xs">
              Delicious food from your favorite restaurants, delivered fresh and
              fast to your doorstep.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition"
              >
                f
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition"
              >
                ◎
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition"
              >
                𝕏
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition"
              >
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <div className="space-y-3 text-sm">
              <Link to="/" className="block hover:text-orange-500 transition">
                Home
              </Link>

              <Link
                to="/restaurant"
                className="block hover:text-orange-500 transition"
              >
                Restaurants
              </Link>

              <Link
                to="/orders"
                className="block hover:text-orange-500 transition"
              >
                My Orders
              </Link>

              <Link
                to="/register"
                className="block hover:text-orange-500 transition"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">Support</h3>

            <div className="space-y-3 text-sm">
              <a href="#" className="block hover:text-orange-500 transition">
                Help Center
              </a>

              <a href="#" className="block hover:text-orange-500 transition">
                Contact Us
              </a>

              <a href="#" className="block hover:text-orange-500 transition">
                Privacy Policy
              </a>

              <a href="#" className="block hover:text-orange-500 transition">
                Terms & Conditions
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <span className="text-orange-500">📍</span>

                <p>
                  Delivering delicious food
                  <br />
                  right to your doorstep
                </p>
              </div>

              <div className="flex gap-3">
                <span className="text-orange-500">✉</span>

                <p>support@quickbite.com</p>
              </div>

              <div className="flex gap-3">
                <span className="text-orange-500">☎</span>

                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              © 2026 QuickBite. All rights reserved.
            </p>

            <p className="text-sm text-gray-500">
              Made with ❤️ for food lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
