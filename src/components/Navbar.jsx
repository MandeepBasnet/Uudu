"use client";

import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const lastY = useRef(window.scrollY);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY.current && currentY > 64) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Define navigation links with labels and corresponding routes
  const navLinks = [
    { label: "Menu", path: "/menu" },
    { label: "Cook", path: "/cook" },
    { label: "Location", path: "/location" },
    // { label: "What's Uudu?", path: "/whats-uudu" },
    // { label: "Events", path: "/events" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="w-full px-4 sm:px-6">
        <nav className="mt-4 mb-3 rounded-2xl bg-white/60 supports-[backdrop-filter]:bg-white/40 backdrop-blur-md backdrop-saturate-150 ring-1 ring-white/50 shadow-md">
          <div className="flex items-center justify-between px-4 py-3">
            <a href="/" className="flex flex-row items-center gap-4">
              <img
                src="/images/logo.png"
                alt="UUDU Logo"
                className="w-16 h-16 rounded-full object-cover"
              />
              <span
                className="text-3xl font-bold tracking-wide text-[#99564c]"
                style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
              >
                UUDU
              </span>
            </a>
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[#6b3b34] hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-[#99564c]"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <ul className="hidden gap-6 lg:gap-8 md:flex text-2xl font-bold">
              {navLinks.map((link, index) => (
                <li key={link.label} className="flex items-center">
                  <a
                    className="inline-block px-2 py-4 text-[#6b3b34] hover:text-[#99564c] transition-colors"
                    href={link.path}
                  >
                    {link.label}
                  </a>
                  {index < navLinks.length - 1 && (
                    <span className="ml-6 text-[#6b3b34] font-bold">•</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden border-t border-[#99564c]/10 px-2 py-2">
              <ul className="flex flex-col text-lg font-bold">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      className="block w-full rounded-md px-3 py-3 text-[#6b3b34] hover:bg-white/40"
                      href={link.path}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
