import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const lastY = useRef(window.scrollY);
  const [hidden, setHidden] = useState(false);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav className="mt-4 mb-3 flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
          <a href="/" className="flex flex-col items-center px-4 py-3">
            <img
              src="/images/logo.png"
              alt="UUDU Logo"
              className="size-8 rounded-full object-cover"
            />
            <span
              className="text-xs font-semibold tracking-wide mt-1"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              UUDU
            </span>
          </a>
          <ul className="hidden gap-6 md:flex text-sm">
            {"Menu Cook Location What's Uudu? Events"
              .split(" ")
              .map((label, index, array) => (
                <li key={label} className="flex items-center">
                  <a
                    className="inline-block px-2 py-4 text-[#C84E00] hover:text-[#B73D00] transition-colors"
                    href={`/${label.toLowerCase().replace(/'|\s/g, "-")}`}
                  >
                    {label}
                  </a>
                  {index < array.length - 1 && (
                    <span className="ml-6 text-[#C84E00]">•</span>
                  )}
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
