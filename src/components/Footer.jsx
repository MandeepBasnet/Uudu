import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="pb-10 pt-6">
      <div className="w-full px-4 sm:px-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 items-start">
            {/* Location Section */}
            <div className="flex flex-col items-end">
              <div className="text-left">
                <h3
                  className="text-3xl font-semibold text-[#99564c] mb-4"
                  style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                >
                  Location
                </h3>
                <div className="space-y-2">
                  <p
                    className="text-2xl font-semibold text-[#3E3E3E]"
                    style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                  >
                    CYPRESS SQUARE
                  </p>
                  <div className="text-[#3E3E3E] text-xl">
                    <p>4931 Lincoln Avenue</p>
                    <p>Cypress, CA 90630</p>
                  </div>
                  <p className="text-[#3E3E3E] text-xl">(657) 256-1024</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=4931+Lincoln+Avenue%2C+Cypress%2C+CA+90630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-[#99564c] text-white px-4 py-2 rounded text-lg font-medium hover:bg-[#99564c]/80 transition-colors"
                >
                  MAP
                </a>
              </div>
            </div>

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

            {/* Store Image Section */}
            <div className="flex justify-center">
              <img
                src="/images/store-front.png"
                alt="UUDU Store Front - Ramen O Hack"
                className="w-full max-w-[18rem] sm:max-w-sm rounded-lg object-cover shadow-sm"
              />
            </div>

            {/* Hours Section */}
            <div className="flex flex-col items-end">
              <div className="text-left">
                <h3
                  className="text-3xl font-semibold text-[#99564c] mb-4"
                  style={{ fontFamily: "Bahnschrift, system-ui, sans-serif" }}
                >
                  Hours
                </h3>
                <div className="text-[#3E3E3E] text-xl">
                  <p>Mon – Thu: 11:00 AM – 9:00 PM</p>
                  <p>Fri – Sat: 11:00 AM – 10:00 PM</p>
                  <p>Sun: 12:00 PM – 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
