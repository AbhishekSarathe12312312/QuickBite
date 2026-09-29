import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-orange-500 selection:text-white">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-950 to-gray-950 pt-8 pb-16 lg:py-24">
        {/* Background Decorative Glows */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 animate-[fadeIn_0.5s_ease-in-out]">
              <div className="inline-flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
                <span className="animate-pulse">🔥</span>
                <span>Craving something delicious? Order now</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Delicious Food, <br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Delivered Hot & Fast
                </span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl mt-6 max-w-xl leading-relaxed font-normal">
                From cheesy pizzas to juicy burgers, explore top-rated local
                restaurants and satisfy your hunger in minutes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Get Started</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </Link>

                <Link
                  to="/login"
                  className="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white px-8 py-4 rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>

              {/* Small Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 border-t border-gray-800">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    500+
                  </h3>
                  <p className="text-sm font-medium text-gray-400 mt-0.5">
                    Restaurants
                  </p>
                </div>

                <div className="border-x border-gray-800 px-4 sm:px-6">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    10K+
                  </h3>
                  <p className="text-sm font-medium text-gray-400 mt-0.5">
                    Food Lovers
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    30 min
                  </h3>
                  <p className="text-sm font-medium text-gray-400 mt-0.5">
                    Fast Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Right Graphic - Food Cards Stack */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-amber-500/10 rounded-[3rem] blur-2xl transform rotate-3"></div>

              <div className="relative w-full max-w-md bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2.5rem] p-3 shadow-2xl shadow-orange-500/20">
                <div className="bg-gray-900 rounded-[2.2rem] p-6 sm:p-8 text-center shadow-inner border border-gray-800/60">
                  {/* Floating food badges preview */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-4xl mb-1">🍕</span>
                      <span className="text-xs font-bold text-white">
                        Cheesy Pizza
                      </span>
                      <span className="text-[10px] text-orange-400 font-semibold mt-0.5">
                        🔥 Popular
                      </span>
                    </div>

                    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-4xl mb-1">🍔</span>
                      <span className="text-xs font-bold text-white">
                        Juicy Burger
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold mt-0.5">
                        ⭐ 4.9 Rating
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl">
                        🚀
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold">Lightning Fast</p>
                        <p className="text-[10px] text-gray-400">
                          Delivery in 30 mins
                        </p>
                      </div>
                    </div>
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOD CATEGORIES PREVIEW ================= */}
      <section className="py-16 bg-gray-950 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-orange-400 font-bold text-xs uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-500/20">
                Categories
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
                What's on your mind?
              </h2>
            </div>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Explore our wide variety of delicious food categories
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Pizza", icon: "🍕", count: "120+ spots" },
              { name: "Burgers", icon: "🍔", count: "95+ spots" },
              { name: "Asian", icon: "🍜", count: "80+ spots" },
              { name: "Desserts", icon: "🍰", count: "65+ spots" },
              { name: "Healthy", icon: "🥗", count: "40+ spots" },
              { name: "Beverages", icon: "🥤", count: "50+ spots" },
            ].map((cat, idx) => (
              <div
                key={idx}
                className="group bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-orange-500/40 rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto bg-gray-950 rounded-2xl border border-gray-800 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gray-900/50 py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-widest bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-500/20">
              Why Choose Us
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Everything you need for a great meal
            </h2>

            <p className="text-gray-400 mt-3 text-base md:text-lg">
              QuickBite makes ordering your favorite food simple, fast, and
              convenient.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {/* Feature 1 */}
            <div className="group bg-gray-900 border border-gray-800 hover:border-orange-500/40 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm border border-orange-500/20">
                🚀
              </div>

              <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                Lightning Fast Delivery
              </h3>

              <p className="text-gray-400 mt-2.5 text-sm md:text-base leading-relaxed">
                Get your favorite meals delivered fresh, hot, and straight to
                your doorstep within 30 minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-900 border border-gray-800 hover:border-orange-500/40 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm border border-orange-500/20">
                🍔
              </div>

              <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                Top Quality Restaurants
              </h3>

              <p className="text-gray-400 mt-2.5 text-sm md:text-base leading-relaxed">
                Explore a handpicked wide variety of delicious dishes from the
                highest-rated local restaurants.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-900 border border-gray-800 hover:border-orange-500/40 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm border border-orange-500/20">
                🔒
              </div>

              <h3 className="text-xl font-bold text-white mt-6 tracking-tight">
                Safe & Secure Payments
              </h3>

              <p className="text-gray-400 mt-2.5 text-sm md:text-base leading-relaxed">
                Enjoy hassle-free checkout with multiple secure payment methods
                and instant order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-black/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Ready to order something delicious?
          </h2>

          <p className="text-orange-100 mt-4 text-base md:text-lg max-w-xl mx-auto font-normal">
            Create your QuickBite account today and get your first meal
            delivered with zero delivery fees!
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-gray-950 text-white hover:bg-gray-900 border border-gray-800 px-9 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <Footer />

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

export default Home;
