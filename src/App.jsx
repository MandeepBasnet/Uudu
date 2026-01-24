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
import MenuMain from "./pages/Menu/MenuMain";
import MenuMobile from "./pages/Menu/MenuMobile";
import Cook from "./pages/Cook";
import WhatsUudu from "./pages/WhatsUudu";
import Events from "./pages/Events";
import Location from "./pages/Location";

// Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Edit from "./pages/Edit";

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
  const showFooter = location.pathname === "/";
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isMobileMenuPage = location.pathname === "/menu-mobile";
  const isMenuPageMobile = location.pathname === "/menu" && isMobile;
  const isEditPage = location.pathname === "/edit";
  const shouldHideNavbar = isMobileMenuPage || isMenuPageMobile || isEditPage;

  return (
    <div className="flex min-h-screen flex-col bg-[#F2F2F2]">
      {isMobile ? (
        // Mobile: show only MenuMobile for any route, no navbar/footer
        <main className="flex-1">
          <Routes>
            <Route path="*" element={<MenuMobile />} />
          </Routes>
        </main>
      ) : (
        // Desktop: preserve existing routes and layout
        <>
          {/* Navbar - hidden on mobile menu views */}
          {!shouldHideNavbar && <Navbar />}

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Desktop Menu - with navbar */}
              <Route path="/menu" element={<MenuMain />} />

              {/* Mobile Menu - without navbar */}
              <Route path="/menu-mobile" element={<MenuMobile />} />

              {/* Other Pages */}
              <Route path="/cook" element={<Cook />} />
              <Route path="/whats-uudu" element={<WhatsUudu />} />
              <Route path="/events" element={<Events />} />
              <Route path="/location" element={<Location />} />
              
              {/* Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/edit" element={<Edit />} />

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
                    <p>404 – Page not found</p>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Footer visible on Home page only */}
          {showFooter && <Footer />}
        </>
      )}
    </div>
  );
}
