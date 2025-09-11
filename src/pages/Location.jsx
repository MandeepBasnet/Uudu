import React from "react";

export default function Location() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      {/* Hero */}
      <div className="relative h-60 w-full">
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
          {/* Map Embed */}
          <div
            id="map"
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.4631394166847!2d-118.04061468478428!3d33.83221658066949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dd2c2b7f7b7b7b%3A0x7f7b7b7b7b7b7b7b!2s4931%20Lincoln%20Ave%2C%20Cypress%2C%20CA%2090630%2C%20USA!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Uudu Location Map"
            ></iframe>
          </div>

          {/* Store Info */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
            >
              UUDU — Cypress Square
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
              {/* Left column: Address, Title, Button */}
              <div>
                <p className="text-gray-700 mb-2">
                  4931 Lincoln Avenue <br />
                  Cypress, CA 90630
                </p>
                <p className="text-gray-700 mb-4">Phone: (123) 456-7890</p>

                <a
                  href="https://maps.google.com?q=4931+Lincoln+Avenue+Cypress+CA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#99564c] text-white px-5 py-2 rounded-xl shadow-sm hover:bg-[#A63E00] transition-colors"
                >
                  Open Map
                </a>
              </div>

              {/* Right column: Hours aligned to top */}
              <div className="mt-6 md:mt-0">
                <h3
                  className="text-lg mb-2"
                  style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                >
                  Opening Hours
                </h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Mon – Thu: 11:00 AM – 9:00 PM</li>
                  <li>Fri – Sat: 11:00 AM – 10:00 PM</li>
                  <li>Sun: 12:00 PM – 8:00 PM</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
