// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu/MenuMain";
import Cook from "./pages/Cook";
import WhatsUudu from "./pages/WhatsUudu";
import Events from "./pages/Events";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Router>
      <AppShell />
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </Router>
  );
}

function AppShell() {
  const location = useLocation();
  const hideFooter = location.pathname === "/menu";

  return (
    <div className="flex min-h-screen flex-col bg-[#F2F2F2]">
      {/* Navbar stays across pages */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Single Menu Page - no category routing needed */}
          <Route path="/menu" element={<Menu />} />

          {/* Other Pages */}
          <Route path="/cook" element={<Cook />} />
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

      {/* Footer stays across pages except /menu */}
      {!hideFooter && <Footer />}
    </div>
  );
}
