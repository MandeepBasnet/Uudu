// src/pages/Location.jsx
import React from "react";

export default function Location() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      {/* Hero */}
      <div className="relative h-64 w-full">
        <img
          src="/images/location-hero.jpg"
          alt="Find Uudu"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1
            className="text-3xl sm:text-4xl font-semibold text-white text-center"
            style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
          >
            Find Uudu
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Map Placeholder */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="h-80 w-full bg-gray-200 flex items-center justify-center text-gray-500">
              <p className="text-center">[ Map Embed Placeholder ]</p>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              Uudu — Cypress Square
            </h2>
            <p className="text-gray-700 mb-2">
              4931 Lincoln Avenue <br />
              Cypress, CA 90630
            </p>
            <p className="text-gray-700 mb-4">Phone: (123) 456-7890</p>

            {/* Hours */}
            <h3
              className="text-lg font-semibold mt-6 mb-2"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              Opening Hours
            </h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>Mon – Thu: 11:00 AM – 9:00 PM</li>
              <li>Fri – Sat: 11:00 AM – 10:00 PM</li>
              <li>Sun: 12:00 PM – 8:00 PM</li>
            </ul>

            {/* CTA */}
            <div className="mt-6">
              <a
                href="https://maps.google.com?q=4931+Lincoln+Avenue+Cypress+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#C84E00] text-white px-5 py-2 rounded-xl shadow-sm hover:bg-[#A63E00] transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
