import React from "react";
import Footer from "../components/Footer";

export default function Location() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-6 md:pt-24 pb-20">
      {/* Logo header on mobile (desktop shows the navbar instead) */}
      <div className="lg:hidden pb-2 px-4 flex justify-center">
        <img
          src="/images/logo.png"
          alt="Uudu Logo"
          className="h-20 object-contain"
        />
      </div>

      {/* Display Footer component */}
      <Footer />
    </div>
  );
}
