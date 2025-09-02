// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu/MenuMain";
import Category from "./pages/Menu/Category";
import Product from "./pages/Menu/Product";
import Cook from "./pages/Cook";
import Location from "./pages/Location";
import WhatsUudu from "./pages/WhatsUudu";
import Events from "./pages/Events";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-[#F2F2F2]">
        {/* Navbar stays across pages */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Menu & Product Routes */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:category" element={<Category />} />
            <Route path="/menu/:category/:productSlug" element={<Product />} />

            {/* Other Pages */}
            <Route path="/cook" element={<Cook />} />
            <Route path="/location" element={<Location />} />
            <Route path="/whats-uudu" element={<WhatsUudu />} />
            <Route path="/events" element={<Events />} />

            {/* Fallback */}
            <Route
              path="*"
              element={
                <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                  <p>404 — Page not found</p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Footer stays across pages */}
        <Footer />
      </div>
    </Router>
  );
}
